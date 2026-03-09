from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional

AgeGroup = Literal['5-8', '9-12', '13-17', '18-22']


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class GoogleLoginIn(BaseModel):
    id_token: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class PlayerCreateIn(BaseModel):
    nickname: str
    age_group: AgeGroup
    parent_email: Optional[EmailStr] = None


class MissionStartIn(BaseModel):
    mission_id: int


class MissionSubmitIn(BaseModel):
    mission_id: int
    proof_base64: str
    proof_type: Literal['image', 'video']


class ParentLinkIn(BaseModel):
    child_player_id: int
    parent_email: EmailStr
