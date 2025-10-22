# Internal Context
This document is the authoritative product description for the Agama platform.
All code should preserve the described user flows, tone, and privacy guarantees.


Absolutely. Here’s a **clean, developer-facing `.md` spec** you can drop directly into your repo (e.g., `docs/MVP_SPEC.md`).
It’s written so coding agents (or collaborators) can build the MVP exactly as discussed — scoped, clear, and ordered by implementation priority.

---

````markdown
# Agama — MVP Build Specification (Organizer Request Version)

This document defines the first production-ready MVP of Agama, based on organizer feedback.  
The goal is to create a working, minimal version that organizers can use immediately for real events.

---

## 🎯 MVP Goal

Enable an **event organizer** to:
1. Collect attendee information (name, email, phone number)
2. Accept payments via **Square**
3. Allow attendees to **upload photos anonymously**
4. Send **text message blasts** to all attendees

No advanced analytics, dashboards, or sponsorship features are required in this phase.

---

## 🧩 Core Features (MVP Scope)

### 1. Attendee Registration Form

**Purpose:** Collect basic attendee info before redirecting to payment.

**Frontend:**
- Public route `/rsvp`
- Fields:  
  - `name` (required)  
  - `email` (required)  
  - `phone` (required, SMS-capable)

**Backend:**
- `POST /rsvp`
- Creates an attendee record and redirects user to Square checkout link.

**Database:**
```sql
create table attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  name text not null,
  email text not null,
  phone text not null,
  payment_status text default 'pending',
  created_at timestamptz default now()
);
````

**Logic:**

* Validate that attendee is unique per event (email + event_id).
* Generate or redirect to a Square payment link.
* Store `payment_status = 'pending'` until confirmed via webhook.

---

### 2. Square Payment Integration

**Purpose:** Collect event payments and mark attendees as paid.

**Frontend:**

* After registration, redirect to Square checkout.
* Redirect URL from Square → `/thank-you?attendee={id}`.

**Backend:**

* Endpoint `/thank-you`: verify payment success using Square API.
* Update `attendees.payment_status = 'paid'`.

**Note:**

* For speed, use **Square Payment Links** first (manual per event).
* Upgrade to Square Checkout API once stable.

---

### 3. Anonymous Photo Uploads

**Purpose:** Let attendees upload pictures to a shared event gallery anonymously.

**Frontend:**

* Public route `/upload`
* UI: File input, event code selector (or pre-linked to event)
* On submit → call API to get signed upload URL

**Backend:**

* `POST /uploads/sign` → returns `{ uploadUrl, storageKey }`
* `POST /uploads/complete` → save metadata to DB

**Database:**

```sql
create table media_assets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  storage_key text not null,
  uploaded_at timestamptz default now()
);
```

**Logic:**

* Allow uploads without authentication.
* Limit per-IP or per-session (e.g., max 20).
* Images stored on S3/R2 bucket.
* No user identifiers linked to uploads.

---

### 4. Text Blast System

**Purpose:** Allow organizers to send SMS messages to all paid attendees.

**Frontend:**

* Organizer dashboard page `/organizer`
* Message input box + “Send to All” button

**Backend:**

* `POST /broadcast`

  * Fetch all attendees with `payment_status = 'paid'`
  * Send SMS via Twilio API (or Square Messages)
  * Log message in DB

**Database:**

```sql
create table broadcasts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  message text not null,
  channel text default 'sms',
  sent_at timestamptz default now(),
  sent_by text
);
```

**Logic:**

* Store one row per broadcast message.
* Add basic rate limiting (e.g., 1 message per 30 sec).
* No reply/2-way messaging needed yet.

---

### 5. Organizer Dashboard (Minimal)

**Purpose:** Give organizers visibility into registrations, payments, and uploads.

**Frontend:**

* Private route `/organizer`
* Tabs or sections:

  * Attendees List (Name, Email, Phone, Payment Status)
  * “Send Text” form
  * Photo Gallery (thumbnails)

**Backend:**

* `GET /organizer/data` (requires organizer auth)
* Aggregates attendees + uploads + messages for event.

---

## 🏗️ System Architecture (MVP)

**Frontend:** React + Vite + Tailwind
**Backend:** Fastify (Node.js) or Express
**Database:** Neon Postgres (serverless, simple)
**Storage:** AWS S3 or Cloudflare R2 (for uploads)
**Payments:** Square API
**SMS:** Twilio (fast to set up)

---

## 🔐 Authentication (Simplified)

**For Attendees:**

* Anonymous — no login required.
* Payment confirmation marks them as “verified” participants.

**For Organizers:**

* Email/password (local or Stack Auth)
* Organizer ID stored in `events.created_by`

---

##  Database Summary

| Table                     | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `events`                  | Event info (title, date, price, organizer_id) |
| `attendees`               | Name, email, phone, payment_status            |
| `media_assets`            | Uploaded photos (anonymous)                   |
| `broadcasts`              | Sent text messages                            |
| `organizers` *(optional)* | Organizer accounts                            |

---

##  Minimal API Endpoints

| Route               | Method | Purpose                                    |
| ------------------- | ------ | ------------------------------------------ |
| `/rsvp`             | POST   | Create attendee record, redirect to Square |
| `/thank-you`        | GET    | Confirm payment success                    |
| `/uploads/sign`     | POST   | Get signed upload URL                      |
| `/uploads/complete` | POST   | Save uploaded image info                   |
| `/broadcast`        | POST   | Send SMS to attendees                      |
| `/organizer/data`   | GET    | Fetch event data summary                   |

---

##  Implementation Order

| Step | Feature                    | Priority |
| ---- | -------------------------- | -------- |
| 1    | Attendee registration form | High     |
| 2    | Square payment redirect    | High     |
| 3    | Anonymous photo upload     | High     |
| 4    | Organizer dashboard        | Medium   |
| 5    | Text blast system          | Medium   |
| 6    | Gallery view / polish      | Low      |

---

##  Success Criteria (MVP Definition of Done)

* Organizer can create an event and share a link.
* Attendees can sign up, pay, and upload photos anonymously.
* Organizer can view attendees and photos.
* Organizer can send one-to-many SMS blasts.
* System works end-to-end without manual intervention.

---

##  Next Steps (Post-MVP Roadmap)

After MVP launch:

1. Add attendee authentication & ticket QR codes.
2. Add live analytics (photo counts → vibe dashboard).
3. Add post-event recap report.
4. Add sponsor integrations and branding.
5. Add payment plans for organizers (Pro tier).

---

##  Notes for Developers & Agents

* Use descriptive commit messages (e.g., `feat: add RSVP endpoint with Square redirect`).
* Keep endpoints modular — everything is event-scoped.
* Maintain strong typing (TypeScript preferred).
* Follow privacy defaults: attendees are anonymous outside organizer dashboard.
* Keep all PII (email, phone) encrypted or hashed when not in use.

---

*This document defines the current MVP scope for Agama.
Future versions may add analytics, role systems, or sponsorship modules, but those are out of scope for now.*

```
