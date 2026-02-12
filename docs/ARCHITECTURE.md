# Architecture Overview

> Last Updated: 2026-02-12

---

## 1. System Architecture

ChauffeurTop follows a **serverless, edge-first architecture** built on Next.js App Router with Supabase as the backend-as-a-service layer.

```
                    ┌─────────────────────────────────────────────┐
                    │              CLIENTS                        │
                    │  Browser (Desktop/Mobile) │ PWA │ Admin     │
                    └─────────────┬───────────────────────────────┘
                                  │
                    ┌─────────────▼───────────────────────────────┐
                    │         VERCEL EDGE NETWORK                 │
                    │  ┌──────────────────────────────────┐       │
                    │  │     Next.js Middleware            │       │
                    │  │  - URL normalization              │       │
                    │  │  - Security headers (CSP, HSTS)   │       │
                    │  │  - Content Security Policy        │       │
                    │  └──────────────────────────────────┘       │
                    │                                             │
                    │  ┌──────────┐  ┌────────────┐  ┌────────┐  │
                    │  │  Pages   │  │ API Routes │  │ Server │  │
                    │  │  (SSR/   │  │  (REST)    │  │Actions │  │
                    │  │  Static) │  │            │  │        │  │
                    │  └────┬─────┘  └─────┬──────┘  └───┬────┘  │
                    └───────┼──────────────┼─────────────┼────────┘
                            │              │             │
               ┌────────────▼──────────────▼─────────────▼────────┐
               │              SUPABASE PLATFORM                    │
               │                                                   │
               │  ┌──────────┐ ┌──────────┐ ┌─────────────────┐  │
               │  │PostgreSQL│ │   Auth   │ │  Edge Functions  │  │
               │  │ Database │ │  (JWT)   │ │   (Deno)         │  │
               │  │  + RLS   │ │          │ │                  │  │
               │  └──────────┘ └──────────┘ └─────────────────┘  │
               │                                                   │
               │  ┌──────────┐ ┌──────────┐                      │
               │  │ Realtime │ │ Storage  │                      │
               │  │(WebSocket│ │ (Images) │                      │
               │  └──────────┘ └──────────┘                      │
               └──────────────────────────────────────────────────┘
                            │              │
               ┌────────────▼──────────────▼──────────────────────┐
               │           THIRD-PARTY SERVICES                    │
               │                                                   │
               │  ┌────────┐  ┌────────┐  ┌─────────────────┐    │
               │  │ Resend │  │Twilio  │  │ Google Maps/    │    │
               │  │ (Email)│  │ (SMS)  │  │ Analytics/GTM   │    │
               │  └────────┘  └────────┘  └─────────────────┘    │
               └──────────────────────────────────────────────────┘
```

---

## 2. Request Flow

### 2.1 Booking Submission Flow

```
Customer fills form → BookingForm.tsx (client validation via Zod)
    │
    ▼
submitBookingForm() Server Action
    │
    ├── 1. Normalize phone number
    ├── 2. INSERT into quotes table (Supabase)
    ├── 3. INSERT into lead_sources table (UTM data)
    ├── 4. Call Edge Function: send-quote-response (customer email + SMS)
    └── 5. Call API: /api/admin-notification (admin email)
```

### 2.2 Booking Confirmation Flow

```
Customer receives email with confirmation link
    │
    ▼
GET /api/confirm-booking?token=xxx
    │ (Redirect only - safe from email scanners)
    ▼
/confirm-booking/[token] page loads
    │ Fetches details via GET /api/confirm-booking/details?token=xxx
    │ Displays booking summary
    ▼
Customer clicks "Confirm Booking" button
    │
    ▼
POST /api/confirm-booking { token }
    │
    ├── 1. Find quote by confirmation_token
    ├── 2. UPDATE quotes.status = 'confirmed'
    ├── 3. INSERT into quote_activities (audit log)
    ├── 4. Send customer confirmation email (Resend)
    ├── 5. Send admin notification email (Resend)
    ├── 6. Send SMS via Twilio
    └── 7. Split return trip (if applicable) → creates 2nd booking
```

### 2.3 Admin Dashboard Flow

