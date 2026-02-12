# Security Audit Report

> **Audit Date:** 2026-02-12
> **Auditor:** Automated (Claude Code + Supabase Advisors)
> **Scope:** Full stack - database, API routes, frontend, infrastructure
> **Overall Risk Level:** MEDIUM-HIGH (requires remediation)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Critical Findings](#2-critical-findings)
3. [High Priority Findings](#3-high-priority-findings)
4. [Medium Priority Findings](#4-medium-priority-findings)
5. [Low Priority / Informational](#5-low-priority--informational)
6. [What's Done Well](#6-whats-done-well)
7. [Remediation Roadmap](#7-remediation-roadmap)

---

## 1. Executive Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 2 | Open |
| HIGH | 5 | Open |
| MEDIUM | 8 | Open |
| LOW/INFO | 11 | Open |

### Top 3 Risks

1. **API routes have no authentication** - Marketing, admin-notification, and reminder APIs are publicly accessible
2. **Webhook signature verification missing** - Resend webhook can be spoofed
3. **11 tables have RLS enabled but zero policies** - Data is inaccessible (locked down) but unmanageable without service_role

---

## 2. Critical Findings

### CRIT-01: No Webhook Signature Verification on `/api/webhooks/resend`

**Risk:** Any external actor can send fake webhook events, manipulating campaign open/click metrics and potentially triggering business logic based on falsified data.

**Location:** `src/app/api/webhooks/resend/route.ts`

**Current State:** Endpoint accepts any POST request and processes it as legitimate Resend webhook data.

**Remediation:**
- Implement Resend webhook signature verification using `svix` library
- Verify the `svix-id`, `svix-timestamp`, and `svix-signature` headers
- Return 401 for invalid signatures

**Priority:** Fix immediately

---

### CRIT-02: API Routes Lack Authentication

**Risk:** All API routes (`/api/admin-notification`, `/api/send-reminder`, `/api/marketing/*`) are publicly accessible. An attacker could:
- Send unlimited emails/SMS using your Resend/Twilio accounts
- Access customer PII (names, emails, phones, pricing)
- Manipulate marketing campaigns and audiences
- Trigger reminder emails to customers

**Affected Routes:**
| Route | Risk |
|-------|------|
| `POST /api/admin-notification` | Spam admin with fake notifications |
| `POST /api/send-reminder` | Send arbitrary emails/SMS |
| `GET/POST/PUT/DELETE /api/marketing/audiences` | Full audience manipulation |
| `GET/POST/PUT /api/marketing/campaigns` | Create and send campaigns |
| `GET/POST /api/marketing/segments` | Access customer PII |

**Remediation:**
- Add Supabase Auth session validation to all admin/marketing API routes
- Use `supabase.auth.getUser()` from the request headers
- Verify the user has `admin` role from profiles table
- Return 401/403 for unauthorized requests

**Priority:** Fix immediately

---

## 3. High Priority Findings

### HIGH-01: Overly Permissive RLS Policies (USING true / WITH CHECK true)

**Risk:** Multiple tables use `USING (true)` for authenticated users, meaning any authenticated user (even with `editor` role) can read/write/delete ALL records. With only 4 auth users this is manageable but won't scale.

**Affected Tables (19 overly permissive policies):**
- `quotes` - Auth: ALL with USING(true)
- `bookings` - Auth: ALL with USING(true)
- `contacts` - Auth: ALL with USING(true)
- `email_templates` - Auth: full CRUD with true
- `email_subscriptions` - Auth: UPDATE with USING(true)
- `passengers` - Auth: ALL with USING(true)
- `push_subscriptions` - Auth: ALL with USING(true)
- `quote_activities` - Auth: ALL with USING(true)
- `marketing_audiences` - Auth: ALL with USING(true)
- `marketing_campaigns` - Auth: ALL with USING(true)

**Remediation:**
- Replace `USING (true)` with role-based checks: `USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')`
- Or use `USING ((SELECT auth.uid()) IS NOT NULL)` as minimum

---

### HIGH-02: 11 Tables with RLS Enabled but No Policies

**Risk:** These tables are completely locked - no one can read or write to them except via service_role key. This is safe but means they're unusable from the client.

**Tables:** `categories`, `competitor_analysis`, `content_components`, `internal_links`, `keyword_strategy`, `media`, `page_templates`, `pages`, `seo_metadata`, `site_structure`, `url_redirects`

**Remediation:** Add appropriate RLS policies before using these tables from the frontend.

---

### HIGH-03: Mutable search_path on Database Functions

**Risk:** Functions `publish_due_posts`, `increment_blog_view`, `handle_new_user`, and `validate_booking_time` have mutable search paths, which could be exploited if a malicious user creates objects in the public schema.

**Remediation:**
```sql
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.increment_blog_view(uuid) SET search_path = public;
ALTER FUNCTION public.publish_due_posts() SET search_path = public;
ALTER FUNCTION public.validate_booking_time() SET search_path = public;
```

---

### HIGH-04: OTP Expiry Too Long

**Risk:** Supabase Auth OTP expiry exceeds 1 hour, increasing the window for interception.

**Remediation:** Reduce OTP expiry to 30 minutes or less in Supabase Dashboard > Auth > Settings.

---

### HIGH-05: Leaked Password Protection Disabled

**Risk:** Users can set passwords that have been exposed in known data breaches.

**Remediation:** Enable "Leaked Password Protection" in Supabase Dashboard > Auth > Settings. This checks passwords against HaveIBeenPwned.org.

---

## 4. Medium Priority Findings

### MED-01: No Rate Limiting on Any Endpoint

**Risk:** All API routes are vulnerable to abuse (DDoS, email/SMS flooding).

**Remediation:** Implement rate limiting via Vercel's built-in rate limiting or middleware-based solution.

---

### MED-02: Confirmation Tokens Don't Expire

**Risk:** Booking confirmation tokens (`confirmation_token`) have no expiration, meaning old links remain valid indefinitely.

**Remediation:** Add `confirmation_token_expires_at` column and validate during confirmation.

---

### MED-03: XSS Risk in Email Templates

**Risk:** Customer-provided data (name, addresses) is directly embedded in HTML email templates without sanitization.

**Remediation:** HTML-encode all user data before inserting into email templates.

---

### MED-04: pg_net Extension in Public Schema

**Risk:** The `pg_net` extension is installed in the public schema instead of a dedicated schema.

**Remediation:** Move to a dedicated schema: `ALTER EXTENSION pg_net SET SCHEMA extensions;`

---

### MED-05: RLS Policy Performance Issues

**Risk:** Several RLS policies call `auth.uid()` or `auth.role()` without wrapping in `(SELECT ...)`, causing re-evaluation per row.

**Affected Tables:** `saved_addresses`, `blogs`, `profiles`

**Remediation:** Replace `auth.uid()` with `(SELECT auth.uid())` in policy definitions.

---

### MED-06: Multiple Permissive Policies on Same Table

**Risk:** `blogs` and `contacts` tables have multiple permissive policies for the same role/action, causing unnecessary query overhead.

**Remediation:** Consolidate overlapping policies into single policies per role/action.

---

### MED-07: PostgreSQL Version Needs Security Patches

**Risk:** Current Postgres version (15.6.1.145) has outstanding security patches.

**Remediation:** Upgrade via Supabase Dashboard > Settings > Infrastructure. See: https://supabase.com/docs/guides/platform/upgrading

---

### MED-08: No CORS Configuration on API Routes

**Risk:** API routes don't explicitly configure CORS, relying on default behavior.

**Remediation:** Add explicit CORS headers to API routes, restricting to allowed origins.

---

## 5. Low Priority / Informational

### INFO-01: 8 Unindexed Foreign Keys
Tables `blogs`, `keyword_strategy`, `pages` (3), `passengers`, `saved_addresses`, `site_structure` have foreign keys without covering indexes.

### INFO-02: 28 Unused Indexes
Multiple indexes exist but have never been used. Consider removing to reduce storage overhead.

### INFO-03: Environment Variables Contain Secrets
Standard practice but ensure `.env.local` is in `.gitignore` (it is).

### INFO-04: Mock Data in Reviews API
`/api/reviews` returns `{ mock: true }` when API keys aren't configured, which could mislead if served in production.

### INFO-05: No Input Validation on Marketing API Bodies
Audience names and filter criteria aren't validated/sanitized.

### INFO-06: Fire-and-Forget Patterns
Several API routes call external services (Resend, Twilio) without awaiting results, which can lead to silent failures.

---

## 6. What's Done Well

| Area | Implementation |
|------|---------------|
| **Security Headers** | HSTS, CSP, X-Frame-Options, X-XSS-Protection all configured in middleware |
| **RLS Enabled** | All 22+ public tables have RLS enabled |
| **Form Validation** | Zod schemas on all user-facing forms |
| **Email Pattern** | GET redirect + POST confirmation prevents email scanner auto-confirmation |
| **Password Storage** | Handled by Supabase Auth (bcrypt) |
| **Service Role Separation** | Client uses anon key, server uses service_role |
| **JWT Auth** | Supabase Auth with proper session management |
| **CSRF Protection** | Next.js Server Actions have built-in CSRF protection |
| **Contact Email Validation** | Database-level regex check on contacts.email |
| **Booking Time Validation** | Database trigger enforces 2-hour minimum advance booking |

---

## 7. Remediation Roadmap

### Phase 1: Critical (Do This Week)
- [ ] Add authentication to all `/api/marketing/*` routes
- [ ] Add authentication to `/api/admin-notification` and `/api/send-reminder`
- [ ] Implement Resend webhook signature verification
- [ ] Enable leaked password protection in Supabase

### Phase 2: High (Do This Month)
- [ ] Fix mutable search_path on all 4 database functions
- [ ] Reduce OTP expiry to 30 minutes
- [ ] Add RLS policies to the 11 unpolicied tables
- [ ] Review and tighten overly permissive RLS policies

### Phase 3: Medium (Next Quarter)
- [ ] Implement rate limiting on all API routes
- [ ] Add confirmation token expiration
- [ ] Sanitize user data in email templates
- [ ] Fix RLS policy performance (use SELECT wrapper)
- [ ] Consolidate duplicate RLS policies
- [ ] Upgrade PostgreSQL version
- [ ] Add explicit CORS configuration
- [ ] Move pg_net extension to dedicated schema

### Phase 4: Maintenance (Ongoing)
- [ ] Regular dependency updates (npm audit)
- [ ] Review and remove unused indexes
- [ ] Add indexes for unindexed foreign keys
- [ ] Monitor Supabase security advisors regularly
