from database.database import Database, models

database = Database()
Unit, Owner, Payment, FiscalYear = models(database)


def get_db():
    """Dependency that yields a database session."""
    yield from database.get_db()
