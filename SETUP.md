# Agama Setup Guide - 9 Days to Launch

**Target Launch:** October 23rd

## Current Status

✅ Next.js 15 + TypeScript configured
✅ Tailwind CSS set up
✅ Drizzle ORM + Neon Postgres schema defined
✅ Clerk authentication integrated
✅ Dependencies installed

⏳ **Next Steps:** Set up external services and build features

---

## Required External Services Setup

### 1. Clerk (Authentication) - 10 minutes

1. Go to https://clerk.com and sign up
2. Create a new application
3. Copy your API keys from the dashboard
4. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

### 2. Neon Postgres (Database) - 5 minutes

1. Go to https://neon.tech and sign up
2. Create a new project called "agama"
3. Copy the connection string
4. Add to `.env.local`:
   ```bash
   DATABASE_URL=postgresql://user:password@host.neon.tech/agama?sslmode=require
   ```
5. Run migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

### 3. Cloudflare R2 (Photo Storage) - 15 minutes

1. Go to https://dash.cloudflare.com
2. Navigate to R2 Object Storage
3. Create a bucket called "agama-uploads"
4. Go to "Manage R2 API Tokens"
5. Create an API token with "Object Read & Write" permissions
6. Add to `.env.local`:
   ```bash
   R2_ACCOUNT_ID=your-account-id
   R2_ACCESS_KEY_ID=your-access-key
   R2_SECRET_ACCESS_KEY=your-secret-key
   R2_BUCKET_NAME=agama-uploads
   R2_PUBLIC_URL=https://agama-uploads.your-account.r2.dev
   ```
7. Enable public access for the bucket (Settings → Public Access → Allow)

### 4. Square (Payments) - 15 minutes

1. Go to https://developer.squareup.com and sign up
2. Create a new application
3. Go to "Credentials" → "Sandbox"
4. Copy your sandbox access token and location ID
5. Add to `.env.local`:
   ```bash
   SQUARE_ACCESS_TOKEN=your-sandbox-access-token
   SQUARE_LOCATION_ID=your-location-id
   SQUARE_ENVIRONMENT=sandbox
   SQUARE_WEBHOOK_SIGNATURE_KEY=your-webhook-key
   ```
6. **For production:** Switch to Production credentials before Oct 23

### 5. Courier (SMS) - 10 minutes

1. Go to https://courier.com and sign up
2. Navigate to Settings → API Keys
3. Copy your production auth token
4. Add to `.env.local`:
   ```bash
   COURIER_AUTH_TOKEN=your-auth-token
   ```
5. Configure SMS provider (Twilio/etc) in Courier dashboard

---

## Local Development

1. Copy environment template:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in all credentials from above services

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

---

## Build Timeline (Oct 14-23)

### Week 1: Core Features (Oct 14-20)

**Oct 14-15 (Today!):**
- ✅ Project setup complete
- 🔄 Complete external service setup
- 🔄 Build event creation form
- 🔄 Build RSVP form with Square checkout

**Oct 16-17:**
- Photo upload flow with R2
- Anonymous upload page
- Gallery view for organizers

**Oct 18-19:**
- SMS broadcast system
- Organizer dashboard improvements
- Attendee management

**Oct 20:**
- Testing with real organizer
- Bug fixes

### Week 2: Polish & Launch (Oct 21-23)

**Oct 21:**
- UI/UX polish
- Mobile responsiveness
- Error handling

**Oct 22:**
- Final testing
- Switch Square to production
- Deploy to Vercel

**Oct 23:**
- 🎉 **LAUNCH DAY**
- Monitor event in real-time
- Fix any critical bugs

---

## Next Immediate Steps

Run these commands now:

```bash
# 1. Create .env.local file
cp .env.local.example .env.local

# 2. Edit .env.local with your credentials (use nano or your editor)
nano .env.local

# 3. Once DATABASE_URL is set, run migrations
npm run db:generate
npm run db:migrate

# 4. Start dev server
npm run dev
```

Then open http://localhost:3000 and sign in with Google to test Clerk.

---

## Deployment to Vercel (Do this after basic features work)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Add all environment variables in Vercel dashboard before deploying.

---

## Troubleshooting

**Build fails:**
- Check all env variables are set
- Make sure DATABASE_URL is correct
- Try `rm -rf .next && npm run dev`

**Database connection fails:**
- Verify Neon connection string includes `?sslmode=require`
- Check IP allowlist in Neon dashboard (should allow all)

**Clerk auth not working:**
- Verify callback URLs in Clerk dashboard match your domain
- Check `NEXT_PUBLIC_` prefix on publishable key

---

## Questions?

- Clerk docs: https://clerk.com/docs/quickstarts/nextjs
- Drizzle docs: https://orm.drizzle.team/docs/overview
- Square docs: https://developer.squareup.com/docs/checkout-api/quick-start
- Courier docs: https://www.courier.com/docs/

---

**LET'S SHIP THIS! 🚀**
