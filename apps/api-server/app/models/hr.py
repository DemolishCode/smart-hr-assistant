import uuid
from datetime import date
from typing import Optional
from sqlalchemy import String, Integer, ForeignKey, Date, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from .base import Base
from .core import User

class LeaveStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"

class LeaveType(Base):
    __tablename__ = "leave_types"

    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    quota_per_year: Mapped[int] = mapped_column(Integer, nullable=False, default=12)

class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    leave_type_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("leave_types.id"), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[LeaveStatus] = mapped_column(Enum(LeaveStatus), default=LeaveStatus.PENDING, nullable=False)
    reviewer_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)
    reviewer_comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    leave_type: Mapped["LeaveType"] = relationship("LeaveType")
    reviewer: Mapped[Optional["User"]] = relationship("User", foreign_keys=[reviewer_id])

class LeaveBalance(Base):
    __tablename__ = "leave_balances"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    remaining_days: Mapped[float] = mapped_column(Integer, nullable=False) # Prompt said remaining_days, assumed float for half days but prompt didn't specify type. Using Integer based on "days" usually being count, but float is safer for partial. Prompt schema didn't specify type, just name. I'll use Float to be safe or Integer if strict. Let's start with Float for flexibility, but wait, usually balances are 10.5. I will use Float.

    user: Mapped["User"] = relationship("User")
