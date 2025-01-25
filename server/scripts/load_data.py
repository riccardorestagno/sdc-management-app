import json
from server.database.database import Database, models


def load_data_from_json(file_path):
    with open(file_path, "r") as file:
        data = json.load(file)

    # Initialize the database schema
    db = Database("sqlite:///../data/condo.db")
    Unit, Owner, Payment = models(db)
    db.init_db()

    # Create a new session
    db_session = db.SessionLocal()
    try:
        for address, years in data.items():
            # Add unit if it exists
            unit = db_session.query(Unit).filter_by(address=address).one_or_none()
            if not unit:
                unit = Unit(address=address)
                db_session.add(unit)
                db_session.commit()
                db_session.refresh(unit)

            # Add payments
            for year, details in years.items():
                payment = Payment(
                    unit_id=unit.id,
                    year=year,
                    amount_owed=details["amount_owed"],
                    amount_paid=details["amount_paid"],
                    special_contribution_paid=details["special_contribution_paid"]
                )
                db_session.add(payment)
            db_session.commit()
    finally:
        db_session.close()


if __name__ == "__main__":
    load_data_from_json("../data/data.json")
