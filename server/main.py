from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import Database, database_models

# Initialize the database and models
database = Database()
Unit, Owner, Payment = database_models(database)
database.init_db()

# FastAPI app setup
app = FastAPI()


@app.get("/units")
def read_units(db: Session = Depends(database.get_db)):
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
