# Agama - Event Management Platform

Event management platform with real-time engagement tracking, photo uploads, and attendee communication.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

You'll need:
- **Clerk** account (free tier) - Get keys from https://clerk.com
- **Neon** Postgres database - Create at https://neon.tech
- **Cloudflare R2** bucket - Set up at https://dash.cloudflare.com
- **Square** developer account - Get sandbox keys from https://developer.squareup.com
- **Courier** account - Sign up at https://courier.com

### 3. Set Up Database

```bash
# Generate migration files
npm run db:generate

# Run migrations (make sure DATABASE_URL is set)
npm run db:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
agama/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Organizer dashboard (protected)
│   ├── sign-in/           # Clerk auth pages
│   ├── sign-up/
│   └── api/               # API routes
├── lib/                   # Utilities and integrations
│   ├── db/               # Drizzle ORM setup
│   ├── square.ts         # Square payments
│   ├── r2.ts             # Cloudflare R2 storage
│   └── courier.ts        # SMS messaging
└── drizzle/              # Database migrations (auto-generated)
```

## Development Timeline (9 Days to Oct 23)

- **Day 1-2**: Event creation + Square payment flow
- **Day 3-4**: Photo upload with R2
- **Day 5**: SMS broadcast system
- **Day 6-7**: Organizer dashboard polish
- **Day 8-9**: Bug fixes and deployment

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + Tailwind CSS
- **Auth**: Clerk
- **Database**: Neon Postgres + Drizzle ORM
- **Storage**: Cloudflare R2
- **Payments**: Square
- **SMS**: Courier
- **Deployment**: Vercel

## Deployment

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push

# Deploy to Vercel
vercel --prod
```

Add environment variables in Vercel dashboard before deploying.

## Database Schema

- `events` - Event details (title, date, price, organizer)
- `attendees` - RSVP records with payment status
- `media_assets` - Anonymous photo uploads
- `broadcasts` - SMS message history

## License

MIT
