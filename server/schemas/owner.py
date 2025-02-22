from pydantic import BaseModel


class OwnerUpdateRequest(BaseModel):
    name: str
    email: str
    number: str
