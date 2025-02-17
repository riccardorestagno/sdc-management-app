from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship


class Database:
    def __init__(self, database_url="sqlite:///data/condo.db"):
        """Initialize the database connection dynamically."""
        self.engine = create_engine(database_url, connect_args={"check_same_thread": False})
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self.Base = declarative_base()

    def init_db(self):
        """Initialize the database and create tables."""
        self.Base.metadata.create_all(bind=self.engine)

    def get_db(self):
        """Dependency for getting a database session."""
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()


# Define models (Must use the same Base instance from the Database class)
def models(db: Database):
    class Unit(db.Base):
        __tablename__ = "units"
        id = Column(Integer, primary_key=True, index=True)
        address = Column(String, unique=True, nullable=False)
        last_water_heater_replacement = Column(Date, nullable=True)
        has_tankless_heater = Column(Boolean, default=False)
        payment_records = relationship("Payment", back_populates="unit")
        owner = relationship("Owner", back_populates="unit")

    class Owner(db.Base):
        __tablename__ = "owners"
        id = Column(Integer, primary_key=True, index=True)
        unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
        name = Column(String, unique=True, nullable=False)
        email = Column(String, unique=True, nullable=False)
        number = Column(String, unique=True, nullable=False)
        admin = Column(Boolean, default=False)
        unit = relationship("Unit", back_populates="owner")

    class Payment(db.Base):
        __tablename__ = "payments"
        id = Column(Integer, primary_key=True, index=True)
        unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
        year = Column(String, nullable=False)
        amount_owed = Column(Float, nullable=False)
        amount_paid = Column(Float, nullable=False)
        special_contribution_paid = Column(Boolean, default=False)
        unit = relationship("Unit", back_populates="payment_records")

    class FiscalYear(db.Base):
        __tablename__ = "fiscal_years"
        id = Column(Integer, primary_key=True, index=True)
        year = Column(String, nullable=False)
        special_contribution_amount = Column(Float, nullable=False)

    db.Base.metadata.create_all(bind=db.engine)  # Ensure tables are created

    return Unit, Owner, Payment, FiscalYear  # Return the models so they can be used elsewhere
