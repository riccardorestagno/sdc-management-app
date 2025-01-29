from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database.session import get_db
from server.database.models import Owner

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

    return owner
