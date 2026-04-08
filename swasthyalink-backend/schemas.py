from pydantic import BaseModel
from typing import Optional, List

# --- PYDANTIC SCHEMAS (How data comes in and goes out of the API) ---

# Schema for the data coming FROM the frontend when registering
class UserCreate(BaseModel):
    mobile_number: str
    name: str
    age: int
    height: float
    weight: float
    location: str

# Schema for the data going TO the frontend when returning a user
class UserResponse(UserCreate):
    id: int

    class Config:
        from_attributes = True

# Schema for creating a new triage record
class TriageRecordCreate(BaseModel):
    symptoms: str
    probable_ailment: str
    care_points: str
    recommended_specialist: str

class TriageRecordResponse(TriageRecordCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
        user_id: int
        symptoms: str