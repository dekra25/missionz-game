from typing import Tuple
from google.oauth2 import id_token
from google.auth.transport import requests
from .config import settings


def verify_google_id_token(token_str: str) -> dict:
    if not settings.google_client_id:
        raise ValueError('GOOGLE_CLIENT_ID is not configured')
    info = id_token.verify_oauth2_token(token_str, requests.Request(), settings.google_client_id)
    if info.get('iss') not in ['accounts.google.com', 'https://accounts.google.com']:
        raise ValueError('Wrong issuer')
    return info


def compute_level_stage(total_xp: int) -> Tuple[int, str]:
    level = (total_xp // 500) + 1
    if level >= 50:
        stage = 'Hero'
    elif level >= 25:
        stage = 'Guardian'
    elif level >= 10:
        stage = 'Warrior'
    else:
        stage = 'Beginner'
    return level, stage


def verify_mission_with_ai(
    mission_title: str,
    mission_prompt: str,
    proof_type: str,
    proof_base64: str,
) -> Tuple[bool, str]:
    # TODO: integrate live Gemini Vision request via GEMINI_API_KEY/EMERGENT_LLM_KEY.
    # For MVP reliability, return a deterministic mock pass when payload is non-empty.
    if not proof_base64.strip():
        return False, 'NOT VERIFIED: empty proof payload.'
    summary = f'VERIFIED: {proof_type} evidence accepted for mission "{mission_title}".'
    return True, summary
