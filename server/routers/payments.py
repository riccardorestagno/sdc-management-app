from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import distinct
from sqlalchemy.sql import exists
from sqlalchemy.orm import Session
from server.database.session import get_db
from server.database.models import Unit, Payment, FiscalYear
from server.schemas.payment import InitializeFiscalYearRequest, PaymentUpdateRequest
from server.enums.payment import PayFrequency

router = APIRouter()


@router.get("/{year}")
def get_payments(year: int, db: Session = Depends(get_db)):
    """Fetch payment data for a specific year."""
    payments = db.query(Payment).join(Unit).filter(Payment.year == year).all()
    return [
        {
            "address": payment.unit.address,
            "amount_owed": payment.amount_owed,
            "amount_paid": payment.amount_paid,
            "monthly_payment": round(payment.amount_owed / 12, 2),
            "months_paid": round(payment.amount_paid / (payment.amount_owed / 12), 0),
            "special_contribution_paid": payment.special_contribution_paid,
        }
        for payment in payments
    ]


@router.post("/{year}/init")
def initialize_fiscal_year(
    year: int,
    request: InitializeFiscalYearRequest,
    db: Session = Depends(get_db)
):
    """Create or modify the current or future fiscal year based on the previous year's data."""
    current_year = datetime.now().year

    # Ensure the provided year is current or future
    if year < current_year:
        raise HTTPException(status_code=400, detail="Cannot create or modify past fiscal years")

    previous_year = year - 1
    previous_payments = db.query(Payment).filter(Payment.year == previous_year).all()

    if not previous_payments:
        raise HTTPException(status_code=404, detail=f"No payments found for {previous_year}")

    existing_payments = db.query(exists().where(Payment.year == year)).scalar()
    if existing_payments:
        raise HTTPException(status_code=400, detail="Fiscal year already exists. Delete fiscal year in order to create a new one.")

    new_payments = []
    for payment in previous_payments:
        updated_amount_owed = round(payment.amount_owed * (1 + request.percent_increase / 100), 2)

        new_payments.append(Payment(
            unit_id=payment.unit_id,
            year=year,
            amount_owed=updated_amount_owed,
            amount_paid=0,  # New fiscal year starts with no payments made
            special_contribution_paid=0
        ))

    new_payments.append(FiscalYear(
        year=year,
        special_contribution_amount=request.special_contribution_amount,
    ))

    # Save new records
    db.add_all(new_payments)
    db.commit()

    return {"message": f"Fiscal year {year} created/updated with a {request.percent_increase}% increase"}


@router.delete("/{year}")
def delete_fiscal_year(year: int, db: Session = Depends(get_db)):
    """Delete a fiscal year, only if it is in the future."""
    current_year = datetime.now().year

    if year <= current_year:
        raise HTTPException(status_code=400, detail="Cannot delete past or current fiscal years")

    # Check if the year exists
    payments_to_delete = db.query(Payment).filter(Payment.year == year).all()
    fiscal_year_to_delete = db.query(FiscalYear).filter(FiscalYear.year == year).one_or_none()

    if not payments_to_delete and not fiscal_year_to_delete:
        raise HTTPException(status_code=404, detail=f"No payments found for fiscal year {year}")

    # Delete records
    for payment in payments_to_delete:
        db.delete(payment)

    if fiscal_year_to_delete:
        db.delete(fiscal_year_to_delete)

    db.commit()

    return {"message": f"Fiscal year {year} deleted successfully"}


@router.put("/{year}")
def update_payments(year: int, payment: PaymentUpdateRequest, db: Session = Depends(get_db)):
    """Update payment record."""
    unit = db.query(Unit).filter(Unit.address == payment.address).one_or_none()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    payment_record = db.query(Payment).filter(Payment.unit_id == unit.id, Payment.year == year).one_or_none()
    if not payment_record:
        raise HTTPException(status_code=404, detail=f"Payment record not found. Please initialize the fiscal year '{year}'.")

    if payment.pay_frequency == PayFrequency.SPECIAL_CONTRIBUTION:
        payment_record.special_contribution_paid = payment.paid
    else:
        payment_record.amount_paid = payment_record.amount_owed / 12 * (payment.month + (payment.pay_frequency if payment.paid else 0))

    db.commit()
    db.refresh(payment_record)

    return {"message": "Payment updated successfully", "payment_id": payment_record.id, "data": payment_record}
