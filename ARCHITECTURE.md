# Architecture

## Agents

### Hermes — orchestrator

Plans goals, breaks them into tasks, holds persistent memory across sessions, and posts progress on a schedule. Routed to Gemini 2.5 Flash: the 1M-token context window is useful when the full codebase context fits in one prompt.

Posts plans and status to `#sprint-main`. Fires a cron every ten minutes to drop a one-line progress note in `#agent-log` — no human prompt needed.

### OpenClaw — coding agent

Receives tasks in `#agent-coder`, writes and runs code, then reports back in the same channel. Routed to Groq `openai/gpt-oss-120b` for speed. Falls back to Ollama `qwen2.5-coder` locally when the Groq rate limit is hit — Ollama has no cap.

## Channel layout

| Channel | Who uses it |
|---|---|
| `#sprint-main` | Human posts goals; Hermes posts plans and status |
| `#agent-coder` | Hermes assigns tasks; OpenClaw reports results |
| `#agent-log` | Autonomous cron output and raw activity |

## Loop

```
human → #sprint-main → Hermes → plan
Hermes → #agent-coder → OpenClaw → code
OpenClaw → What I Did / What's Left / What Needs Your Call
human → approve or redirect
```

Nothing happens in DMs. All decisions and outputs are in the channel record.

## Model routing

| Agent | Model | Provider | Reason |
|---|---|---|---|
| Hermes | gemini-2.5-flash | Google AI Studio | Large context, strong at planning |
| OpenClaw | openai/gpt-oss-120b | Groq | Fast inference, good at code |
| OpenClaw fallback | qwen2.5-coder | Ollama (local) | Unlimited, no API dependency |

Fallback order on rate limit: Groq → Gemini → Ollama.

## Stack

- Backend: Laravel 11, SQLite, PHP 8.2
- Frontend: React 18, Vite
- Deploy: Vercel (frontend), Render (backend)
