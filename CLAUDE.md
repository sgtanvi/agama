# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Agama** is an event management platform that enables organizers to run events with real-time engagement tracking, photo uploads, and attendee communication. The platform serves four user types: Attendees, Organizers, Sponsors, and Team Members (logistics/photographers/volunteers).

### Core Value Propositions
- **For Attendees**: Discover events, RSVP, upload photos anonymously, participate in polls/surveys
- **For Organizers**: Create events, monitor live vibe dashboards, send broadcast messages, generate post-event reports
- **For Sponsors**: Track engagement metrics and receive branded reports
- **For Team Members**: Role-specific access for day-of coordination and content contribution

## Current Development Phase

The project is in **MVP development** based on organizer feedback. The MVP focuses on:
1. Attendee registration (name, email, phone)
2. Payment processing via Square
3. Anonymous photo uploads
4. SMS text blasts to attendees

**Out of scope for MVP**: Advanced analytics dashboards, sponsorship features, detailed reporting.

## Architecture

### Tech Stack (Planned)
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Fastify (Node.js) or Express
- **Database**: Neon Postgres (serverless)
- **Storage**: AWS S3 or Cloudflare R2 (for photo uploads)
- **Payments**: Square API
- **SMS**: Twilio

### Database Schema (MVP)

```sql
-- Events table
create table events (
  id uuid primary key,
  title text,
  date timestamptz,
  price numeric,
  organizer_id uuid
);

-- Attendees table
create table attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  name text not null,
  email text not null,
  phone text not null,
  payment_status text default 'pending',
  created_at timestamptz default now()
);

-- Media assets for anonymous photo uploads
create table media_assets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  storage_key text not null,
  uploaded_at timestamptz default now()
);

-- Broadcast messages
create table broadcasts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  message text not null,
  channel text default 'sms',
  sent_at timestamptz default now(),
  sent_by text
);
```

## Key API Endpoints (MVP)

| Route | Method | Purpose |
|-------|--------|---------|
| `/rsvp` | POST | Create attendee record, redirect to Square payment |
| `/thank-you` | GET | Confirm payment success via Square webhook |
| `/uploads/sign` | POST | Get signed upload URL for anonymous photo upload |
| `/uploads/complete` | POST | Save uploaded image metadata |
| `/broadcast` | POST | Send SMS to all paid attendees |
| `/organizer/data` | GET | Fetch event data summary (auth required) |

## Privacy and Security Requirements

**Critical Privacy Principles:**
- Attendees are **anonymous** by default outside organizer dashboard
- Photo uploads have **no user identifiers** linked to them
- PII (email, phone) must be encrypted or hashed when not in active use
- Only organizers can see attendee contact information
- Free access for attendees - they never pay for participation, uploads, or dashboard access

## User Roles and Permissions

### Attendee (Anonymous by default)
- RSVP to events
- Upload photos (if granted by organizer)
- Participate in polls/surveys
- No authentication required for uploads

### Organizer
- Create, edit, delete events
- Full analytics access
- Send broadcast messages
- View all attendee information
- Download post-event reports

### Logistics Team
- Add timeline markers
- Run check-in
- Coordinate via group chat
- No access to sensitive organizer controls

### Photographer
- Upload and tag photos
- Trigger real-time analytics updates

### Sponsor (Post-MVP)
- Read-only access to sponsor dashboard
- Branded report access

## Post-MVP Features (Future Roadmap)

1. **Live Vibe Dashboard**: Real-time crowd visualization, timeline markers, engagement trends
2. **Computer Vision**: Headcount estimation, density heatmaps from uploaded photos
3. **Advanced Communication**: Day-of group chat for logistics team, templated broadcast messages
4. **Post-Event Reports**: Exportable branded PDFs with attendance metrics, sponsor analytics
5. **Monetization**: Organizer Pro subscriptions, guest uploader passes, sponsor add-ons
6. **Authentication**: QR code tickets, attendee accounts for persistent profiles

## Implementation Priority Order

1. ✅ Attendee registration form
2. ✅ Square payment redirect
3. ✅ Anonymous photo upload
4. 🔄 Organizer dashboard
5. 🔄 Text blast system
6. ⏳ Gallery view and polish

## Documentation References

- **Product Vision**: `docs/uiflow.MD` - Authoritative product description with all user flows
- **MVP Specification**: `docs/feature.md` - Developer-facing MVP build spec with Square integration details
- **Square Integration**: `docs/square.md` - Payment integration specifics
