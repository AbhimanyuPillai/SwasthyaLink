from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

# Create the SQLite database locally
SQLALCHEMY_DATABASE_URL = "sqlite:///./swasthyalink.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# --- SQLALCHEMY MODELS (How data is saved in DB) ---

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    mobile_number = Column(String, unique=True, index=True)
    name = Column(String)
    age = Column(Integer)
    height = Column(Float)
    weight = Column(Float)
    location = Column(String)
    photo_url = Column(String, nullable=True)

    # Links a user to their medical records/triage reports
    records = relationship("TriageRecordDB", back_populates="patient")


class TriageRecordDB(Base):
    __tablename__ = "triage_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    symptoms = Column(String)
    probable_ailment = Column(String)
    care_points = Column(String)
    recommended_specialist = Column(String)

    patient = relationship("UserDB", back_populates="records")

# This automatically creates the tables in the database file when you run the app
Base.metadata.create_all(bind=engine)


def _ensure_user_photo_url_column():
    """
    Minimal SQLite migration: add users.photo_url if missing.
    Keeps dev experience simple without Alembic.
    """
    with engine.connect() as conn:
        rows = conn.execute(text("PRAGMA table_info(users)")).fetchall()
        existing_cols = {row[1] for row in rows}  # row[1] = column name
        if "photo_url" not in existing_cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN photo_url VARCHAR"))
            conn.commit()


_ensure_user_photo_url_column()