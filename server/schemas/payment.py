from pydantic import BaseModel
from server.enums.payment import PayFrequency, Month


class InitializeFiscalYearRequest(BaseModel):
    percent_increase: float


class PaymentUpdateRequest(BaseModel):
    address: str
    pay_frequency: PayFrequency
    month: Month
    paid: bool
