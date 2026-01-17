import uuid
from typing import Optional, List
from sqlalchemy import String, Text, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector
import enum

from .base import Base
from .core import User

class JobStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    CLOSED = "CLOSED"

class ApplicationStatus(str, enum.Enum):
    APPLIED = "APPLIED"
    SCREENING = "SCREENING"
    INTERVIEW = "INTERVIEW"
    OFFER = "OFFER"
    HIRED = "HIRED"
    REJECTED = "REJECTED"

class Job(Base):
    __tablename__ = "jobs"

    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[JobStatus] = mapped_column(Enum(JobStatus), default=JobStatus.DRAFT, nullable=False)
    required_skills: Mapped[list] = mapped_column(JSONB, default=[], nullable=False)
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)

    creator: Mapped[Optional["User"]] = relationship("User")
    applications: Mapped[List["Application"]] = relationship("Application", back_populates="job")

class Candidate(Base):
    __tablename__ = "candidates"

    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False) # Prompt said email, implied unique maybe? Usually yes.
    phone: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    resume_file_path: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    applications: Mapped[List["Application"]] = relationship("Application", back_populates="candidate")
    resume_parsing_result: Mapped[Optional["ResumeParsingResult"]] = relationship("ResumeParsingResult", back_populates="candidate", uselist=False)

class Application(Base):
    __tablename__ = "applications"

    job_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("jobs.id"), nullable=False)
    candidate_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("candidates.id"), nullable=False)
    status: Mapped[ApplicationStatus] = mapped_column(Enum(ApplicationStatus), default=ApplicationStatus.APPLIED, nullable=False)
    ai_score: Mapped[Optional[float]] = mapped_column(nullable=True) # Prompt said ai_score, assumed numeric
    ai_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    job: Mapped["Job"] = relationship("Job", back_populates="applications")
    candidate: Mapped["Candidate"] = relationship("Candidate", back_populates="applications")

class ResumeParsingResult(Base):
    __tablename__ = "resume_parsing_results"

    candidate_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("candidates.id"), nullable=False)
    parsed_data: Mapped[dict] = mapped_column(JSONB, nullable=False, default={})
    embedding_vector = mapped_column(Vector(768)) # Explicitly requested syntax style or mapped_column? "embedding_vector (Vector(768))".

    candidate: Mapped["Candidate"] = relationship("Candidate", back_populates="resume_parsing_result")
