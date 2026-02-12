# ChauffeurTop Documentation Hub

> Enterprise documentation for ChauffeurTop - Australia's premium luxury chauffeur booking platform.
>
> **Snapshot Date:** 2026-02-12
> **Version:** 1.0.0
> **Status:** Production

---

## Core Documentation

The primary reference documentation for the platform. Start here.

| Document | Description | Audience |
|----------|-------------|----------|
| [Architecture Overview](./ARCHITECTURE.md) | System design, tech stack, data flow diagrams | Engineers, Architects |
| [Database Schema](./DATABASE.md) | Complete PostgreSQL schema, tables, RLS policies, functions | Backend Engineers, DBAs |
| [API Reference](./API_REFERENCE.md) | All API routes, parameters, responses, authentication | Frontend & Backend Engineers |
| [Component Catalog](./COMPONENTS.md) | Every React component, props, state, dependencies | Frontend Engineers |
| [Edge Functions](./EDGE_FUNCTIONS.md) | Supabase Edge Functions (Deno), email/SMS integrations | Backend Engineers |
| [Security Audit](./SECURITY_AUDIT.md) | Vulnerability assessment, RLS review, remediation plan | Security Engineers, CTO |
| [Environment Setup](./ENVIRONMENT.md) | Environment variables, secrets, deployment config | DevOps, New Developers |
| [Developer Guide](./DEVELOPER_GUIDE.md) | Onboarding, folder structure, conventions, workflows | New Developers |

---

## Additional Documentation

Organized into subdirectories by topic.

### [Implementation Guides](./guides/) `docs/guides/`
Historical guides created during development. Covers how features were built, setup procedures, and solutions to specific issues.

| Subdirectory | Contents |
|-------------|----------|
| [guides/admin/](./guides/admin/) | Admin dashboard deployment, user guide, real-time updates |
| [guides/booking/](./guides/booking/) | Booking form implementation, setup, and quick start |
| [guides/integrations/](./guides/integrations/) | Google Maps, Edge Functions, contact form setup |
| [guides/realtime/](./guides/realtime/) | Supabase Realtime setup, testing, troubleshooting, debugging |
| [guides/landing-pages/](./guides/landing-pages/) | Landing page implementation, CRO, prompt templates |
| [guides/setup/](./guides/setup/) | Quick start, environment setup, testing checklist |
| [guides/fixes/](./guides/fixes/) | Bug fixes and solutions (auto-refresh, blog text color) |

### [Audit Trail](./audit/) `docs/audit/`
Historical audit from January 2026. Tracks changes, preserves pre-change state, and provides rollback procedures.

| Document | Description |
|----------|-------------|
| [Audit Master](./audit/AUDIT_MASTER.md) | Enterprise audit with full tech stack review |
| [Improvements Log](./audit/IMPROVEMENTS_LOG.md) | Timestamped change log |
| [Pre-Changes State](./audit/PRE_CHANGES_STATE.md) | Original file state for rollback |
| [Recommended Changes](./audit/RECOMMENDED_CHANGES.md) | Recommended changes for the team |
| [Rollback Guide](./audit/ROLLBACK_GUIDE.md) | Emergency rollback procedures |

### [Project Documents](./project/) `docs/project/`
Project-level deliverables, reports, and references.

| Document | Description |
|----------|-------------|
| [A/B Testing](./project/AB_TESTING_EXPLAINED.md) | URL-based A/B testing infrastructure |
| [Client Delivery Report](./project/CLIENT_DELIVERY_REPORT.md) | Admin dashboard enhancement delivery |
| [Project Implementation](./project/PROJECT_IMPLEMENTATION.md) | Landing pages and CRO implementation |
| [Quick Reference](./project/QUICK_REFERENCE.md) | Landing page URLs and A/B test variants |

### [Website Content](./content/) `docs/content/`
Source text copy for website pages (homepage, about, services, fleet).

### [Legacy SQL Scripts](./sql/) `docs/sql/`
Original SQL scripts from initial database setup. Current schema is managed via Supabase migrations.

---

## Project Summary

**ChauffeurTop** is a full-stack luxury chauffeur booking platform serving the Australian market (Melbourne-based). The platform handles the complete booking lifecycle from quote request through confirmation, with integrated admin dashboard, marketing automation, blog CMS, and real-time notifications.

