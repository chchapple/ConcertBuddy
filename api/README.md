# ConcertBuddy API

Express.js REST API for ConcertBuddy. Connects to Supabase using the service role key.

## Local Setup

### Prerequisites
- Node.js v18+
- A Supabase project with migrations applied (`01_schema.sql`, `02_seed.sql`)

### Install & Run

```bash
cd api
npm install
cp .env.example .env   # fill in your Supabase credentials
npm run dev            # starts on http://localhost:3001
```

### Environment Variables

| Variable                   | Description                                 |
|----------------------------|---------------------------------------------|
| `PORT`                     | Port to listen on (default: `3001`)         |
| `SUPABASE_URL`             | Your Supabase project URL                   |
| `SUPABASE_SERVICE_ROLE_KEY`| Service role secret (never expose publicly) |

## Endpoints

| Method | Path                         | Description                            |
|--------|------------------------------|----------------------------------------|
| GET    | /health                      | Health check                           |
| GET    | /api/events                  | List upcoming events (artist/venue/date filter) |
| GET    | /api/events/:id              | Single event                           |
| GET    | /api/events/:id/attendees    | Verified attendees for an event        |
| GET    | /api/profiles/:id            | Single profile                         |
| POST   | /api/profiles                | Create profile (post sign-up)          |
| PATCH  | /api/profiles/:id            | Update profile                         |
| GET    | /api/attendance              | Query attendance records               |
| POST   | /api/attendance              | Register attendance                    |
| GET    | /api/matches?user_id=        | Active matches for a user              |
| POST   | /api/matches/swipe           | Record swipe; auto-creates match on mutual like |
| PATCH  | /api/matches/:id/unmatch     | Deactivate a match                     |
| GET    | /api/messages?match_id=      | Messages for a match                   |
| POST   | /api/messages                | Send a message                         |
| GET    | /api/reports                 | List reports (admin)                   |
| POST   | /api/reports                 | Submit a report                        |
| PATCH  | /api/reports/:id/review      | Mark report as reviewed (admin)        |

Full request/response schemas are documented in [`openapi.yaml`](./openapi.yaml).

## Running Smoke Tests

```bash
cd tests
cp .env.example .env   # or ensure BASE_URL and seed IDs are set
chmod +x smoke.sh
./smoke.sh
```

The script exits non-zero if any request fails.
