# Run this AFTER you fill SLACK_BOT_TOKEN and SLACK_CHANNEL_SPRINT_MAIN in c:\nmt\.env
# Usage: powershell -ExecutionPolicy Bypass -File c:\nmt\slack-verify.ps1

$envFile = Get-Content "c:\nmt\.env" | ForEach-Object {
    if ($_ -match "^([^#=]+)=(.*)$") {
        [System.Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim())
    }
}

$token   = $env:SLACK_BOT_TOKEN
$channel = $env:SLACK_CHANNEL_SPRINT_MAIN

if (-not $token -or -not $channel) {
    Write-Host "Fill SLACK_BOT_TOKEN and SLACK_CHANNEL_SPRINT_MAIN in c:\nmt\.env first"
    exit 1
}

$headers = @{ Authorization = "Bearer $token" }

Write-Host "`n--- Test 1: auth.test ---"
$r1 = Invoke-RestMethod -Uri "https://slack.com/api/auth.test" -Headers $headers
$r1 | ConvertTo-Json

Write-Host "`n--- Test 2: chat.postMessage ---"
$body = @{ channel = $channel; text = "[OpenClaw] Round-trip test from forge2 build — ok" } | ConvertTo-Json
$r2 = Invoke-RestMethod -Method Post -Uri "https://slack.com/api/chat.postMessage" `
    -Headers ($headers + @{"Content-Type" = "application/json"}) -Body $body
$r2 | ConvertTo-Json

Write-Host "`n--- Test 3: conversations.history ---"
$r3 = Invoke-RestMethod -Uri "https://slack.com/api/conversations.history?channel=$channel&limit=3" -Headers $headers
$r3 | ConvertTo-Json -Depth 3

if ($r1.ok -and $r2.ok -and $r3.ok) {
    Write-Host "`nAll 3 tests passed. Screenshot this window and save as slack-export/round-trip-test.png"
} else {
    Write-Host "`nOne or more tests failed. Check your token and channel ID."
}
