# Database Schema Reference

> Last Updated: 2026-02-12
> Database: Supabase PostgreSQL
> Project URL: `https://eixvfhpxaxxdiekonldc.supabase.co`

---

## Table of Contents

1. [Schema Overview](#1-schema-overview)
2. [Core Business Tables](#2-core-business-tables)
3. [CMS Tables](#3-cms-tables)
4. [SEO & Marketing Tables](#4-seo--marketing-tables)
5. [Auth & Profile Tables](#5-auth--profile-tables)
6. [Database Functions](#6-database-functions)
7. [Triggers](#7-triggers)
8. [Row Level Security Policies](#8-row-level-security-policies)
9. [Indexes](#9-indexes)
10. [Storage Buckets](#10-storage-buckets)
11. [Enums](#11-enums)
12. [Migration History](#12-migration-history)
13. [Entity Relationship Diagram](#13-entity-relationship-diagram)

---

## 1. Schema Overview

| Schema | Tables | Purpose |
|--------|--------|---------|
| `public` | 22 | Application business data |
| `auth` | 15+ | Supabase Auth (managed) |
| `storage` | 5+ | Supabase Storage (managed) |

### Public Schema Tables

| Table | Rows | RLS | Purpose |
|-------|------|-----|---------|
| `quotes` | 501 | Yes | Quote/booking requests |
| `bookings` | 31 | Yes | Confirmed bookings |
| `contacts` | 8 | Yes | Contact form submissions |
| `blogs` | 40 | Yes | Blog posts |
| `profiles` | 4 | Yes | User roles & permissions |
| `quote_activities` | 673 | Yes | Audit log for quote actions |
| `lead_sources` | 38 | Yes | Marketing attribution data |
| `email_subscriptions` | 42 | Yes | Newsletter subscribers |
| `email_templates` | 2 | Yes | Email template storage |
| `passengers` | 0 | Yes | Additional passenger details |
| `saved_addresses` | 0 | Yes | User saved addresses |
| `push_subscriptions` | 0 | Yes | PWA push notification endpoints |
| `marketing_audiences` | 0 | Yes | Email audience groups |
| `marketing_campaigns` | 0 | Yes | Email campaigns |
| `pages` | 0 | Yes | CMS pages |
| `seo_metadata` | 0 | Yes | SEO meta tags |
| `categories` | 0 | Yes | Blog/page categories |
| `media` | 0 | Yes | Media library |
| `page_templates` | 0 | Yes | CMS page templates |
| `site_structure` | 0 | Yes | Site hierarchy/navigation |
| `keyword_strategy` | 0 | Yes | SEO keyword tracking |
| `content_components` | 0 | Yes | Reusable content blocks |
| `url_redirects` | 0 | Yes | URL redirect rules |
| `competitor_analysis` | 0 | Yes | SEO competitor data |
| `internal_links` | 0 | Yes | Internal linking strategy |

---

## 2. Core Business Tables

### `quotes`
The primary business table. Stores all quote requests and their lifecycle.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `created_at` | timestamptz | Yes | `now()` | Record creation time |
| `name` | text | No | - | Customer full name |
| `email` | text | Yes | - | Customer email |
| `phone` | text | No | - | Customer phone number |
| `vehicle_type` | text | No | - | Vehicle category code |
| `vehicle_name` | text | Yes | - | Vehicle display name |
| `vehicle_model` | text | Yes | - | Vehicle model details |
| `passengers` | integer | No | - | Number of passengers |
| `pickup_location` | text | No | - | Pickup address |
| `dropoff_location` | text | Yes | - | Drop-off address |
| `destinations` | jsonb | No | - | Destination(s) or return trip structure |
| `date` | date | No | - | Trip date |
| `time` | time | No | - | Trip time |
| `status` | lead_status | Yes | `'pending'` | Quote lifecycle status |
| `notes` | text | Yes | - | Customer notes |
| `admin_comments` | text | Yes | - | Internal admin notes |
| `service_type` | text | Yes | - | Service category |
| `flight_number` | text | Yes | - | Flight number (airport transfers) |
| `terminal_type` | text | Yes | - | Domestic/International terminal |
| `driver_instructions` | text | Yes | - | Special driver instructions |
| `melbourne_datetime` | text | Yes | - | Full datetime in Melbourne timezone |
| `timezone` | text | Yes | - | Booking timezone |
| `user_timezone` | text | Yes | - | User's browser timezone |
| `city` | varchar | Yes | `'melbourne'` | Service city |
| `quoted_price` | numeric | Yes | - | Price quoted to customer |
| `price_breakdown` | jsonb | Yes | - | Detailed pricing breakdown |
| `quote_sent_at` | timestamptz | Yes | - | When quote was emailed |
| `quote_accepted_at` | timestamptz | Yes | - | When customer confirmed |
| `last_follow_up_at` | timestamptz | Yes | - | Last follow-up attempt |
| `follow_up_count` | integer | Yes | `0` | Number of follow-ups sent |
| `confirmation_token` | text | Yes | - | Unique token for email confirmation |
| `reminder_count` | integer | Yes | `0` | Reminders sent |
| `last_reminder_at` | timestamptz | Yes | - | Last reminder timestamp |
| `admin_reminder_sent` | boolean | Yes | `false` | Whether admin was reminded |
| `related_booking_id` | uuid | Yes | - | Linked booking (return trips) |
| `trip_leg` | text | Yes | `'one-way'` | `outbound`, `return`, or `one-way` |
| `needs_child_seats` | boolean | Yes | `false` | Child seat requirement |
| `child_seat_details` | text | Yes | - | Child seat specifications |

**Check Constraints:**
- `trip_leg IN ('outbound', 'return', 'one-way')`

**Foreign Keys:**
- `lead_sources.quote_id` -> `quotes.id`

---

### `bookings`
Confirmed bookings (mirrors quotes structure).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `created_at` | timestamptz | Yes | `now()` | Record creation time |
| `name` | text | No | - | Customer name |
| `email` | text | Yes | - | Customer email |
| `phone` | text | No | - | Customer phone |
| `vehicle_type` | text | No | - | Vehicle category |
| `passengers` | integer | No | - | Passenger count |
| `pickup_location` | text | No | - | Pickup address |
| `destinations` | jsonb | No | - | Destination data |
| `date` | date | No | - | Trip date |
| `time` | time | No | - | Trip time |
| `status` | lead_status | Yes | `'pending'` | Booking status |
| `notes` | text | Yes | - | Customer notes |
| `admin_comments` | text | Yes | - | Admin notes |
| `payment_status` | text | Yes | - | Payment tracking |
| `payment_amount` | numeric | Yes | - | Payment amount |
| `service_type` | text | Yes | - | Service type |
| `flight_number` | text | Yes | - | Flight number |
| `terminal_type` | text | Yes | - | Terminal type |
| `driver_instructions` | text | Yes | - | Driver instructions |
| `vehicle_name` | text | Yes | - | Vehicle name |
| `vehicle_model` | text | Yes | - | Vehicle model |
| `melbourne_datetime` | text | Yes | - | Melbourne timezone datetime |
| `timezone` | text | Yes | - | Timezone |
| `user_timezone` | text | Yes | - | User timezone |
| `city` | varchar | Yes | `'melbourne'` | City |
| `quoted_price` | numeric | Yes | - | Quoted price |
| `price_breakdown` | jsonb | Yes | - | Price breakdown |
| `quote_sent_at` | timestamptz | Yes | - | Quote sent time |
| `quote_accepted_at` | timestamptz | Yes | - | Acceptance time |
| `last_follow_up_at` | timestamptz | Yes | - | Last follow-up |
| `follow_up_count` | integer | Yes | `0` | Follow-up count |
| `confirmation_token` | text | Yes | - | Confirmation token |

**Foreign Keys:**
- `passengers.booking_id` -> `bookings.id`

---

### `contacts`
Contact form submissions.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `created_at` | timestamptz | Yes | `now()` | Submission time |
| `name` | text | No | - | Contact name |
| `email` | text | No | - | Contact email (validated) |
| `phone` | text | Yes | - | Contact phone |
| `subject` | text | No | - | Message subject |
| `message` | text | No | - | Message body |
| `status` | contact_status | Yes | `'pending'` | Processing status |
| `admin_comments` | text | Yes | - | Admin notes |
| `city` | varchar | Yes | `'melbourne'` | City |

**Check Constraints:**
- `email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'`

---

### `quote_activities`
Audit trail for all actions taken on quotes/bookings.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `quote_id` | uuid | Yes | - | Related quote |
| `booking_id` | uuid | Yes | - | Related booking |
| `action_type` | text | No | - | Action performed |
| `details` | jsonb | Yes | - | Action metadata |
| `created_at` | timestamptz | Yes | `now()` | Action timestamp |
| `created_by` | text | Yes | - | Who performed action |

**Check Constraints - action_type:**
- `quote_sent`, `reminder_sent`, `discount_sent`, `personal_email_sent`
- `customer_called`, `marked_lost`, `customer_confirmed`, `customer_viewed_link`

---

### `lead_sources`
Marketing attribution for quote submissions.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `quote_id` | uuid | Yes | - | Related quote |
| `source` | varchar | Yes | - | Traffic source |
| `page_url` | text | Yes | - | Page URL at submission |
| `utm_source` | varchar | Yes | - | UTM source parameter |
| `utm_medium` | varchar | Yes | - | UTM medium parameter |
| `utm_campaign` | varchar | Yes | - | UTM campaign parameter |
| `utm_content` | varchar | Yes | - | UTM content parameter |
| `utm_term` | varchar | Yes | - | UTM term parameter |
| `gclid` | varchar | Yes | - | Google Ads click ID |
| `referrer` | text | Yes | - | HTTP referrer |
| `user_agent` | text | Yes | - | Browser user agent |
| `created_at` | timestamptz | Yes | `now()` | Record time |

---

### `passengers`
Additional passengers linked to bookings.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `booking_id` | uuid | Yes | - | Parent booking |
| `name` | text | No | - | Passenger name |
| `email` | text | Yes | - | Passenger email |
| `phone` | text | Yes | - | Passenger phone |
| `created_at` | timestamptz | Yes | `now()` | Record time |

---

### `email_subscriptions`
Newsletter and marketing email subscribers.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `email` | text | No (unique) | - | Subscriber email |
| `source` | text | Yes | `'exit_popup'` | Subscription source |
| `discount_code` | text | Yes | - | Offered discount |
| `subscribed_at` | timestamptz | Yes | `now()` | Subscribe time |
| `unsubscribed_at` | timestamptz | Yes | - | Unsubscribe time |
| `is_active` | boolean | Yes | `true` | Active status |
| `metadata` | jsonb | Yes | `'{}'` | Additional data |

---

### `email_templates`
Stored email templates.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `created_at` | timestamptz | Yes | `now()` | Creation time |
| `type` | email_type | No | - | Template category |
| `subject` | text | No | - | Email subject line |
| `html_template` | text | No | - | HTML content |
| `is_active` | boolean | Yes | `true` | Active status |

---

## 3. CMS Tables

### `blogs`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `title` | text | No | - | Blog title |
| `slug` | text | No (unique) | - | URL slug |
| `excerpt` | text | Yes | - | Short description |
| `content` | text | Yes | - | Full HTML content |
| `featured_image` | text | Yes | - | Image URL |
| `status` | text | No | - | `published`, `draft`, `scheduled` |
| `published_at` | timestamptz | Yes | - | Publish date |
| `author_id` | uuid | Yes | - | FK to auth.users |
| `created_at` | timestamptz | Yes | `now()` | Creation time |
| `updated_at` | timestamptz | Yes | `now()` | Last update |
| `categories` | text[] | Yes | `'{}'` | Category tags |
| `tags` | text[] | Yes | `'{}'` | Tags |
| `visibility` | text | Yes | `'public'` | Visibility setting |
| `views` | integer | Yes | `0` | View count |

### `pages`, `seo_metadata`, `categories`, `media`, `page_templates`, `site_structure`

These CMS tables exist but are currently empty (0 rows). They provide a full CMS infrastructure for:
- Dynamic page management
- SEO metadata per page
- Hierarchical site structure
- Media library
- Page templating system

---

## 4. SEO & Marketing Tables

### `marketing_audiences`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `name` | text | No | - | Audience name |
| `resend_audience_id` | text | Yes | - | Synced Resend audience ID |
| `description` | text | Yes | - | Description |
| `filter_criteria` | jsonb | Yes | - | Segment query criteria |
| `contact_count` | integer | Yes | `0` | Calculated contact count |
| `created_at` | timestamptz | Yes | `now()` | Creation time |
| `updated_at` | timestamptz | Yes | `now()` | Last update |

### `marketing_campaigns`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `audience_id` | uuid | Yes | - | FK to marketing_audiences |
| `subject` | text | No | - | Email subject |
| `template_type` | text | No | - | Template identifier |
| `html_content` | text | Yes | - | Full HTML email |
| `resend_broadcast_id` | text | Yes | - | Resend broadcast ID |
| `status` | text | Yes | `'draft'` | `draft`, `scheduled`, `sending`, `sent`, `failed` |
| `sent_count` | integer | Yes | `0` | Emails sent |
| `open_count` | integer | Yes | `0` | Opens tracked |
| `click_count` | integer | Yes | `0` | Clicks tracked |
| `scheduled_at` | timestamptz | Yes | - | Scheduled send time |
| `sent_at` | timestamptz | Yes | - | Actual send time |
| `created_at` | timestamptz | Yes | `now()` | Creation time |

### Additional SEO Tables (empty, infrastructure ready)

- `keyword_strategy` - Keyword tracking with difficulty, volume, competition
- `competitor_analysis` - Competitor position tracking
- `url_redirects` - 301/302 redirect management
- `internal_links` - Internal linking strategy
- `content_components` - Reusable content blocks

---

## 5. Auth & Profile Tables

### `profiles`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | - | FK to auth.users.id |
| `email` | text | Yes | - | User email |
| `role` | text | Yes | `'editor'` | User role |
| `created_at` | timestamptz | No | `now()` | Creation time |

### `saved_addresses`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | No | - | FK to auth.users.id |
| `name` | text | No | - | Address label |
| `address` | text | No | - | Full address |
| `lat` | float8 | No | - | Latitude |
| `lng` | float8 | No | - | Longitude |
| `is_favorite` | boolean | Yes | `false` | Favorite flag |
| `created_at` | timestamptz | Yes | `now()` | Creation time |

---

## 6. Database Functions

### `handle_new_user()`
- **Type:** Trigger function (SECURITY DEFINER)
- **Purpose:** Automatically creates a profile entry when a new user signs up
- **Action:** Inserts into `profiles` with role `'editor'`
- **Triggered by:** New user creation in `auth.users`

### `increment_blog_view(blog_id uuid)`
- **Type:** Regular function (SECURITY DEFINER)
- **Purpose:** Atomically increments blog post view count
- **Returns:** void

### `publish_due_posts()`
- **Type:** Regular function (SECURITY DEFINER)
- **Purpose:** Publishes scheduled blog posts when their `published_at` time has passed
- **Action:** Updates `blogs.status` from `'scheduled'` to `'published'`

### `validate_booking_time()`
- **Type:** Trigger function
- **Purpose:** Ensures bookings are at least 2 hours in the future
- **Validation:** Compares `melbourne_datetime` against `NOW() + 2 hours`
- **Skips:** If `melbourne_datetime` is null or empty

---

## 7. Triggers

| Trigger | Table | Event | Timing | Function |
|---------|-------|-------|--------|----------|
| `validate_booking_time` | `bookings` | INSERT | BEFORE | `validate_booking_time()` |
| `validate_quote_time` | `quotes` | INSERT | BEFORE | `validate_booking_time()` |

---

## 8. Row Level Security Policies

### Summary by Table

| Table | RLS | Policies | Status |
|-------|-----|----------|--------|
| `quotes` | Enabled | 2 policies | Anon insert, Auth all |
| `bookings` | Enabled | 2 policies | Anon insert, Auth all |
| `contacts` | Enabled | 3 policies | Anon insert, Auth all + update |
| `blogs` | Enabled | 2 policies | Public view published, Auth manage |
| `profiles` | Enabled | 3 policies | Public view, Owner insert/update |
| `email_templates` | Enabled | 4 policies | Auth CRUD |
| `email_subscriptions` | Enabled | 3 policies | Public insert, Auth read/update |
| `lead_sources` | Enabled | 3 policies | Anon/Auth insert, Auth select |
| `quote_activities` | Enabled | 1 policy | Auth all |
| `passengers` | Enabled | 2 policies | Anon insert, Auth all |
| `push_subscriptions` | Enabled | 2 policies | Anon insert, Auth all |
| `saved_addresses` | Enabled | 1 policy | Owner-based (auth.uid = user_id) |
| `marketing_audiences` | Enabled | 1 policy | Auth all |
| `marketing_campaigns` | Enabled | 1 policy | Auth all |
| `pages` | Enabled | **0 policies** | **NEEDS ATTENTION** |
| `seo_metadata` | Enabled | **0 policies** | **NEEDS ATTENTION** |
| `categories` | Enabled | **0 policies** | **NEEDS ATTENTION** |
| `media` | Enabled | **0 policies** | **NEEDS ATTENTION** |
| `page_templates` | Enabled | **0 policies** | **NEEDS ATTENTION** |
| `site_structure` | Enabled | **0 policies** | **NEEDS ATTENTION** |
| `keyword_strategy` | Enabled | **0 policies** | **NEEDS ATTENTION** |
| `content_components` | Enabled | **0 policies** | **NEEDS ATTENTION** |
| `url_redirects` | Enabled | **0 policies** | **NEEDS ATTENTION** |
| `competitor_analysis` | Enabled | **0 policies** | **NEEDS ATTENTION** |
| `internal_links` | Enabled | **0 policies** | **NEEDS ATTENTION** |

### Detailed Policies

#### quotes
```sql
-- Anon users can submit quotes
CREATE POLICY "Allow anonymous inserts on quotes"
  ON quotes FOR INSERT TO anon
  WITH CHECK (true);

-- Authenticated users have full access
CREATE POLICY "Allow all operations for authenticated users on quotes"
  ON quotes FOR ALL TO authenticated
  USING (true);
```

#### blogs
```sql
-- Public can view published blogs
CREATE POLICY "Public can view published blogs"
  ON blogs FOR SELECT TO public
  USING (status = 'published' AND published_at <= now());

-- Authenticated/service_role can manage all blogs
CREATE POLICY "Admins can manage all blogs"
  ON blogs FOR ALL TO public
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
```

#### profiles
```sql
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT TO public USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT TO public WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE TO public USING (auth.uid() = id);
```

#### saved_addresses
```sql
CREATE POLICY "Users can manage their own addresses"
  ON saved_addresses FOR ALL TO authenticated
  USING (auth.uid() = user_id);
```

---

## 9. Indexes

| Table | Index | Type | Columns |
|-------|-------|------|---------|
| `quotes` | `quotes_pkey` | UNIQUE | `id` |
| `quotes` | `idx_quotes_city` | btree | `city` |
| `quotes` | `idx_quotes_related_booking_id` | btree | `related_booking_id` |
| `bookings` | `bookings_pkey` | UNIQUE | `id` |
| `bookings` | `idx_bookings_city` | btree | `city` |
| `blogs` | `blogs_pkey` | UNIQUE | `id` |
| `blogs` | `blogs_slug_key` | UNIQUE | `slug` |
| `contacts` | `contacts_pkey` | UNIQUE | `id` |
| `contacts` | `idx_contacts_city` | btree | `city` |
| `lead_sources` | `idx_lead_sources_quote_id` | btree | `quote_id` |
| `lead_sources` | `idx_lead_sources_source` | btree | `source` |
| `lead_sources` | `idx_lead_sources_created_at` | btree | `created_at` |
| `quote_activities` | `idx_quote_activities_quote_id` | btree | `quote_id` |
| `quote_activities` | `idx_quote_activities_booking_id` | btree | `booking_id` |
| `quote_activities` | `idx_quote_activities_created_at` | btree | `created_at DESC` |
| `email_subscriptions` | `email_subscriptions_email_key` | UNIQUE | `email` |
| `email_subscriptions` | `idx_email_subscriptions_active` | btree | `is_active` |
| `marketing_campaigns` | `idx_marketing_campaigns_status` | btree | `status` |
| `marketing_campaigns` | `idx_marketing_campaigns_audience_id` | btree | `audience_id` |
| `marketing_campaigns` | `idx_marketing_campaigns_created_at` | btree | `created_at DESC` |
| `pages` | `pages_slug_key` | UNIQUE | `slug` |
| `pages` | `idx_pages_slug` | btree | `slug` |
| `pages` | `idx_pages_status` | btree | `status` |
| `pages` | `idx_pages_template` | btree | `template` |

---

## 10. Storage Buckets

| Bucket ID | Name | Purpose |
|-----------|------|---------|
| `public_assets` | public_assets | Website images, fleet photos |
| `blog_images` | blog_images | Blog post images |

---

## 11. Enums

### `lead_status`
```sql
'pending' | 'contacted' | 'confirmed' | 'completed' | 'cancelled' | 'quoted'
```

### `contact_status`
```sql
'pending' | 'contacted' | 'resolved' | 'spam'
```

### `email_type`
```sql
'booking' | 'quote' | 'contact'
```

---

## 12. Migration History

| Version | Name | Description |
|---------|------|-------------|
| 20250604043733 | `create_enterprise_cms_tables` | Initial CMS schema (pages, media, SEO, etc.) |
| 20250604043845 | `add_unique_constraint_page_templates` | Unique constraint on template names |
| 20250604050526 | `fix_field_lengths` | Field length adjustments |
| 20250724014748 | `add_city_column_to_tables` | Added city column for multi-city support |
| 20251207115641 | `add_quote_pricing_fields` | Added quoted_price, price_breakdown fields |
| 20251207132216 | `add_quote_activities_tracking_v2` | Quote activity audit trail |
| 20260110144644 | `add_dropoff_location_to_quotes` | Added dropoff_location column |
| 20260110152454 | `add_trip_leg_and_related_booking` | Return trip support |
| 20260121033728 | `add_lead_sources` | Marketing attribution table |
| 20260121173114 | `create_email_subscriptions` | Email subscriber management |
| 20260121202941 | `create_push_subscriptions_table` | PWA push notifications |
| 20260121212251 | `add_child_seat_fields_to_quotes` | Child seat booking support |
| 20260209105534 | `create_marketing_tables` | Marketing audiences & campaigns |

---

## 13. Entity Relationship Diagram

```
auth.users (4 rows)
    │
    ├── 1:1 ── profiles (role, email)
    ├── 1:N ── blogs (author_id)
    └── 1:N ── saved_addresses (user_id)

quotes (501 rows)
    │
    ├── 1:N ── lead_sources (quote_id)
    ├── 1:N ── quote_activities (quote_id)
    └── self ── related_booking_id (return trip linking)

bookings (31 rows)
    │
    └── 1:N ── passengers (booking_id)

contacts (8 rows)               [standalone]
email_subscriptions (42 rows)   [standalone]
email_templates (2 rows)        [standalone]
push_subscriptions (0 rows)     [standalone]

marketing_audiences (0 rows)
    │
    └── 1:N ── marketing_campaigns (audience_id)

pages (0 rows)
    │
    ├── N:1 ── seo_metadata (seo_metadata_id)
    ├── N:1 ── media (featured_image_id)
    ├── self ── parent_page_id (hierarchy)
    ├── 1:N ── site_structure (page_id)
    └── 1:N ── keyword_strategy (target_page_id)
```
