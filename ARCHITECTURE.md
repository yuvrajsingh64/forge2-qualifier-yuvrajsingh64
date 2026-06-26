# Architecture — Forge 2 Sprint 02

## Two-Agent System

### Hermes (Orchestrator — The Brain)
- **Role**: Decomposes goals, assigns tasks, tracks sprint progress, holds cross-session memory
- **Qualifier model**: Gemini 2.5 Flash (free tier)
- **Sprint Day model**: DeepSeek V4 Pro via EastRouter (strong reasoning, 200K context)
- **Channel**: Posts plans to `#agent-orchestrator`, assigns tasks via `#sprint-main`
- **Memory**: Persistent — recalls repo name, tech decisions, task history across sessions
- **Autonomous run**: Heartbeat cron every 15 min into `#agent-log`

### OpenClaw (Coding Agent — The Hands)
- **Role**: Receives tasks, writes code, runs tests, commits to GitHub, reports results
- **Qualifier model**: Groq llama-3.3-70b-versatile (fast, free)
- **Sprint Day model**: Kimi K2.6 via EastRouter (coding-optimised, cheap per token)
- **Fallback**: Qwen2.5-Coder via Ollama (local, unlimited, offline-safe)
- **Channel**: Listens on `#agent-coder`, reports results there

## Model Routing Strategy (Sprint Day — $50 EastRouter credits)

| Task | Model | Why |
|---|---|---|
| Sprint planning, goal decomposition | DeepSeek V4 Pro | Best reasoning for architecture decisions |
| Code generation, file editing | Kimi K2.6 | Fast, cheap, coding-optimised |
| Error classification, debugging | DeepSeek V4 Pro | Needs judgment, not just speed |
| Status reports, formatting | MiniMax M2.7 | Simple structured output, lowest cost |
| Local fallback (offline/rate-limit) | Qwen2.5-Coder via Ollama | Free, unlimited, runs locally |

**Rule**: 70% cheap model (Kimi) / 25% mid (DeepSeek) / 5% premium → near-identical quality at 15% cost.

## EastRouter Integration

Base URL: `https://api.eastrouter.com/v1`
Drop-in OpenAI-compatible — change only `base_url` and `api_key` in agent configs.

## Slack Channel Scheme

| Channel | Purpose | Who posts |
|---|---|---|
| `#sprint-main` | Human → Hermes goals, approvals. Hermes posts plans and status. | Human + Hermes |
| `#agent-orchestrator` | Hermes internal planning, dependency graphs, sprint status | Hermes |
| `#agent-coder` | Hermes assigns tasks. OpenClaw works and reports here. | Hermes + OpenClaw |
| `#ci-cd` | GitHub Actions results, build status, test pass/fail | Automated |
| `#human-review` | Items needing human decision before proceeding | OpenClaw → Human |
| `#agent-log` | Heartbeat, cron outputs, autonomous run proof | Both agents (auto) |

## Human-in-the-Loop Flow

```
Human posts goal → #sprint-main → Hermes reads
                                        ↓
                              Hermes posts plan to #agent-orchestrator
                              (does NOT assign until approved)
                                        ↓
                              Human approves in #sprint-main
                                        ↓
                              Hermes → #agent-coder → OpenClaw picks up task
                                                            ↓
                                              OpenClaw codes, commits, runs tests
                                                            ↓
                                              CI/CD posts result to #ci-cd
                                                            ↓
                                              OpenClaw posts to #human-review:
                                              What I Did / What's Left / What Needs Your Call
                                                            ↓
                                              Human approves → merge
```

## Quality Gate

GitHub Actions runs on every push:
1. PHP 8.2 + Laravel migrations
2. API health check (`GET /api/health`)
3. React Vite build
4. All must pass before human review

## Tech Stack

- **Backend**: Laravel 12, PHP 8.2, SQLite
- **Frontend**: React 18 + Vite, HashRouter for GitHub Pages
- **Deployment**: GitHub Pages (frontend) + Cloudflare Tunnel (backend)
- **Version control**: GitHub (public), incremental commits per feature
