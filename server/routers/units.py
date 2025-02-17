from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database.session import get_db
from server.database.models import Unit

router = APIRouter()


@router.get("/")
def read_units(db: Session = Depends(get_db)):
    """Fetch all units and their payments."""
    units = db.query(Unit).all()
    result = [
        {
            "address": unit.address,
            "last_water_heater_replacement": unit.last_water_heater_replacement,
            "has_tankless_heater": unit.has_tankless_heater,
            "payments": [{"year": p.year, "amount_owed": p.amount_owed, "amount_paid": p.amount_paid, "special_contribution_paid": p.special_contribution_paid} for p in unit.payment_records],
            "owner_info": unit.owner,
        }
        for unit in units
    ]
    return result
