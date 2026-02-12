# ChauffeurTop - Premium Luxury Chauffeur Booking Platform

> Australia's premium luxury chauffeur service - online booking, admin management, marketing automation.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)

---

## Overview

ChauffeurTop is a full-stack luxury chauffeur booking platform serving the Australian market. It handles the complete booking lifecycle from quote request through confirmation, with an integrated admin dashboard, marketing automation, blog CMS, and real-time notifications.

### Key Features

- **Booking Engine** - Multi-step quote/booking form with Google Maps autocomplete, vehicle selection, return trip support
- **Admin Dashboard** - Quote management, contact management, revenue analytics, real-time updates
- **Email & SMS** - Transactional emails (Resend), SMS notifications (Twilio), automated follow-ups
- **Marketing** - Email campaigns, audience segmentation, UTM/lead source tracking
- **Blog CMS** - Rich text editor, scheduled publishing, SEO metadata
- **Landing Pages** - Ad campaign pages with exit-intent popups and conversion tracking
- **PWA** - Service worker, web manifest, push notification support

---

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment (see docs/ENVIRONMENT.md)
cp .env.example .env.local

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, Radix UI, Framer Motion |
| Database | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| Email | Resend API |
| SMS | Twilio |
| Maps | Google Maps JavaScript API |
| Analytics | Google Analytics 4, Google Tag Manager |
| Validation | Zod 4 |

---

## Documentation

Complete enterprise documentation is available in the [`/docs`](./docs/) directory:

| Document | Description |
|----------|-------------|
| [Documentation Hub](./docs/README.md) | Start here - index of all documentation |
| [Architecture](./docs/ARCHITECTURE.md) | System design, tech stack, data flow |
| [Database Schema](./docs/DATABASE.md) | Tables, columns, RLS policies, functions, indexes |
| [API Reference](./docs/API_REFERENCE.md) | All REST endpoints and server actions |
| [Component Catalog](./docs/COMPONENTS.md) | 110+ React components documented |
| [Edge Functions](./docs/EDGE_FUNCTIONS.md) | 11 Supabase Edge Functions |
| [Security Audit](./docs/SECURITY_AUDIT.md) | Vulnerability assessment and remediation plan |
| [Environment Setup](./docs/ENVIRONMENT.md) | Environment variables and secrets |
| [Developer Guide](./docs/DEVELOPER_GUIDE.md) | Onboarding guide for new developers |

---

## Project Structure

```
ChauffeurTop-Revamp-main/
├── app/               # Next.js App Router (pages + API routes)
├── components/        # React components (110+)
├── lib/               # Utility libraries
├── hooks/             # Custom React hooks
├── actions/           # Server Actions (form submissions)
├── schemas/           # Zod validation schemas
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── docs/              # Enterprise documentation suite
│   ├── guides/        #   Implementation guides (by topic)
│   ├── audit/         #   Historical audit trail
│   ├── project/       #   Project deliverables & reports
│   ├── content/       #   Website page copy
│   └── sql/           #   Legacy SQL scripts
├── public/            # Static assets
└── supabase/          # Edge Functions & migrations
```

---

## External Services

| Service | Purpose |
|---------|---------|
| [Supabase](https://supabase.com) | Database, Auth, Realtime, Edge Functions, Storage |
| [Resend](https://resend.com) | Transactional & marketing emails |
| [Twilio](https://twilio.com) | SMS notifications |
| [Google Maps](https://developers.google.com/maps) | Address autocomplete |
| [Google Analytics](https://analytics.google.com) | Event tracking |

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## License

Proprietary - All rights reserved.
