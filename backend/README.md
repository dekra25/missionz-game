# MissionZ Backend MVP

## Features
- JWT auth (`/api/auth/register`, `/api/auth/login`)
- Google social login hook (`/api/auth/google` with ID token)
- Age-based player profile creation
- Framework-first sample missions (3 per age group)
- Mission lifecycle: available -> start -> submit
- AI verification service hook for Gemini Vision
- XP, levels, coins, stage progression
- Parent email verification + parent dashboard
- Global leaderboard

## Run
1. `cd backend`
2. `python3 -m venv .venv && source .venv/bin/activate`
3. `pip install -r requirements.txt`
4. `cp .env.example .env`
5. `uvicorn app.main:app --reload --port 8001`

## Notes
- `EMERGENT_LLM_KEY` and `GEMINI_API_KEY` are wired for integration but mission verification is mocked in `app/services.py` for deterministic local behavior.
- To switch to live Gemini verification, replace `verify_mission_with_ai()` implementation.
