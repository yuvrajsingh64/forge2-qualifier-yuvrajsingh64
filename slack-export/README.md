# Slack Export & Evidence

This directory contains screenshots and exports proving the two-agent chat loop,
the Slack round-trip test, and the autonomous run.

## Files

- `round-trip-test.png` — Screenshot of the 3 curl commands (auth.test, postMessage, conversations.history) all returning `"ok":true`
- `sprint-main-thread.png` — Screenshot of #sprint-main: human goal → Hermes plan → approval
- `agent-coder-thread.png` — Screenshot of #agent-coder: Hermes task → OpenClaw code report
- `agent-log-autonomous.png` — Screenshot of #agent-log: Hermes cron firing with no human prompt
- `hermes-memory-recall.png` — Screenshot showing Hermes recalling repo name across two sessions

## Round-Trip Test Results

All three curl commands returned `"ok":true`. Bot token verified, posting works, history readable.
