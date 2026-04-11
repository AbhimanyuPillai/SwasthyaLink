import json
import os
from pathlib import Path
from typing import Optional

import requests
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import schemas

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("CRITICAL: No API key found. Please check your .env file.")

app = FastAPI(title="SwasthyaLink API")

# CORS: set ALLOWED_ORIGINS to a comma-separated list (e.g. your Vercel URL) for credentialed
# browser requests. If unset, all origins are allowed without credentials (typical for simple JSON fetch).
_allowed_raw = os.getenv("ALLOWED_ORIGINS", "").strip()
if _allowed_raw:
    _allow_origins = [o.strip() for o in _allowed_raw.split(",") if o.strip()]
    _allow_credentials = True
else:
    _allow_origins = ["*"]
    _allow_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allow_origins,
    allow_credentials=_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


@app.get("/")
def read_root():
    return {"status": "Server is running", "message": "Welcome to SwasthyaLink Core"}


def _patient_context_block(patient: Optional[schemas.PatientProfile]) -> str:
    if not patient:
        return "Patient profile: not provided; use general adult guidance for Pune, Maharashtra."
    parts = []
    if patient.age is not None:
        parts.append(f"Age {patient.age}")
    if patient.gender:
        parts.append(f"Gender {patient.gender}")
    if patient.weight_kg is not None:
        parts.append(f"Weight {patient.weight_kg} kg")
    if patient.height_cm is not None:
        parts.append(f"Height {patient.height_cm} cm")
    if patient.location:
        parts.append(f"Location {patient.location}")
    else:
        parts.append("Location Pune, Maharashtra (default)")
    if patient.conditions:
        parts.append(f"Known conditions / concerns: {', '.join(patient.conditions)}")
    return "Patient profile: " + "; ".join(parts) + "."


@app.post("/chat", response_model=schemas.TriageAssessment)
def triage_chat(chat_request: schemas.ChatRequest):
    patient = chat_request.patient
    profile_line = _patient_context_block(patient)

    system_prompt = f"""
    You are SwasthyaLink, a highly advanced, pre-clinical AI triage medical assistant specifically designed for the city of Pune, Maharashtra.
    Your primary directive is to analyze patient symptoms, cross-reference them with the patient's biological profile, and output a highly structured, accurate, and safe preliminary medical assessment.

    CRITICAL INSTRUCTIONS & CONSTRAINTS:
    1. Base your analysis STRICTLY on the symptoms provided. Do not invent symptoms.
    2. Factor in the patient's specific profile. {profile_line}
    3. Consider the current local context (Pune epidemiology).
    4. MULTIPLE PROBABILITIES: Do not provide a single definitive diagnosis. Provide the most statistically likely condition first, followed by other probable considerations in parentheses.
    5. Provide exactly 3 Actionable Care/Caution Points (maximum 5-7 words per point). Point 3 MUST always be a variation of "Doctor must confirm final diagnosis."
    6. Identify the exact medical specialist the patient needs to see (e.g., General Physician, Pulmonologist, Cardiologist).

    OUTPUT STRICTLY IN JSON FORMAT. DO NOT ADD ANY CONVERSATIONAL TEXT.
    Format exactly like this:
    {{
        "probable_ailment": "Most Likely Condition (Also consider: [Condition B], [Condition C])",
        "care_points": "1. [Short point one]. 2. [Short point two]. 3. Doctor must confirm final diagnosis.",
        "recommended_specialist": "Exact Doctor Specialty"
    }}
    """

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"Patient Symptoms: {chat_request.symptoms}"}],
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
        },
    }

    try:
        response = requests.post(api_url, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        ai_output = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        triage_data = json.loads(ai_output)
    except Exception as e:
        print(f"API Error: {e}")
        triage_data = {
            "probable_ailment": "Simulated Ailment (API Offline)",
            "care_points": "1. Rest. 2. Hydrate. 3. Seek local clinic.",
            "recommended_specialist": "General Physician",
        }

    return schemas.TriageAssessment(
        symptoms=chat_request.symptoms,
        probable_ailment=triage_data["probable_ailment"],
        care_points=triage_data["care_points"],
        recommended_specialist=triage_data["recommended_specialist"],
    )
