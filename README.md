# MissionZ: Grow to Hero

MissionZ is a real-life mission game backend for children and youth with:
- Age-based missions (`5-8`, `9-12`, `13-17`, `18-22`)
- JWT auth + Google social login hook
- AI verification hook for image/video proof (Gemini-ready)
- XP, levels, coins, stage progression
- Parent email verification + parent dashboard
- Global leaderboard

## Tech Stack
- FastAPI backend
- React + Vite frontend
- SQLAlchemy + SQLite (default, configurable)
- JWT authentication

## Project Structure
- `backend/app/main.py`: API routes
- `backend/app/models.py`: DB models
- `backend/app/services.py`: AI verification and progression logic
- `backend/app/seed.py`: framework-first sample missions (3 per age group)

## Run Locally
### 1) Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8001
```

Open Swagger docs:
- http://127.0.0.1:8001/docs

### 2) Frontend Game App
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open:
- http://localhost:5173

## Core API Flow
1. Register/Login (`/api/auth/register`, `/api/auth/login`)
2. Create player profile (`/api/player/create`)
3. Get missions (`/api/missions/available`)
4. Start mission (`/api/missions/start`)
5. Submit proof (`/api/missions/submit`)
6. Track stats and leaderboard (`/api/player/stats`, `/api/leaderboard/global`)
7. Parent monitoring (`/api/parent/link`, `/api/parent/dashboard`)

## GitHub Repo Description (Suggested)
**MissionZ: Grow to Hero** — FastAPI backend for a real-life mission game with age-based challenges, JWT + Google auth, AI verification hooks, XP leveling, leaderboards, and parent dashboard.
