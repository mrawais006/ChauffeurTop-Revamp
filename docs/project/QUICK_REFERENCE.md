# Quick Reference Guide

## Landing Page URLs

| Service | Control URL | A/B Variant |
|---------|-------------|-------------|
| Airport | `/ads/melbourne-airport-transfer` | `/ads/melbourne-airport-transfer-v2` |
| Corporate | `/ads/corporate-transfer` | - |
| Family | `/ads/family-transfer` | - |
| Thank You | `/ads/thank-you` | - |

---

## Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `LandingPageLayout` | `components/landing/` | Isolated layout with mobile CTA |
| `LandingPageHero` | `components/landing/` | Hero section with pricing |
| `LandingPageForm` | `components/landing/` | Pre-selected service form |
| `LandingFleetGrid` | `components/landing/` | Fleet without individual CTAs |
| `WhatsAppButton` | `components/ui/` | Floating WhatsApp |
| `LiveBookingNotification` | `components/ui/` | Social proof toasts |
| `ExitIntentPopup` | `components/landing/` | Email capture popup |

---

## SessionStorage Keys

| Key | Purpose |
|-----|---------|
| `chauffeur_form_data` | Form pre-population data |
| `chauffeur_form_data_expiry` | Expiry timestamp (30 min) |
| `exitIntentShown` | Exit popup shown flag |
| `ab_[testName]` | A/B test variant tracking |

---

## Lead Sources

| Source Value | Description |
|--------------|-------------|
| `website` | Main website form |
| `landing_airport` | Airport landing page |
| `landing_corporate` | Corporate landing page |
| `landing_family` | Family landing page |
| `landing_airport_v2` | Airport A/B variant |
| `homepage_widget` | Homepage booking widget |
| `vehicle_selection` | Fleet page selection |
| `service_selection` | Service page selection |

---

## Analytics Events

### Form Events
- `form_start`
- `form_field_completed`
- `form_submit`
- `form_error`

### CTA Events
- `cta_click`
- `scroll_to_form`
- `phone_click`
- `whatsapp_click`

### Conversion Events
- `quote_submitted`
- `booking_confirmed`

### Exit Intent
- `exit_intent_shown`
- `exit_intent_converted`
- `exit_intent_dismissed`

---

## Database Tables

### `lead_sources` (New)
```sql
id, quote_id, source, page_url,
utm_source, utm_medium, utm_campaign,
utm_content, utm_term, gclid,
referrer, user_agent, created_at
```

---

## Service Types

| Value | Label | Notes |
|-------|-------|-------|
| `Airport Transfer` | Airport Transfer | Default for airport landing |
| `Corporate Travel` | Corporate Travel | Default for corporate landing |
| `Family Travel` | Family Travel | **NEW** - Default for family landing |
| `Special Events` | Special Events | |
| `Winery Tours` | Winery Tours | |
| `Point to Point` | Point to Point | |
| `Hourly Charter` | Hourly Charter | |

---

## Mobile Breakpoints

- Desktop header visible: `md:` (768px+)
- Mobile sticky CTA: visible on `< md`
- Touch targets: 56px minimum

---

## File Naming Convention

```
app/ads/[service-slug]/
├── page.tsx                    # Server component with metadata
└── [ServiceName]Content.tsx    # Client component with content

# A/B Variants
app/ads/[service-slug]-v2/
├── page.tsx
└── [ServiceName]V2Content.tsx
```
