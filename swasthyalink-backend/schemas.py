from pydantic import BaseModel
from typing import Optional, List


class PatientProfile(BaseModel):
    """Health context sent by the client (e.g. from Firestore); all fields optional."""

    age: Optional[int] = None
    gender: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    location: Optional[str] = None
    conditions: Optional[List[str]] = None


class ChatRequest(BaseModel):
    symptoms: str
    patient: Optional[PatientProfile] = None


class TriageAssessment(BaseModel):
    """Structured triage output returned to the client (not persisted on the server)."""

    symptoms: str
    probable_ailment: str
    care_points: str
    recommended_specialist: str
