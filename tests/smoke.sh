#!/usr/bin/env bash
# ConcertBuddy API smoke tests
# Usage: BASE_URL=http://localhost:3001 ./smoke.sh
# Exits non-zero on first failure.

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

# Seed IDs from 02_seed.sql
EVENT_ID="b1000000-0000-0000-0000-000000000001"
USER_ID="c1000000-0000-0000-0000-000000000001"
USER2_ID="c1000000-0000-0000-0000-000000000002"
MATCH_ID="d1000000-0000-0000-0000-000000000001"

PASS=0
FAIL=0

check() {
  local label="$1"
  local status="$2"
  local expected="$3"
  if [ "$status" -eq "$expected" ]; then
    echo "  ✓  $label (HTTP $status)"
    PASS=$((PASS + 1))
  else
    echo "  ✗  $label (expected HTTP $expected, got $status)"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "═══════════════════════════════════════════"
echo "  ConcertBuddy Smoke Tests → $BASE_URL"
echo "═══════════════════════════════════════════"
echo ""

# ── Health ───────────────────────────────────────────────────────────────────
echo "▸ Health"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
check "GET /health" "$STATUS" 200

# ── Events (GETs) ─────────────────────────────────────────────────────────────
echo ""
echo "▸ Events"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/events")
check "GET /api/events" "$STATUS" 200

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/events?artist=Midnight")
check "GET /api/events?artist=Midnight" "$STATUS" 200

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/events/$EVENT_ID")
check "GET /api/events/:id" "$STATUS" 200

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/events/$EVENT_ID/attendees")
check "GET /api/events/:id/attendees" "$STATUS" 200

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/events/00000000-0000-0000-0000-000000000000")
check "GET /api/events/:id (not found → 404)" "$STATUS" 404

# ── Profiles (GETs) ───────────────────────────────────────────────────────────
echo ""
echo "▸ Profiles"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/profiles/$USER_ID")
check "GET /api/profiles/:id" "$STATUS" 200

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/profiles/00000000-0000-0000-0000-000000000000")
check "GET /api/profiles/:id (not found → 404)" "$STATUS" 404

# ── Attendance ────────────────────────────────────────────────────────────────
echo ""
echo "▸ Attendance"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/attendance?event_id=$EVENT_ID")
check "GET /api/attendance?event_id=" "$STATUS" 200

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/attendance?user_id=$USER_ID")
check "GET /api/attendance?user_id=" "$STATUS" 200

# ── Matches (GET) ─────────────────────────────────────────────────────────────
echo ""
echo "▸ Matches"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/matches?user_id=$USER_ID")
check "GET /api/matches?user_id=" "$STATUS" 200

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/matches")
check "GET /api/matches (missing user_id → 400)" "$STATUS" 400

# ── Messages (GET) ────────────────────────────────────────────────────────────
echo ""
echo "▸ Messages"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/messages?match_id=$MATCH_ID")
check "GET /api/messages?match_id=" "$STATUS" 200

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/messages")
check "GET /api/messages (missing match_id → 400)" "$STATUS" 400

# ── Reports (GET) ─────────────────────────────────────────────────────────────
echo ""
echo "▸ Reports"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/reports")
check "GET /api/reports" "$STATUS" 200

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/reports?reviewed=false")
check "GET /api/reports?reviewed=false" "$STATUS" 200

# ── Write: POST /api/messages ─────────────────────────────────────────────────
echo ""
echo "▸ Writes"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$BASE_URL/api/messages" \
  -H "Content-Type: application/json" \
  -d "{\"match_id\":\"$MATCH_ID\",\"sender_id\":\"$USER_ID\",\"content\":\"Smoke test message\",\"msg_type\":\"text\"}")
check "POST /api/messages (send text message)" "$STATUS" 201

# Write: POST /api/reports
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$BASE_URL/api/reports" \
  -H "Content-Type: application/json" \
  -d "{\"reporter_id\":\"$USER_ID\",\"reported_id\":\"$USER2_ID\",\"reason\":\"Smoke test report\"}")
check "POST /api/reports (submit report)" "$STATUS" 201

# Write: POST /api/attendance (409 expected — seed already registered)
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$BASE_URL/api/attendance" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"$USER_ID\",\"event_id\":\"$EVENT_ID\",\"ticket_verified\":true}")
check "POST /api/attendance (duplicate → 409)" "$STATUS" 409

# Write: POST bad request validation
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$BASE_URL/api/messages" \
  -H "Content-Type: application/json" \
  -d "{\"match_id\":\"$MATCH_ID\"}")
check "POST /api/messages (missing sender_id → 400)" "$STATUS" 400

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════════"
echo ""

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
