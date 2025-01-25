from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import distinct
from sqlalchemy.orm import Session
from server.database.session import get_db
from server.database.models import Unit, Payment
from server.schemas.payment import PaymentUpdate
from server.enums.payment import PayFrequency

router = APIRouter()


@router.get("/years", response_model=list[int])
def get_unique_years(db: Session = Depends(get_db)):
    years = db.query(distinct(Payment.year)).all()
    return [year[0] for year in years]


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


@router.put("/{year}")
def update_payments(year: int, payment: PaymentUpdate, db: Session = Depends(get_db)):
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
