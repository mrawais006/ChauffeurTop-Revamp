# Legacy SQL Scripts

> Original SQL scripts used during initial database setup. These are preserved for reference. The active database schema is managed through Supabase migrations (see `supabase/migrations/`).

---

| Script | Description |
|--------|-------------|
| [supabase-setup.sql](./supabase-setup.sql) | Initial Supabase project setup (tables, RLS, policies) |
| [supabase-admin-schema.sql](./supabase-admin-schema.sql) | Admin dashboard schema (profiles, roles) |
| [supabase-booking-setup.sql](./supabase-booking-setup.sql) | Booking/quotes table setup |
| [supabase-contacts-migration.sql](./supabase-contacts-migration.sql) | Contacts table migration |

---

> **Note:** For the current database schema reference, see [DATABASE.md](../DATABASE.md). For active migrations, see `supabase/migrations/`.
