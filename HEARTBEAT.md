Every 15 minutes during an active sprint, post to #agent-log:

[HEARTBEAT] {timestamp}
Active task: {current_task_name or "none"}
Last commit: {last_git_commit_message}
Tests: {passing_count} passing / {failing_count} failing
Blockers: {blocker or "none"}

If no task is active, post:
[HEARTBEAT] {timestamp} — Idle. Waiting for task assignment in #agent-coder.
