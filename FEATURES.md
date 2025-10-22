# Feature Development Checklist

## MVP Features for Oct 23 Launch

### ✅ Foundation (Complete)
- [x] Next.js 15 + TypeScript setup
- [x] Tailwind CSS configuration
- [x] Clerk authentication
- [x] Drizzle ORM + Neon Postgres schema
- [x] Database migrations setup
- [x] Cloudflare R2 integration
- [x] Square SDK setup
- [x] Courier SMS setup

---

## 🔄 Sprint 1: Event Creation & RSVP (Oct 14-15)

### Event Creation (Organizer)
- [ ] `/dashboard/create` page with form
- [ ] Form fields: title, description, date, price, location, max attendees
- [ ] Save event to database (linked to Clerk userId)
- [ ] Redirect to event dashboard after creation
- [ ] Event edit functionality

**Files to create:**
- `app/dashboard/create/page.tsx`
- `app/dashboard/events/[eventId]/page.tsx`

### RSVP Flow (Attendee)
- [ ] Public event page: `/event/[eventId]`
- [ ] RSVP form: name, email, phone
- [ ] Save attendee to database with `payment_status: 'pending'`
- [ ] Create Square Checkout session
- [ ] Redirect to Square hosted payment page
- [ ] Return URL: `/event/[eventId]/thank-you`

**Files to create:**
- `app/event/[eventId]/page.tsx`
- `app/event/[eventId]/thank-you/page.tsx`
- `app/api/rsvp/route.ts`

### Square Webhook
- [ ] Webhook endpoint: `/api/webhook/square`
- [ ] Verify webhook signature
- [ ] Update attendee `payment_status` to 'paid'
- [ ] Store `squarePaymentId` and `squareOrderId`

**Files to create:**
- `app/api/webhook/square/route.ts`

---

## 🔄 Sprint 2: Photo Uploads (Oct 16-17)

### Anonymous Upload
- [ ] Public upload page: `/event/[eventId]/upload`
- [ ] Simple file picker (mobile-friendly)
- [ ] Request presigned URL from API
- [ ] Upload directly to R2 from browser
- [ ] Show upload progress
- [ ] Success confirmation

**Files to create:**
- `app/event/[eventId]/upload/page.tsx`
- `app/api/upload/sign/route.ts`
- `app/api/upload/complete/route.ts`

### Photo Gallery (Organizer)
- [ ] Gallery view in event dashboard
- [ ] Display all uploaded photos
- [ ] Show upload timestamps
- [ ] Download all photos option

**Files to create:**
- `app/dashboard/events/[eventId]/gallery/page.tsx`

---

## 🔄 Sprint 3: SMS Broadcast (Oct 18-19)

### Broadcast System
- [ ] Broadcast form in event dashboard
- [ ] Text area for message
- [ ] Preview recipient count (paid attendees only)
- [ ] Send via Courier to all attendees
- [ ] Save broadcast record to database
- [ ] Show delivery status

**Files to create:**
- `app/dashboard/events/[eventId]/broadcast/page.tsx`
- `app/api/broadcast/route.ts`

### Broadcast History
- [ ] List all past broadcasts
- [ ] Show message, timestamp, recipient count
- [ ] Filter by event

**Files to create:**
- `app/dashboard/events/[eventId]/broadcasts/page.tsx`

---

## 🔄 Sprint 4: Dashboard & Polish (Oct 20-21)

### Organizer Dashboard
- [ ] Event overview stats:
  - Total RSVPs
  - Paid attendees
  - Total revenue
  - Photos uploaded
- [ ] Attendee list with search
- [ ] Export attendees to CSV
- [ ] Quick actions: Send SMS, View Gallery

**Improvements to:**
- `app/dashboard/events/[eventId]/page.tsx`

### UI Polish
- [ ] Mobile responsiveness check
- [ ] Loading states
- [ ] Error boundaries
- [ ] Form validation with Zod
- [ ] Toast notifications for success/errors
- [ ] Better typography and spacing

### Testing Checklist
- [ ] Test full RSVP → Payment → Confirmation flow
- [ ] Test photo upload on mobile
- [ ] Test SMS delivery
- [ ] Test with real Square sandbox account
- [ ] Test with organizer's real phone number

---

## 🚀 Sprint 5: Deployment (Oct 22)

### Pre-Launch
- [ ] Switch Square to production mode
- [ ] Verify R2 bucket is public
- [ ] Test Courier SMS with real numbers
- [ ] Set up Vercel project
- [ ] Add all environment variables to Vercel
- [ ] Deploy to production
- [ ] Test production deployment end-to-end

### Launch Day (Oct 23)
- [ ] Monitor event in real-time
- [ ] Watch for errors in Vercel logs
- [ ] Be ready to hotfix bugs
- [ ] Collect organizer feedback
- [ ] Screenshot metrics for case study

---

## Post-MVP (After Oct 23)

### Nice-to-haves if time permits:
- [ ] QR code for event check-in
- [ ] Real-time attendee count on public page
- [ ] Email confirmations (via Courier)
- [ ] Event landing page customization
- [ ] Multiple events per organizer
- [ ] Analytics dashboard

---

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/rsvp` | POST | Create attendee + Square checkout |
| `/api/webhook/square` | POST | Handle payment confirmation |
| `/api/upload/sign` | POST | Get presigned R2 URL |
| `/api/upload/complete` | POST | Save media asset metadata |
| `/api/broadcast` | POST | Send SMS to attendees |
| `/api/events/[id]` | GET | Public event details |
| `/api/organizer/events/[id]` | GET | Organizer event data + stats |

---

## Current File Structure

```
agama/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout with Clerk
│   ├── globals.css                 # Tailwind styles
│   ├── sign-in/[[...sign-in]]/     # Clerk auth pages
│   ├── sign-up/[[...sign-up]]/
│   ├── dashboard/
│   │   ├── page.tsx                # Event list
│   │   ├── create/                 # Create event form
│   │   └── events/[eventId]/       # Event management
│   ├── event/[eventId]/            # Public event pages
│   │   ├── page.tsx                # RSVP form
│   │   ├── upload/                 # Photo upload
│   │   └── thank-you/              # Payment confirmation
│   └── api/
│       ├── rsvp/route.ts
│       ├── webhook/square/route.ts
│       ├── upload/
│       └── broadcast/route.ts
├── lib/
│   ├── db/
│   │   ├── schema.ts               # Database schema
│   │   └── index.ts                # Drizzle client
│   ├── square.ts                   # Square client
│   ├── r2.ts                       # R2 client
│   └── courier.ts                  # Courier client
├── middleware.ts                   # Clerk route protection
└── drizzle.config.ts               # Database migrations config
```

---

**Let's build this! Start with Sprint 1 and ship features daily.**
