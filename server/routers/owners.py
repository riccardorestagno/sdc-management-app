from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from schemas.owner import OwnerUpdateRequest
from database.session import get_db
from database.models import Owner, Unit

router = APIRouter()


@router.get("/{owner_id}")
def read_owner(owner_id: int, db: Session = Depends(get_db)):
    """Fetch owner data given the owners ID"""
    owner = db.query(Owner).filter(Owner.id == owner_id).one_or_none()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner data not found")

    return owner


@router.get("/unit/{unit_address_id}")
def read_owner(unit_address_id: str, db: Session = Depends(get_db)):
    """Fetch owner data given the owners unit address ID"""
    owner = db.query(Owner).filter(Owner.unit.has(address=unit_address_id)).one_or_none()

    if not owner:
        return {}

    current_year = datetime.now().year
    monthly_fee = next(
        (record.amount_owed for record in owner.unit.payment_records if int(record.year) == current_year),
        None  # Default to None if no matching record is found
    ) / 12

    return {
        "name": owner.name,
        "email": owner.email,
        "number": owner.number,
        "monthly_fee": monthly_fee
    }


@router.put("/unit/{unit_address_id}")
def upsert_owner(unit_address_id: str, owner_update: OwnerUpdateRequest, db: Session = Depends(get_db)):
    """Update owner data if exists, otherwise create a new owner entry"""

    # Try to find the owner based on the unit address
    owner = db.query(Owner).filter(Owner.unit.has(address=unit_address_id)).one_or_none()

    if owner:
        # Update existing owner
        if owner_update.name is not None:
            owner.name = owner_update.name
        if owner_update.email is not None:
            owner.email = owner_update.email
        if owner_update.number is not None:
            owner.number = owner_update.number
        message = "Owner updated successfully"
    else:
        # Check if the unit exists
        unit = db.query(Unit).filter(Unit.address == unit_address_id).one_or_none()
        if not unit:
            raise HTTPException(status_code=404, detail="Unit not found")

        # Create a new owner
        owner = Owner(
            name=owner_update.name,
            email=owner_update.email,
            number=owner_update.number,
            unit_id=unit.id
        )
        db.add(owner)
        message = "Owner created successfully"

    db.commit()
    db.refresh(owner)  # Refresh to get updated data from DB

    return {"message": message, "owner": owner}
