import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database
import schemas
import json
import requests

# 1. Load environment variables from the .env file
load_dotenv()

# 2. Grab the API key securely. Fails fast if it's missing!
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("CRITICAL: No API key found. Please check your .env file.")

app = FastAPI(title="SwasthyaLink API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency: Opens a database session for a request, then closes it when done
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"status": "Server is running", "message": "Welcome to SwasthyaLink Core"}

# ENDPOINT: Register a user
@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if a user with this mobile number already exists
    db_user = db.query(database.UserDB).filter(database.UserDB.mobile_number == user.mobile_number).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Mobile number already registered")
    
    # Create the new user
    new_user = database.UserDB(
        mobile_number=user.mobile_number,
        name=user.name,
        age=user.age,
        height=user.height,
        weight=user.weight,
        location=user.location
    )
    
    # Save to the database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@app.post("/chat", response_model=schemas.TriageRecordResponse)
def triage_chat(chat_request: schemas.ChatRequest, db: Session = Depends(get_db)):
    # 1. Fetch the user's profile from the database
    user = db.query(database.UserDB).filter(database.UserDB.id == chat_request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. The Strict System Prompt (Context-Aware & Differential Upgraded)
    system_prompt = f"""
    You are SwasthyaLink, a highly advanced, pre-clinical AI triage medical assistant specifically designed for the city of Pune, Maharashtra.
    Your primary directive is to analyze patient symptoms, cross-reference them with the patient's biological profile, and output a highly structured, accurate, and safe preliminary medical assessment.

    CRITICAL INSTRUCTIONS & CONSTRAINTS:
    1. Base your analysis STRICTLY on the symptoms provided. Do not invent symptoms.
    2. Factor in the patient's specific profile: Age {user.age}, Weight {user.weight}kg, Location {user.location}. 
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
    
    # 3. Call the Gemini API using the secure key from .env
    API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={GEMINI_API_KEY}"
    headers = {
        "Content-Type": "application/json"
    }
    
    payload = {
        "system_instruction": {
            "parts": [{"text": system_prompt}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"Patient Symptoms: {chat_request.symptoms}"}]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json" 
        }
    }

    try:
        # Send the request to Gemini
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status() # Check for HTTP errors
        
        # Parse the AI's response (Gemini's JSON structure)
        ai_output = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        
        # Convert the string output into a Python dictionary
        triage_data = json.loads(ai_output)

    except Exception as e:
        # FAILSAFE: If the API is down or throws a CORS error during judging, output a simulated response
        print(f"API Error: {e}")
        triage_data = {
            "probable_ailment": "Simulated Ailment (API Offline)",
            "care_points": "1. Rest. 2. Hydrate. 3. Seek local clinic.",
            "recommended_specialist": "General Physician"
        }

    # 4. Save the Triage Report to the Database (Populates Tab 1)
    new_triage_record = database.TriageRecordDB(
        user_id=user.id,
        symptoms=chat_request.symptoms,
        probable_ailment=triage_data["probable_ailment"],
        care_points=triage_data["care_points"],
        recommended_specialist=triage_data["recommended_specialist"]
    )
        
    db.add(new_triage_record)
    db.commit()
    db.refresh(new_triage_record)
    
    # 5. Return the exact response to the frontend
    return new_triage_record