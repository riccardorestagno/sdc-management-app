from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import distinct, desc
from sqlalchemy.orm import Session
from server.database.session import get_db
from server.database.models import FiscalYear

router = APIRouter()


@router.get("/")
def get_unique_years(db: Session = Depends(get_db)):
    return db.query(FiscalYear).order_by(desc(FiscalYear.year)).all()


@router.get("/{id}")
def read_fiscal_year_by_id(fiscal_year_id: int, db: Session = Depends(get_db)):
    """Fetch fiscal year data given the fiscal year ID"""
    fiscal_year = db.query(FiscalYear).filter(FiscalYear.id == fiscal_year_id).one_or_none()
    if not fiscal_year:
        raise HTTPException(status_code=404, detail="Fiscal year data not found")

    return fiscal_year


@router.get("/year/{year}")
def read_fiscal_year_by_year(year: str, db: Session = Depends(get_db)):
    """Fetch fiscal year data given the year"""
    fiscal_year = db.query(FiscalYear).filter(FiscalYear.year == year).one_or_none()
    if not fiscal_year:
        return {}

    return fiscal_year
