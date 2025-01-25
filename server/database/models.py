from server.database.database import Database, models

database = Database()
Unit, Owner, Payment = models(database)
