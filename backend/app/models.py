from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, ForeignKey("users.username"))
    token = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)

class RandomNumber(Base):
    __tablename__ = "random_numbers"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, unique=True, index=True)
    value = Column(Float)

class BackendTableEntry(Base):
    __tablename__ = "backend_table"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(String, index=True)
    broker = Column(String)
    api_key = Column(String, unique=True)
    api_secret = Column(String)
    pnl = Column(Float)
    margin = Column(Float)
    max_risk = Column(Float)
    version = Column(Integer, default=1)  # For tracking changes
