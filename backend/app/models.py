from datetime import datetime
from sqlalchemy import String, Integer, DateTime, Boolean, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from .db import Base


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str] = mapped_column(String(120))
    provider: Mapped[str] = mapped_column(String(20), default='local')
    role: Mapped[str] = mapped_column(String(20), default='player')
    parent_email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PlayerProfile(Base):
    __tablename__ = 'player_profiles'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), unique=True)
    nickname: Mapped[str] = mapped_column(String(80))
    age_group: Mapped[str] = mapped_column(String(10), index=True)
    parent_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    parent_email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    xp: Mapped[int] = mapped_column(Integer, default=0)
    coins: Mapped[int] = mapped_column(Integer, default=0)
    level: Mapped[int] = mapped_column(Integer, default=1)
    stage: Mapped[str] = mapped_column(String(20), default='Beginner')
    streak_days: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Mission(Base):
    __tablename__ = 'missions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(140))
    description: Mapped[str] = mapped_column(Text)
    age_group: Mapped[str] = mapped_column(String(10), index=True)
    category: Mapped[str] = mapped_column(String(30))
    difficulty: Mapped[str] = mapped_column(String(20))
    xp_reward: Mapped[int] = mapped_column(Integer)
    coins_reward: Mapped[int] = mapped_column(Integer)
    verification_prompt: Mapped[str] = mapped_column(Text)
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class PlayerMission(Base):
    __tablename__ = 'player_missions'
    __table_args__ = (UniqueConstraint('player_id', 'mission_id', name='uniq_player_mission'),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    player_id: Mapped[int] = mapped_column(Integer, ForeignKey('player_profiles.id'), index=True)
    mission_id: Mapped[int] = mapped_column(Integer, ForeignKey('missions.id'), index=True)
    status: Mapped[str] = mapped_column(String(30), default='active')
    proof_type: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    proof_base64: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ai_feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
