from pydantic import BaseModel
from server.enums.payment import PayFrequency, Month


class PaymentUpdate(BaseModel):
    address: str
    pay_frequency: PayFrequency
    month: Month
    paid: bool
