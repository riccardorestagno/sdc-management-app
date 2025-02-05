import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.database.session import database
from server.routers import units, owners, payments, fiscalyears

# Initialize database
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


# Include routers
app.include_router(units.router, prefix="/units", tags=["Units"])
app.include_router(owners.router, prefix="/owners", tags=["Owners"])
app.include_router(payments.router, prefix="/payments", tags=["Payments"])
app.include_router(fiscalyears.router, prefix="/fiscal-years", tags=["FiscalYears"])


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
