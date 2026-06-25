# forge2-qualifier-yuvrajsingh64

Kanban board built with Laravel and React as part of the Forge 2 Edition 1 qualifier.

## What it does

A Trello-style board with boards, lists, and cards. Cards support descriptions, due dates, colour tags, and member assignment. Overdue cards are flagged visually. You can move cards between lists.

## Models used

**Hermes** (orchestrator): Gemini 2.5 Flash via Google AI Studio free tier. Used for planning and decomposing tasks — large context window, handles multi-step reasoning well.

**OpenClaw** (coding agent): Groq `openai/gpt-oss-120b` as primary, Ollama `qwen2.5-coder` as local fallback. Groq is fast for code generation; Ollama is rate-limit-free.

No paid models were used.

## Running locally

### Backend

```bash
cd backend
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

API runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

UI runs at `http://localhost:5173`.

## Live URL

https://forge2-qualifier-yuvrajsingh64.vercel.app

## Repo structure

```
backend/          Laravel API, SQLite
frontend/         React + Vite
skills/           Hermes skill definitions
slack-export/     Evidence screenshots
agent-log.md      Chat loop transcript
ARCHITECTURE.md   System design
```
