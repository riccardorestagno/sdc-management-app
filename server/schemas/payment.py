from pydantic import BaseModel
from enums.payment import PayFrequency, Month


class InitializeFiscalYearRequest(BaseModel):
    percent_increase: float
    special_contribution_amount: int


class PaymentUpdateRequest(BaseModel):
    address: str
    pay_frequency: PayFrequency
    month: Month
    paid: bool