```
Admin navigates to /admin
    │
    ▼
ProtectedRoute checks auth via useAuth() hook
    │ (Supabase Auth session + profile role check)
    ▼
AdminDashboard loads with real-time subscriptions
    │
    ├── Supabase Realtime: quotes table changes
    ├── Supabase Realtime: bookings table changes
    │
    ▼
Admin actions (quote response, status update, etc.)
    │
    ├── Supabase client operations (authenticated)
    └── Edge Function calls for emails/SMS
```

---

## 3. Data Flow Diagram

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Website    │      │   Admin      │      │   Email/     │
│  (Customer)  │      │  Dashboard   │      │   SMS        │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                      │
       │ Booking Form        │ Manage Quotes        │ Webhooks
       │ Contact Form        │ Send Quotes          │
       │ Blog Views          │ Campaigns            │
       │                     │                      │
       ▼                     ▼                      ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE                              │
│                                                         │
│  quotes ←──→ quote_activities                           │
│  bookings ←──→ passengers                               │
│  contacts                                               │
│  blogs ←──→ profiles (auth.users)                       │
│  lead_sources ←──→ quotes                               │
│  email_subscriptions                                    │
│  marketing_audiences ←──→ marketing_campaigns           │
│                                                         │
│  Edge Functions:                                        │
│  - send-quote-response                                  │
│  - send-confirmation-email                              │
│  - send-follow-up                                       │
│  - send-reminder                                        │
│  - send-review-request                                  │
│  - send-admin-reminder                                  │
│  - send-booking-reminder                                │
│  - notify-lead                                          │
│  - send-notification                                    │
│  - get-maps-api-key                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Technology Stack Details

### 4.1 Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.1 | React framework with App Router, SSR, API routes |
| React | 19.2.3 | UI component library |
| TypeScript | 5 | Static typing |
| Tailwind CSS | 4 | Utility-first CSS framework |
| Framer Motion | latest | Animations and page transitions |
| Radix UI | various | Accessible headless UI components |
| TipTap | 2.10.3 | Rich text editor for blog CMS |
| Zod | 4.3.5 | Runtime schema validation |
| date-fns | 4.1.0 | Date manipulation |
| date-fns-tz | 3.2.0 | Timezone support |
| lucide-react | 0.562.0 | Icon library |
| react-day-picker | 9.13.0 | Date picker component |
| @googlemaps/js-api-loader | 2.0.2 | Google Maps API loader |

### 4.2 Backend

| Technology | Purpose |
|-----------|---------|
| Supabase PostgreSQL | Primary database with Row Level Security |
| Supabase Auth | JWT-based authentication |
| Supabase Realtime | WebSocket-based live updates |
| Supabase Storage | Image storage (public_assets, blog_images buckets) |
| Supabase Edge Functions | Deno-based serverless functions |
| Next.js API Routes | REST endpoints |
| Next.js Server Actions | Form submission handlers |

### 4.3 External Services

| Service | Purpose |
|---------|---------|
| Resend | Transactional and marketing emails |
| Twilio | SMS notifications and reminders |
| Google Maps | Address autocomplete, location services |
| Google Analytics 4 | Event tracking and conversion analytics |
| Google Tag Manager | Tag management (GTM-5QV92NKK) |
| Google Places | Business reviews |

---

## 5. Authentication Architecture

```
┌─────────────────────────────────────────┐
│           Supabase Auth                  │
│                                          │
│  ┌──────────┐    ┌──────────────────┐   │
│  │  JWT      │    │  auth.users      │   │
│  │  Tokens   │──→ │  (4 users)       │   │
│  └──────────┘    └────────┬─────────┘   │
│                           │              │
│                  ┌────────▼─────────┐    │
│                  │ public.profiles   │    │
│                  │  - id (FK)        │    │
│                  │  - email          │    │
│                  │  - role           │    │
│                  │    ('admin' or    │    │
│                  │     'editor')     │    │
│                  └──────────────────┘    │
└─────────────────────────────────────────┘

Client-side:  useAuth() hook → checks session + fetches profile role
Server-side:  supabaseAdmin → bypasses RLS with service_role key
Middleware:    Security headers applied to all routes
Protected:    /admin route guarded by ProtectedRoute component
```

