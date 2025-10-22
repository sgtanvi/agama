Awesome—what you want is **Square OAuth (“Connect”)** so each organizer links their own Square account to your app. That lets you create checkout links and record payments **on their Square**, without you touching their credentials.

Here’s a drop-in `.md` you can add to your repo (e.g., `docs/SQUARE_CONNECT.md`) for your devs/agents.

---

```markdown
# Square Connect (OAuth) — Organizer Payments Integration

Goal: let **organizers** connect their own Square account to Orbit.  
After connection, the organizer can accept attendee payments via Square Checkout/Payment Links, and we can verify payments via webhooks.

---

## Overview

- **Auth model**: Organizers authenticate in Orbit (your app). Then they **connect** their Square merchant via OAuth.
- **What we store**: Square `merchant_id`, an **access token** (encrypted), optional `refresh_token`, and default `location_id`.
- **What we do**: Create Orders/Payment Links/Checkout sessions using the organizer’s Square credentials. Confirm payment via Square webhooks.

---

## Square App Setup (Console)

1. Create a Square Developer account and an **Application** (Sandbox + Production).
2. In the Square Developer Dashboard:
   - Copy **Application ID** and **Client Secret**.
   - Set **Redirect URL** to:  
     `https://<api-domain>/api/integrations/square/callback`
   - Enable **Webhooks** → point to:  
     `https://<api-domain>/api/integrations/square/webhook`
   - Choose required **scopes** (minimum for checkout/payment links):
     - `PAYMENTS_WRITE`, `PAYMENTS_READ`
     - `ORDERS_WRITE`, `ORDERS_READ`
     - (Optional) `CUSTOMERS_READ`, `CUSTOMERS_WRITE` if you want to save buyer info later.

**Environment variables**
```

SQUARE_ENV=sandbox|production
SQUARE_APPLICATION_ID=...
SQUARE_CLIENT_ID=...         # same as Application ID in some SDKs
SQUARE_CLIENT_SECRET=...
SQUARE_WEBHOOK_SIGNATURE_KEY=...  # from Webhooks settings

````

---

## Data Model

```sql
-- One Square connection per organizer/org
create table square_connections (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  merchant_id text not null,
  access_token text not null,          -- store encrypted
  refresh_token text,                  -- store encrypted if provided
  token_expires_at timestamptz,        -- nullable if not using expiring tokens
  default_location_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id)
);

-- Optional: cache of locations for UX
create table square_locations (
  id text primary key,                 -- Square location id
  org_id uuid not null references organizations(id),
  name text,
  country text,
  currency text,
  created_at timestamptz default now()
);

-- Payments we care about (mirror key fields for reporting)
create table payments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id),
  org_id uuid not null references organizations(id),
  attendee_id uuid references attendees(id),
  square_payment_id text unique,
  square_order_id text,
  status text not null,                -- 'PENDING'|'COMPLETED'|'CANCELED'|...
  amount_money integer not null,       -- in smallest denomination (e.g., cents)
  currency text not null,
  received_at timestamptz,
  raw_json jsonb,                      -- webhook snapshot
  created_at timestamptz default now()
);
````

---

## OAuth Flow (Organizer connects Square)

**Frontend**

* Organizer visits **Settings → Payments** and clicks **“Connect Square”**.
* We send them to our backend redirect endpoint:

  * `GET /api/integrations/square/auth?orgId=<...>`

**Backend**

1. **Auth start** — redirect to Square:

```
GET /api/integrations/square/auth
→ 302 to https://connect.squareup.com/oauth2/authorize
   ?client_id=SQUARE_CLIENT_ID
   &scope=PAYMENTS_WRITE%20PAYMENTS_READ%20ORDERS_WRITE%20ORDERS_READ
   &state=<nonce-tied-to-org-and-user>
   &session=false
   &redirect_uri=https://<api>/api/integrations/square/callback
```

2. **Callback** — exchange `code` for tokens:

```
GET /api/integrations/square/callback?code=...&state=...
```

* Validate `state`.
* POST to `https://connect.squareup.com/oauth2/token` with:

  ```json
  {
    "client_id": "SQUARE_CLIENT_ID",
    "client_secret": "SQUARE_CLIENT_SECRET",
    "code": "<code>",
    "grant_type": "authorization_code"
  }
  ```
* Store: `merchant_id`, `access_token` (encrypt at rest), `refresh_token` (if present), and fetch Locations.

3. **Locations** — pick a default:

* Call `GET /v2/locations` with the access token.
* Persist available locations in `square_locations`.
* Set `square_connections.default_location_id` to the organizer’s choice (or the first ACTIVE location).

**Organizer UX**

