# Developer Onboarding Guide

> Last Updated: 2026-02-12
> Welcome to ChauffeurTop! This guide will get you productive in the codebase.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Project Structure](#2-project-structure)
3. [Key Concepts](#3-key-concepts)
4. [Coding Conventions](#4-coding-conventions)
5. [Common Tasks](#5-common-tasks)
6. [Debugging](#6-debugging)
7. [Related Documentation](#7-related-documentation)

---

## 1. Quick Start

### Prerequisites

- Node.js 18+ (recommend 20+)
- npm
- Git
- A Supabase account (for database access)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd ChauffeurTop-Revamp-main
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials (see docs/ENVIRONMENT.md)

# Start dev server
npm run dev
```

### Key URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Main website |
| `http://localhost:3000/admin` | Admin dashboard |
| `http://localhost:3000/booking` | Booking form |
| `http://localhost:3000/blogs` | Blog listing |

---

## 2. Project Structure

```
ChauffeurTop-Revamp-main/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, GTM, metadata)
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles
│   │
│   ├── api/                      # REST API endpoints
│   │   ├── confirm-booking/      # Booking confirmation (GET redirect + POST confirm)
│   │   ├── send-reminder/        # Reminder emails/SMS
│   │   ├── admin-notification/   # Admin alerts
│   │   ├── reviews/              # Google Places reviews
│   │   ├── webhooks/resend/      # Resend webhook handler
│   │   └── marketing/            # Campaign & audience management
│   │
│   ├── admin/                    # Admin dashboard (protected)
│   ├── booking/                  # Booking form page
│   ├── confirm-booking/          # Confirmation pages
│   ├── services/                 # Service landing pages (9 services)
│   ├── blogs/                    # Blog system
│   ├── ads/                      # Ad campaign landing pages
│   ├── about/                    # About page
│   ├── contact/                  # Contact form
│   ├── fleet/                    # Vehicle showcase
│   └── [other pages]             # Privacy, terms, thank-you, login
│
├── components/                   # React components (110+)
│   ├── ui/                       # Base UI (shadcn/ui + Radix)
│   ├── admin/                    # Admin dashboard (50+ components)
│   ├── booking/                  # Booking form components
│   ├── home/                     # Homepage sections
│   ├── landing/                  # Landing page components
│   ├── layout/                   # Navbar, Footer, ConditionalLayout
│   ├── services/                 # Service page components
│   ├── about/                    # About page components
│   ├── blog/                     # Blog components
│   ├── contact/                  # Contact form
│   └── maps/                     # Google Maps autocomplete
│
├── lib/                          # Shared utilities
│   ├── supabase.ts               # Supabase client (public + admin)
│   ├── auth.ts                   # Auth functions
│   ├── admin.ts                  # Admin data operations
│   ├── vehicles.ts               # Vehicle data & pricing
│   ├── constants.ts              # Business config
│   ├── analytics.ts              # GA4 event tracking
│   ├── timezoneUtils.ts          # Melbourne timezone helpers
│   ├── formPrePopulation.ts      # Form data persistence (sessionStorage)
│   ├── filters.ts                # Quote/contact filtering
│   ├── revenue.ts                # Revenue calculations
│   ├── bookings.ts               # Booking utilities
│   ├── contacts.ts               # Contact utilities
│   ├── countries.ts              # Country data (phone formatting)
│   ├── utils.ts                  # cn() helper for Tailwind
│   └── maps/                     # Google Maps helpers
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication state
│   ├── useUTMCapture.ts          # UTM parameter capture
│   └── maps/                     # Maps hooks
│
├── actions/                      # Next.js Server Actions
│   ├── booking.ts                # submitBookingForm()
│   ├── contact.ts                # submitContactForm()
│   └── emailSubscription.ts      # Email subscribe/unsubscribe
│
├── schemas/                      # Zod validation
│   ├── booking.ts                # Booking form schema
│   └── contact.ts                # Contact form schema
│
├── types/                        # TypeScript types
│   ├── booking.ts                # BookingFormData, etc.
│   ├── contact.ts                # ContactFormData
│   ├── admin.ts                  # Quote, Contact, LeadSource
│   └── google-maps.d.ts          # Google Maps type extensions
│
├── utils/                        # Utility functions
│   ├── cityDetection.ts          # City detection from address
│   └── phoneNormalization.ts     # Phone number formatting
│
├── docs/                         # Enterprise documentation suite
│   ├── guides/                   # Implementation guides (by topic)
│   ├── audit/                    # Historical audit trail
│   ├── project/                  # Project deliverables & reports
│   ├── content/                  # Website page copy
│   └── sql/                      # Legacy SQL scripts
│
├── public/                       # Static assets
├── supabase/                     # Edge Functions & migrations
├── middleware.ts                  # Next.js middleware
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 3. Key Concepts

### 3.1 Quote vs Booking

- A **quote** is a customer request (starts as `pending`)
- A quote becomes a **booking** when confirmed (`status: 'confirmed'`)
- Both live in the `quotes` table (not `bookings` table, which is less used)
- Status flow: `pending` -> `contacted` -> `quoted` -> `confirmed` -> `completed`

### 3.2 Server Actions vs API Routes

- **Server Actions** (`src/actions/`): Used for form submissions. Next.js handles CSRF.
- **API Routes** (`src/app/api/`): Used for webhooks, external service callbacks, and operations that need REST semantics.

### 3.3 Supabase Clients

```typescript
import { supabase } from '@/lib/supabase';      // Client-side (uses anon key, respects RLS)
import { supabaseAdmin } from '@/lib/supabase';  // Server-side only (bypasses RLS)
```

**Rule:** Never use `supabaseAdmin` in client components or files that start with `'use client'`.

### 3.4 Authentication

```typescript
// In a client component:
const { user, isAdmin, isEditor, signOut } = useAuth();

// In a server action or API route:
import { getCurrentUser } from '@/lib/auth';
const user = await getCurrentUser();
```

### 3.5 Form Pre-Population

The booking form can be pre-populated from:
- Homepage widget (`saveWidgetData()`)
- Landing pages (`saveLandingPageData()`)
- URL parameters (UTM tracking)

Data is stored in `sessionStorage` with 30-minute expiry.

### 3.6 Timezone Handling

All bookings are in Melbourne time (AEST/AEDT). Use utilities from `lib/timezoneUtils.ts`:

```typescript
import { MELBOURNE_TIMEZONE, toCityISOString } from '@/lib/timezoneUtils';
```

---

## 4. Coding Conventions

### Component Patterns

```typescript
// Client component (interactive, uses hooks)
'use client';
import { useState } from 'react';

export function MyComponent({ prop }: { prop: string }) {
  const [state, setState] = useState('');
  return <div>{prop}</div>;
}

// Server component (default, no 'use client' directive)
export default function MyPage() {
  return <div>Server rendered</div>;
}
```

### Styling

- Use Tailwind CSS utility classes
- Use `cn()` helper for conditional classes:
  ```typescript
  import { cn } from '@/lib/utils';
  <div className={cn('base-class', isActive && 'active-class')} />
  ```
- Brand colors: Gold `#C5A572`, Dark `#1A1F2C`, Card `#2A2F3C`

### Form Validation

```typescript
// Always use Zod schemas (src/schemas/)
import { bookingSchema } from '@/schemas/booking';

const result = bookingSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
}
```

### Error Handling

- Server Actions: Return error objects, don't throw
- API Routes: Return proper HTTP status codes with JSON error bodies
- Client: Use toast notifications (Sonner) for user feedback

### File Naming

- Components: PascalCase (`BookingForm.tsx`)
- Utilities: camelCase (`timezoneUtils.ts`)
- Types: camelCase (`booking.ts`)
- Pages: `page.tsx` (Next.js convention)
- API routes: `route.ts` (Next.js convention)

---

## 5. Common Tasks

### Adding a New Page

1. Create `src/app/your-page/page.tsx`
2. For protected pages, wrap with `ProtectedRoute`
3. Add navigation links in `Navbar.tsx` if needed

### Adding a New API Route

1. Create `src/app/api/your-route/route.ts`
2. Export async functions: `GET`, `POST`, `PUT`, `DELETE`
3. Add authentication checks (see Security Audit for patterns)
4. Document in `docs/API_REFERENCE.md`

### Adding a New Component

1. Create in appropriate `src/components/[section]/` directory
2. Use `'use client'` only if the component needs interactivity
3. Follow existing patterns for props and styling

### Adding a Database Table

1. Create migration via Supabase Dashboard or MCP tools
2. Add RLS policies
3. Update TypeScript types in `src/types/`
4. Update `docs/DATABASE.md`

### Adding an Edge Function

1. Create function directory in `supabase/functions/your-function/`
2. Add `index.ts` with Deno.serve pattern
3. Deploy via Supabase Dashboard or CLI
4. Update `docs/EDGE_FUNCTIONS.md`

---

## 6. Debugging

### Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid Supabase URL" | Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` |
| RLS policy blocks query | Use `supabaseAdmin` for server-side, or check policy conditions |
| Email not sending | Check `RESEND_API_KEY` in both `.env.local` and Supabase secrets |
| Maps autocomplete broken | Check Edge Function `get-maps-api-key` is deployed and has API key secret |
| Admin page blank | Clear browser localStorage, re-login |
| Build errors | Run `npm run build` locally to catch TypeScript errors |

### Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build (catches type errors)
npm run lint         # Run ESLint

# Supabase
supabase functions deploy [name]  # Deploy edge function
supabase db diff                   # See pending schema changes
```

---

## 7. Related Documentation

| Document | When to Read |
|----------|--------------|
| [Architecture](./ARCHITECTURE.md) | Understanding system design |
| [Database](./DATABASE.md) | Working with database tables |
| [API Reference](./API_REFERENCE.md) | Building or consuming APIs |
| [Components](./COMPONENTS.md) | Working with React components |
| [Edge Functions](./EDGE_FUNCTIONS.md) | Working with Supabase functions |
| [Security Audit](./SECURITY_AUDIT.md) | Before deploying changes |
| [Environment](./ENVIRONMENT.md) | Setting up your dev environment |
