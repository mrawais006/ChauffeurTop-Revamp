# API Reference

> Last Updated: 2026-02-12

---

## Table of Contents

1. [Overview](#overview)
2. [API Routes](#api-routes)
3. [Server Actions](#server-actions)
4. [Edge Functions](#edge-functions-summary)

---

## Overview

ChauffeurTop uses three types of server-side endpoints:

| Type | Location | Auth | Use Case |
|------|----------|------|----------|
| **API Routes** | `/app/api/` | Varies (see below) | REST endpoints for webhooks, confirmations, external service calls |
| **Server Actions** | `/actions/` | None (CSRF protected by Next.js) | Form submissions |
| **Edge Functions** | Supabase | JWT (most) | Email/SMS sending, API key management |

---

## API Routes

### POST `/api/confirm-booking`

**Purpose:** Confirms a booking after customer clicks confirmation button.

**Request Body:**
```json
{
  "token": "string (required) - confirmation token from email"
}
```

**Response (200):**
```json
{
  "success": true,
  "quote_id": "uuid"
}
```

**Response (200, already confirmed):**
```json
{
  "success": true,
  "quote_id": "uuid",
  "already_confirmed": true
}
```

**Errors:**
| Status | Body | Cause |
|--------|------|-------|
| 400 | `{ "error": "Missing confirmation token" }` | No token in body |
| 404 | `{ "error": "Booking not found" }` | Invalid token |
| 500 | `{ "error": "Failed to confirm booking" }` | Database error |
| 500 | `{ "error": "Server error" }` | Unexpected error |

**Side Effects:**
- Updates `quotes.status` to `'confirmed'`
- Sets `quotes.quote_accepted_at` to current time
- Creates `quote_activities` record (`customer_confirmed`)
- Sends customer confirmation email (Resend)
- Sends admin notification email (Resend)
- Sends SMS via Twilio
- Splits return trips into two bookings

**Auth:** None (token-based)

---

### GET `/api/confirm-booking`

**Purpose:** Safe redirect endpoint for email links (prevents email scanner auto-confirmation).

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | Confirmation token |

**Response:** 307 redirect to `/confirm-booking/{token}`

---

### GET `/api/confirm-booking/details`

**Purpose:** Fetches booking details for the confirmation page.

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | Confirmation token |

**Response (200):**
```json
{
  "quote": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string",
    "status": "string",
    "pickup_location": "string",
    "dropoff_location": "string",
    "destinations": "array|object",
    "date": "string",
    "time": "string",
    "vehicle_name": "string",
    "vehicle_type": "string",
    "passengers": "number",
    "quoted_price": "number"
  }
}
```

**Auth:** None (token-based)

---

### POST `/api/admin-notification`

**Purpose:** Sends an HTML email notification to admin when a new quote is submitted.

**Request Body:**
```json
{
  "quote": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "date": "string",
    "time": "string",
    "service_type": "string",
    "vehicle_name": "string",
    "vehicle_type": "string",
    "passengers": "number",
    "pickup_location": "string",
    "dropoff_location": "string",
    "destinations": "array",
    "driver_instructions": "string (optional)"
  },
  "type": "string (optional)"
}
```

**Response (200):**
```json
{ "success": true }
```

**Auth:** None
**External Service:** Resend (bookings@chauffeurtop.com.au -> admin@chauffeurtop.com.au)

---

### POST `/api/send-reminder`

**Purpose:** Sends booking reminder via email and SMS.

**Request Body:**
```json
{
  "booking": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "melbourne_datetime": "string (or date + time)",
    "pickup_location": "string",
    "vehicle_name": "string",
    "vehicle_type": "string",
    "passengers": "number"
  },
  "customMessage": "string (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "emailSent": true,
  "smsSent": true,
  "errors": []
}
```

**Auth:** None
**External Services:** Resend (email), Twilio (SMS)

---

### GET `/api/reviews`

**Purpose:** Fetches Google Places reviews for the business.

**Response (200):**
```json
{
  "result": {
    "reviews": [
      {
        "author_name": "string",
        "rating": "number",
        "relative_time_description": "string",
        "text": "string"
      }
    ],
    "mock": false
  }
}
```

**Auth:** None
**External Service:** Google Places API
**Note:** Returns `{ reviews: [], mock: true }` if API keys not configured

---

### POST `/api/webhooks/resend`

**Purpose:** Handles Resend email webhook events for campaign tracking.

**Webhook Events:**
| Event | Action |
|-------|--------|
| `email.delivered` | Logged |
| `email.opened` | Increments campaign `open_count` |
| `email.clicked` | Increments campaign `click_count` |
| `email.bounced` | Logged |
| `email.complained` | Logged |

**Request Body (from Resend):**
```json
{
  "type": "email.opened",
  "data": {
    "to": "recipient@email.com",
    "tags": {
      "campaign_id": "uuid (optional)"
    }
  }
}
```

**Response:** Always `{ "received": true }` (200)

**Auth:** None (webhook endpoint)

---

### Marketing APIs

#### GET `/api/marketing/audiences`
Lists all marketing audiences.

#### POST `/api/marketing/audiences`
Creates a new audience with optional Resend sync.

**Body:** `{ name, description?, filter_criteria? }`

#### PUT `/api/marketing/audiences`
Updates an audience.

**Body:** `{ id, name?, description?, filter_criteria? }`

#### DELETE `/api/marketing/audiences?id={uuid}`
Deletes an audience.

---

#### GET `/api/marketing/campaigns`
Lists all campaigns with audience names.

#### POST `/api/marketing/campaigns`
Creates a campaign. Set `action: 'send'` to send immediately.

**Body:** `{ audience_id?, subject, template_type, html_content?, action? }`

#### PUT `/api/marketing/campaigns`
Updates or sends a campaign.

**Body:** `{ id, subject?, html_content?, action? }`

---

#### GET `/api/marketing/segments`
Returns predefined segments with contact counts.

**Segments:** `cancelled`, `lost`, `pending_old`, `past_customers`, `high_value`, `airport`, `corporate`, `email_subscribers`, `all_leads`

#### POST `/api/marketing/segments`
Preview contacts in a segment.

**Body:** `{ segment, limit? }`

---

## Server Actions

### `submitBookingForm(formData: BookingFormData)`

**Location:** `src/actions/booking.ts`

**Flow:**
1. Normalizes phone number
2. Inserts quote into `quotes` table
3. Inserts lead source data into `lead_sources`
4. Calls Edge Function `send-quote-response` (customer email + SMS)
5. Calls `/api/admin-notification` (admin email)

**Returns:** `BookingSubmissionResult`

---

### `submitContactForm(formData: ContactFormData)`

**Location:** `src/actions/contact.ts`

**Flow:**
1. Validates contact form via Zod schema
2. Inserts into `contacts` table
3. Sends notification via Edge Function

**Returns:** `ContactSubmissionResult`

---

## Edge Functions Summary

See [Edge Functions documentation](./EDGE_FUNCTIONS.md) for full details.

| Function | JWT | Purpose |
|----------|-----|---------|
| `send-quote-response` | Yes | Send quote email + SMS to customer |
| `send-confirmation-email` | No | Send booking confirmation email |
| `send-follow-up` | Yes | Send follow-up/discount email |
| `send-reminder` | Yes | Send booking reminder |
| `send-review-request` | Yes | Send review request after trip |
| `send-booking-reminder` | Yes | Pre-trip reminder |
| `send-admin-reminder` | Yes | Admin reminder for pending quotes |
| `send-notification` | Yes | General notification sender |
| `notify-lead` | Yes | New lead notification |
| `get-maps-api-key` | Yes | Securely serve Google Maps API key |
