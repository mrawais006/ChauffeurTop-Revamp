# Supabase Edge Functions Reference

> Last Updated: 2026-02-12
> Runtime: Deno (Supabase Edge Runtime)
> Total Functions: 11

---

## Overview

Edge Functions run on Supabase's Deno-based edge runtime. They handle email sending, SMS notifications, and secure API key delivery. Most require JWT authentication.

---

## Function Inventory

| # | Function | JWT Required | Status | Version | Purpose |
|---|----------|-------------|--------|---------|---------|
| 1 | `send-quote-response` | Yes | ACTIVE | v29 | Send quote email + SMS to customer |
| 2 | `send-confirmation-email` | **No** | ACTIVE | v8 | Send booking confirmation email |
| 3 | `send-follow-up` | Yes | ACTIVE | v22 | Send follow-up/discount email |
| 4 | `send-reminder` | Yes | ACTIVE | v1 | Send booking reminder |
| 5 | `send-booking-reminder` | Yes | ACTIVE | v4 | Pre-trip reminder |
| 6 | `send-review-request` | Yes | ACTIVE | v7 | Post-trip review request |
| 7 | `send-admin-reminder` | Yes | ACTIVE | v6 | Admin reminder for pending quotes |
| 8 | `confirm-booking` | Yes | ACTIVE | v14 | Booking confirmation logic |
| 9 | `send-notification` | Yes | ACTIVE | v60 | General notification sender |
| 10 | `notify-lead` | Yes | ACTIVE | v57 | New lead notification |
| 11 | `get-maps-api-key` | Yes | ACTIVE | v21 | Securely serve Google Maps API key |

---

## Detailed Documentation

### 1. `send-quote-response`

**Purpose:** Sends initial quote acknowledgment email and SMS to customer after they submit a booking request.

**JWT:** Required
**Version:** 29

**Expected Request Body:**
```json
{
  "quote": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string",
    "date": "string",
    "time": "string",
    "service_type": "string",
    "vehicle_name": "string",
    "passengers": "number",
    "pickup_location": "string",
    "destinations": "array",
    "dropoff_location": "string",
    "quoted_price": "number (optional)",
    "confirmation_token": "string"
  }
}
```

**Actions:**
1. Generates HTML email with quote details
2. Sends email via Resend API
3. Sends SMS via Twilio (if configured)
4. Includes confirmation link in email

**External Services:** Resend, Twilio

---

### 2. `send-confirmation-email`

**Purpose:** Sends booking confirmation email after customer confirms their quote.

**JWT:** Not required (called from API route with service role)
**Version:** 8

**Expected Request Body:**
```json
{
  "quote": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string",
    "date": "string",
    "time": "string",
    "vehicle_name": "string",
    "pickup_location": "string",
    "destinations": "array",
    "quoted_price": "number"
  }
}
```

**Actions:**
1. Sends customer confirmation email
2. Sends admin notification email

**External Service:** Resend

---

### 3. `send-follow-up`

**Purpose:** Sends follow-up email for pending quotes, optionally with discount offers.

**JWT:** Required
**Version:** 22

**Expected Request Body:**
```json
{
  "quote": { "...quote fields..." },
  "type": "reminder | discount | personal",
  "customMessage": "string (optional)",
  "discountPercentage": "number (optional)"
}
```

**External Service:** Resend

---

### 4. `send-reminder`

**Purpose:** Sends booking reminder email.

**JWT:** Required
**Version:** 1

---

### 5. `send-booking-reminder`

**Purpose:** Sends pre-trip booking reminder to customer.

**JWT:** Required
**Version:** 4

---

### 6. `send-review-request`

**Purpose:** Sends post-trip review request to customer.

**JWT:** Required
**Version:** 7

---

### 7. `send-admin-reminder`

**Purpose:** Reminds admin about pending quotes that need attention.

**JWT:** Required
**Version:** 6

---

### 8. `confirm-booking`

**Purpose:** Handles booking confirmation logic (alternative to API route).

**JWT:** Required
**Version:** 14

---

### 9. `send-notification`

**Purpose:** General-purpose notification sender.

**JWT:** Required
**Version:** 60 (most deployed)

---

### 10. `notify-lead`

**Purpose:** Sends notification when a new lead/quote comes in.

**JWT:** Required
**Version:** 57

---

### 11. `get-maps-api-key`

**Purpose:** Securely serves Google Maps API key to frontend. Prevents exposing the key in client-side environment variables.

**JWT:** Required
**Version:** 21

**Response:**
```json
{
  "apiKey": "string"
}
```

---

## Environment Variables (Edge Function Secrets)

These are set in Supabase Dashboard > Edge Functions > Secrets:

| Variable | Used By | Purpose |
|----------|---------|---------|
| `RESEND_API_KEY` | All email functions | Resend API authentication |
| `TWILIO_ACCOUNT_SID` | SMS functions | Twilio account ID |
| `TWILIO_AUTH_TOKEN` | SMS functions | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | SMS functions | Twilio sender number |
| `SUPABASE_URL` | All functions | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | All functions | Supabase admin access |
| `GOOGLE_MAPS_API_KEY` | `get-maps-api-key` | Google Maps API key |
| `SITE_URL` | Email functions | Base URL for links in emails |

---

## Deployment

Edge Functions are deployed via the Supabase Dashboard or CLI:

```bash
# Deploy a single function
supabase functions deploy send-quote-response

# Deploy all functions
supabase functions deploy
```

**Note:** Functions can also be deployed via the Supabase MCP tools used in this project.

---

## Email Template Design

All email templates follow a consistent luxury brand design:

- **Background:** `#1A1F2C` (dark)
- **Card Background:** `#2A2F3C`
- **Accent Color:** `#C5A572` (gold)
- **Text Color:** `#FFFFFF`
- **Font:** System sans-serif
- **Layout:** Centered card with brand header, content, and footer
- **Footer:** Contact info, social links, unsubscribe (marketing)
