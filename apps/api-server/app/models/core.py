from typing import Optional
from sqlalchemy import String, ForeignKey, Enum, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
import uuid

from .base import Base

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    HR = "HR"
    MANAGER = "MANAGER"
    EMPLOYEE = "EMPLOYEE"

class User(Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.EMPLOYEE, nullable=False)
    department_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("departments.id"), nullable=True)
    position: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    department: Mapped[Optional["Department"]] = relationship("Department", foreign_keys=[department_id], back_populates="members")
    managed_department: Mapped[Optional["Department"]] = relationship("Department", back_populates="manager", uselist=False)

import uuid

class Department(Base):
    __tablename__ = "departments"

    name: Mapped[str] = mapped_column(String, nullable=False)
    manager_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)

    manager: Mapped[Optional["User"]] = relationship("User", foreign_keys=[manager_id], back_populates="managed_department")
    members: Mapped[list["User"]] = relationship("User", foreign_keys=[User.department_id], back_populates="department")