* After callback, show a page:

  * “Connected to Square merchant: **{merchant_name}**”
  * Dropdown: **Default Location**
  * Save.

---

## Creating a Checkout for an Attendee

Two fast options; choose **A** (Payment Links) to start, then upgrade to **B** (Checkout API).

### A) Payment Links API (fastest)

* Create a **Payment Link** per price tier (or dynamic) using organizer’s token.
* Response returns a hosted `url`. Redirect attendee there after RSVP.

Request outline (server-side):

```
POST /v2/online-checkout/payment-links
Authorization: Bearer <organizer_access_token>
{
  "idempotency_key": "<uuid>",
  "order": {
    "location_id": "<default_location_id>",
    "line_items": [
      {"name": "Event Ticket", "quantity": "1", "base_price_money": {"amount": 2000, "currency": "USD"}}
    ],
    "reference_id": "event:<event_id>|attendee:<attendee_id>"
  },
  "checkout_options": {
    "redirect_url": "https://<app>/thank-you?attendee=<attendee_id>&event=<event_id>"
  }
}
```

* Redirect attendee to `payment_link.url`.

### B) Checkout API (more control)

* Create an **Order** then a **Checkout** tied to that order.
* Same principle; you get a `checkout_page_url`.

---

## Payment Confirmation (Webhook)

**In Square Dashboard:**

* Add webhook subscriptions for:

  * `payments.created`
  * `payments.updated`
  * (Optional) `orders.updated`

**Backend endpoint**:

```
POST /api/integrations/square/webhook
```

* Validate signature using `SQUARE_WEBHOOK_SIGNATURE_KEY`.
* Parse event type; upsert `payments` record by `square_payment_id`.
* Update `attendees.payment_status = 'paid'` when `payments.updated` → `COMPLETED`.

**Important**: The redirect “thank-you” page is **not** a source of truth. The webhook is.

---

## Organizer Login vs Square Connect

* Organizers sign into Orbit normally (your auth).
* **Square Connect** is an additional step to link their merchant account.
* You never handle their Square username/password; OAuth only.

---

## Minimal Backend Endpoints

| Route                                        | Method | Auth      | Purpose                                                     |
| -------------------------------------------- | ------ | --------- | ----------------------------------------------------------- |
| `/api/integrations/square/auth`              | GET    | Organizer | Start OAuth and redirect to Square                          |
| `/api/integrations/square/callback`          | GET    | Organizer | Exchange `code` → tokens; store connection; fetch locations |
| `/api/integrations/square/locations`         | GET    | Organizer | List connected merchant locations                           |
| `/api/integrations/square/locations/default` | POST   | Organizer | Set default location                                        |
| `/api/integrations/square/payment-link`      | POST   | Organizer | Create a payment link for an attendee/order                 |
| `/api/integrations/square/webhook`           | POST   | Public    | Receive and verify Square events; update payments/attendees |

**Request to create payment link (example)**

```json
POST /api/integrations/square/payment-link
{
  "eventId": "evt_123",
  "attendeeId": "att_456",
  "amount": 2000,
  "currency": "USD",
  "lineItemName": "General Admission"
}
```

**Response**

```json
{"url":"https://square.link/u/abcdEF"}
```

---

## Security & Compliance

* Encrypt `access_token` and `refresh_token` at rest.
* Scope tokens to the **minimum** needed for your flows.
* Validate webhook signatures and keep an audit log of events processed.
* Idempotency keys on create requests (per attendee per event).
* Handle token rotation/refresh if provided; if not, request re-auth on 401.

---

## Attendee Flow (End-to-End)

1. Attendee fills **/rsvp** (name, email, phone).
2. Server creates attendee row (`payment_status='pending'`) and requests payment link via organizer’s Square connection.
3. Server redirects to Square hosted checkout.
4. On payment completion:

   * Square redirects attendee to `/thank-you`.
   * Webhook `payments.updated` arrives → we mark `attendees.payment_status='paid'`.
5. Organizer can now send SMS blasts; attendee is included if `status='paid'`.

---

## Troubleshooting

* **401 from Square**: token expired/revoked → prompt organizer to reconnect.
* **No locations**: merchant has no ACTIVE locations; show error in UI and block checkout creation.
* **Webhooks not firing**: verify production vs sandbox URLs; check event types enabled and signature validation.
* **Duplicate payments**: enforce idempotency by `(event_id, attendee_id)` in your payment creation flow.

---

## Nice-to-haves (later)

* Store `order_id` and render a receipt link in your dashboard.
* Map refunds/cancellations from webhooks to your `payments` table and attendee status.
* Support tiered tickets by creating distinct payment links per SKU.
* Add automatic tax/tips via Square order settings if the organizer requests it.

---
