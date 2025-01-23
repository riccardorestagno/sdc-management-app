import math

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import Database, database_models

# Initialize the database and models
database = Database()
Unit, Owner, Payment = database_models(database)
database.init_db()

# FastAPI app setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change to specific frontend domain in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/units")
def read_units(
    db: Session = Depends(database.get_db)
):
    """Fetch all units and their payments."""
    units = db.query(Unit).all()
    result = []
    for unit in units:
        unit_data = {"address": unit.address, "payments": [], "owner_info": unit.owner}
        for payment in unit.payments:
            unit_data["payments"].append(
                {"year": payment.year, "amount_owed": payment.amount_owed, "amount_paid": payment.amount_paid, "special_contribution_paid": payment.special_contribution_paid}
            )
        result.append(unit_data)
    return result


@app.get("/payments/{year}")
def get_payments(
    year: int,
    db: Session = Depends(database.get_db)
):
    """Retrieve payment data for a specific year, split by condo units."""
    query = (
        db.query(Payment)
        .join(Unit)
        .filter(Payment.year == year)
    )

    payments = query.all()

    result = [
        {
            "address": payment.unit.address,
            "amount_owed": payment.amount_owed,
            "amount_paid": payment.amount_paid,
            "monthly_payment": round(payment.amount_owed / 12, 2),
            "months_paid": math.floor(payment.amount_paid / (payment.amount_owed / 12)),
            "special_contribution_paid": payment.special_contribution_paid,
        }
        for payment in payments
    ]

    return result
