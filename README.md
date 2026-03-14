# ConcertBuddy

ConcertBuddy is a web application designed to help solo concert-goers find and connect with other attendees for a specific live music event. The system supports users in listing the concerts they plan to attend, discovering others going to the same show, and forming temporary event-based connections.

## Tech Stack

- **Client**: React PWA (Vite for local development)
- **API**: Express.js (Node.js)
- **Database**: Supabase
- **Architecture**: Monorepo with separate client and API services

## Project Structure

```
concertbuddy/
├── client/     # React PWA (local dev: Vite)
├── api/        # Express API (local dev: Node)
├── supabase/   # SQL migrations + seeds
├── docs/       # PRD, site map, OpenAPI, deployment notes
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chchapple/ConcertBuddy.git
cd ConcertBuddy
```

2. Install dependencies:
```bash
# Client dependencies
cd client && npm install

# API dependencies
cd ../api && npm install
```

3. Set up environment variables:
```bash
# Copy environment templates
cp client/.env.example client/.env
cp api/.env.example api/.env
```

4. Configure Supabase:
- Create a new Supabase project
- Run migrations from the `supabase/` directory
- Update environment variables with your Supabase credentials

### Development

Start the development servers:

```bash
# Start API server (port 3001)
cd api && npm run dev

# Start client server (port 3000)
cd client && npm run dev
```

## Features

- User authentication and profiles
- Concert listing and discovery
- Event-based connections
- Real-time messaging
- PWA capabilities for mobile experience

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