### Role-Based Access

| Role | Capabilities |
|------|-------------|
| `admin` | Full access: manage quotes, bookings, contacts, blogs, campaigns |
| `editor` | Blog management, limited admin access |
| `anon` (public) | Submit quotes, contacts, view blogs, browse site |

---

## 6. Middleware Pipeline

The Next.js middleware (`middleware.ts`) runs on every request and handles:

1. **URL Normalization** - Converts URLs to lowercase, replaces `%20` with hyphens
2. **Security Headers**:
   - `Strict-Transport-Security` (HSTS)
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: geolocation=(self)`
3. **Content Security Policy** - Allowlists for Google services, Supabase, self

### CSP Allowlisted Domains
- `*.google-analytics.com`
- `*.googletagmanager.com`
- `*.googleapis.com`
- `*.gstatic.com`
- `*.supabase.co`
- `*.googleadservices.com`

---

## 7. Storage Architecture

### Supabase Storage Buckets

| Bucket | Purpose | Public |
|--------|---------|--------|
| `public_assets` | Website images, fleet photos, service images | Yes |
| `blog_images` | Blog post featured images and inline images | Yes |

### Static Assets (`/public/`)

```
public/
├── logo/           # Brand logos
├── fleet/          # Vehicle images
├── services/       # Service page images
├── about/          # About page images
├── contact/        # Contact page images
├── images/         # General images
├── icons/          # App icons
├── manifest.json   # PWA manifest
├── sw.js           # Service worker
└── robots.txt      # SEO crawl rules
```

---

## 8. Deployment Architecture

```
┌──────────────────────────────────────────┐
│              VERCEL                        │
│                                           │
│  ┌─────────────┐  ┌──────────────────┐   │
│  │ Edge Runtime │  │  Node.js Runtime │   │
│  │ (Middleware) │  │  (API Routes)    │   │
│  │             │  │  (Server Actions) │   │
│  └─────────────┘  └──────────────────┘   │
│                                           │
│  ┌─────────────────────────────────────┐  │
│  │  Static Assets (CDN-distributed)    │  │
│  └─────────────────────────────────────┘  │
└──────────────────────────────────────────┘
         │
         │  HTTPS
         ▼
┌──────────────────────────────────────────┐
│          SUPABASE CLOUD                   │
│  Region: (configured per project)         │
│  Project URL: eixvfhpxaxxdiekonldc        │
│                                           │
│  PostgreSQL + Auth + Realtime + Storage   │
│  + Edge Functions (Deno Deploy)           │
└──────────────────────────────────────────┘
```

### Environment Configuration

| Environment | Purpose |
|------------|---------|
| Production | `chauffeurtop.com.au` - live customer-facing |
| Development | Local with `.env.local` |

---

## 9. Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Next.js App Router** | Modern React patterns, server components, streaming SSR |
| **Supabase over custom backend** | Rapid development, built-in auth/realtime/storage, PostgreSQL with RLS |
| **Edge Functions for email/SMS** | Keep API keys server-side, async processing, decoupled from frontend |
| **Server Actions for forms** | Type-safe form handling, automatic CSRF protection, progressive enhancement |
| **Zod for validation** | Runtime type checking, shared schemas between client and server |
| **Tailwind CSS** | Rapid UI development, consistent design system, tree-shakeable |
| **Radix UI (shadcn/ui)** | Accessible components, unstyled/customizable, no vendor lock-in |
| **Resend for email** | Modern API, React email support, webhook tracking |
| **Twilio for SMS** | Industry standard, reliable delivery, AU number support |

---

## 10. Real-Time Architecture

The admin dashboard uses Supabase Realtime for live updates:

```
Supabase Realtime (WebSocket)
    │
    ├── Channel: quotes table changes
    │   └── Admin dashboard auto-refreshes quote list
    │
    └── Channel: bookings table changes
        └── Admin dashboard shows new booking notifications
```

### Configuration
- Realtime is enabled on `quotes` and `bookings` tables
- Client subscribes on admin dashboard mount
- Unsubscribes on unmount to prevent memory leaks
