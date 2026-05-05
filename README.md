# ConcertBuddy

🔗 **Live App:** [https://master.d3qlak4bwzjgra.amplifyapp.com](https://master.d3qlak4bwzjgra.amplifyapp.com)

ConcertBuddy is a web application designed to help solo concert-goers find and connect with other attendees for a specific live music event. The system supports users in listing the concerts they plan to attend, discovering others going to the same show, and forming temporary event-based connections.

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS — deployed on AWS Amplify
- **API**: Express.js (Node.js) — deployed on Render
- **Database**: Supabase (PostgreSQL + Auth + RLS)

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Regular user | alex@example.com | password123 |
| Admin | admin@concertbuddy.app | Admin1234! |

## Project Structure

```
concertbuddy/
├── client/               # React frontend (Vite)
├── api/                  # Express API
├── supabase/migrations/  # SQL schema, seed, RLS policies
├── tests/smoke.sh        # API smoke tests
├── amplify.yml           # AWS Amplify build config
├── render.yaml           # Render API deployment config
└── docs/                 # PRD, task list, OpenAPI spec
```

## Local Development

### Prerequisites
- Node.js v18+
- Supabase project with migrations applied

### Setup

```bash
git clone https://github.com/chchapple/ConcertBuddy.git
cd ConcertBuddy

# Install dependencies
cd client && npm install
cd ../api && npm install

# Configure environment
cp client/.env.example client/.env
cp api/.env.example api/.env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

### Run Migrations (Supabase SQL Editor — in order)
1. `supabase/migrations/01_schema.sql`
2. `supabase/migrations/02_seed.sql`
3. `supabase/migrations/03_policies.sql`
4. `supabase/migrations/04_l3_schema.sql`
5. `supabase/migrations/05_l3_seed.sql`
6. `supabase/migrations/06_l3_policies.sql`

### Start Dev Servers

```bash
# API (port 3001)
cd api && node src/index.js

# Client (port 3000)
cd client && npm run dev
```

### Smoke Tests

```bash
BASE_URL=http://localhost:3001 bash tests/smoke.sh
```

## Features

- Supabase Auth — email/password sign up & sign in
- Discover upcoming concerts with My Events filter
- Mark Attending → ticket upload → admin approval flow
- Card Stack — swipe across all your attended events (Tinder-style)
- Messages — match-based chat with Buddy Bot notifications
- Admin Panel — Reports, Ticket Verifications, ID Verifications, Disputes
- Warning system (3 warnings → suspension) with dispute form
- Role-based navigation (user vs admin)

## Known Issues / Incomplete Areas

- Card Stack swiping does not record the swipe to the database yet (UI only)
- "It's a Match" popup appears but does not create a real match record
- Ticket upload uses a URL field (file upload not wired to Supabase Storage)
- Admin panel shows AdminReports page; full Ticket/ID/Dispute tabs are in progress
- Email notifications for disputes are not implemented
- Profile photo upload is placeholder (uses generated avatars)