### Key Metrics (as of snapshot)

| Metric | Value |
|--------|-------|
| Total Quotes | 501 |
| Total Bookings | 31 |
| Blog Posts | 40 |
| Email Subscribers | 42 |
| Contact Submissions | 8 |
| Auth Users | 4 |
| Edge Functions | 11 |
| Database Migrations | 13 |

### Core Capabilities

- **Booking Engine** - Multi-step quote/booking form with Google Maps autocomplete, vehicle selection, return trip support, airport transfers
- **Admin Dashboard** - Quote management, contact management, revenue analytics, real-time updates, blog CMS
- **Email Automation** - Transactional emails (Resend), SMS notifications (Twilio), booking confirmations, follow-ups, reminders
- **Marketing Platform** - Email campaigns, audience segmentation, UTM tracking, lead source attribution
- **Content Management** - Blog with rich text editor (TipTap), SEO metadata, scheduled publishing
- **Landing Pages** - Ad campaign landing pages with exit-intent popups and conversion tracking
- **PWA Support** - Service worker, web manifest, push notification capability

---

## Tech Stack at a Glance

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.1 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19.2.3 |
| Styling | Tailwind CSS 4, Framer Motion |
| Component Library | Radix UI (shadcn/ui) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| Email | Resend API |
| SMS | Twilio |
| Maps | Google Maps JavaScript API |
| Analytics | Google Analytics 4, Google Tag Manager |
| Rich Text | TipTap Editor |
| Validation | Zod 4 |
| Hosting | Vercel (implied by Next.js) |

---

## Repository Structure

```
ChauffeurTop-Revamp-main/
├── README.md                # Project overview
├── docs/                    # All documentation (you are here)
│   ├── README.md            # This hub
│   ├── ARCHITECTURE.md      # System architecture
│   ├── DATABASE.md          # Database schema reference
│   ├── API_REFERENCE.md     # API routes & server actions
│   ├── COMPONENTS.md        # React component catalog
│   ├── EDGE_FUNCTIONS.md    # Supabase Edge Functions
│   ├── SECURITY_AUDIT.md    # Security audit & findings
│   ├── ENVIRONMENT.md       # Environment variables
│   ├── DEVELOPER_GUIDE.md   # Developer onboarding
│   ├── guides/              # Implementation guides (22 files)
│   │   ├── admin/           # Admin dashboard guides
│   │   ├── booking/         # Booking system guides
│   │   ├── integrations/    # Third-party integration guides
│   │   ├── realtime/        # Supabase Realtime guides
│   │   ├── landing-pages/   # Landing page & CRO guides
│   │   ├── setup/           # Setup & testing guides
│   │   └── fixes/           # Bug fix documentation
│   ├── audit/               # Historical audit trail
│   ├── project/             # Project deliverables & reports
│   ├── content/             # Website page copy & text
│   └── sql/                 # Legacy SQL setup scripts
├── app/                     # Next.js App Router (pages + API routes)
├── components/              # React components (110+)
├── lib/                     # Utility libraries
├── hooks/                   # Custom React hooks
├── actions/                 # Next.js Server Actions
├── schemas/                 # Zod validation schemas
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
├── public/                  # Static assets
├── supabase/                # Edge Functions & migrations
├── middleware.ts            # Next.js middleware
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
└── eslint.config.mjs        # ESLint configuration
```

---

## External Service Dependencies

| Service | Purpose | Credential Location |
|---------|---------|-------------------|
| Supabase | Database, Auth, Realtime, Edge Functions, Storage | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| Resend | Transactional & marketing emails | `RESEND_API_KEY` |
| Twilio | SMS notifications | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` |
| Google Maps | Address autocomplete | Edge Function `get-maps-api-key` |
| Google Analytics | Event tracking | GTM-5QV92NKK (hardcoded) |
| Google Places | Business reviews | `GOOGLE_PLACES_API_KEY` |

---

## Maintaining This Documentation

This documentation suite should be updated whenever:

1. **New tables or columns** are added to the database
2. **New API routes** are created or existing ones change
3. **New components** are added to the component library
4. **Security vulnerabilities** are discovered or fixed
5. **Environment variables** are added or changed
6. **Third-party integrations** are added or modified
7. **Architectural decisions** are made that affect the system design

**Convention:** Each document has a "Last Updated" date at the top. Update this when making changes.
