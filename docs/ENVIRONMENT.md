# Environment Setup Guide

> Last Updated: 2026-02-12

---

## Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

### Supabase (Required)

| Variable | Example | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://eixvfhpxaxxdiekonldc.supabase.co` | Supabase project URL (public, safe for client) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Supabase anonymous/public key (safe for client) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Supabase service role key (**SERVER-ONLY, never expose**) |

**Where to find:** Supabase Dashboard > Settings > API

---

### Email Service - Resend (Required for email features)

| Variable | Example | Description |
|----------|---------|-------------|
| `RESEND_API_KEY` | `re_5XXJrse...` | Resend API key for transactional emails |

**Where to find:** [Resend Dashboard](https://resend.com/api-keys)

**Email addresses configured:**
- `bookings@chauffeurtop.com.au` - Sender address
- `admin@chauffeurtop.com.au` - Admin notification recipient

---

### SMS Service - Twilio (Optional, for SMS features)

| Variable | Example | Description |
|----------|---------|-------------|
| `TWILIO_ACCOUNT_SID` | `AC...` | Twilio account identifier |
| `TWILIO_AUTH_TOKEN` | `...` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | `+1...` | Twilio sender phone number |

**Where to find:** [Twilio Console](https://console.twilio.com)

---

### Google Services (Optional)

| Variable | Example | Description |
|----------|---------|-------------|
| `GOOGLE_PLACES_API_KEY` | `AIza...` | Google Places API key (for reviews) |
| `GOOGLE_PLACE_ID` | `ChIJ...` | Google Place ID for business reviews |

**Note:** The Google Maps API key for autocomplete is served via the `get-maps-api-key` Edge Function and configured in Supabase secrets, not in `.env.local`.

---

### Application

| Variable | Example | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://chauffeurtop.com.au` | Public site URL |

---

## Environment Variable Template

```env
# ===========================================
# ChauffeurTop Environment Configuration
# ===========================================

# --- Supabase ---
NEXT_PUBLIC_SUPABASE_URL=https://eixvfhpxaxxdiekonldc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# --- Resend (Email) ---
RESEND_API_KEY=your_resend_api_key_here

# --- Twilio (SMS) - Optional ---
TWILIO_ACCOUNT_SID=your_twilio_sid_here
TWILIO_AUTH_TOKEN=your_twilio_token_here
TWILIO_PHONE_NUMBER=+1234567890

# --- Google (Optional) ---
GOOGLE_PLACES_API_KEY=your_google_api_key_here
GOOGLE_PLACE_ID=your_google_place_id_here

# --- Application ---
NEXT_PUBLIC_SITE_URL=https://chauffeurtop.com.au
```

---

## Supabase Edge Function Secrets

These are configured separately in Supabase Dashboard > Edge Functions > Secrets:

| Secret | Purpose |
|--------|---------|
| `RESEND_API_KEY` | Email sending from Edge Functions |
| `TWILIO_ACCOUNT_SID` | SMS from Edge Functions |
| `TWILIO_AUTH_TOKEN` | SMS auth from Edge Functions |
| `TWILIO_PHONE_NUMBER` | SMS sender from Edge Functions |
| `GOOGLE_MAPS_API_KEY` | Maps API key served to frontend |
| `SITE_URL` | Base URL for links in emails |

---

## Local Development Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd ChauffeurTop-Revamp-main

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local
# Then fill in your actual values

# 4. Start development server
npm run dev

# 5. Open in browser
open http://localhost:3000
```

---

## Production Deployment (Vercel)

1. Push code to GitHub
2. Connect repository in Vercel Dashboard
3. Add all environment variables in Vercel > Settings > Environment Variables
4. Deploy

**Important:** Never commit `.env.local` to version control. It is already in `.gitignore`.

---

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` bypasses all RLS policies - use only in server-side code
- `RESEND_API_KEY` can send emails as your domain - protect carefully
- `TWILIO_AUTH_TOKEN` can send SMS on your account - protect carefully
- All `NEXT_PUBLIC_*` variables are exposed to the browser - only use for public data
