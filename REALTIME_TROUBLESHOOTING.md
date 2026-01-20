# ⚠️ Real-time Data Not Working - Troubleshooting Guide

## Most Common Issue: Realtime NOT Enabled on Supabase

### ✅ STEP 1: Enable Realtime on Supabase Tables (REQUIRED!)

**Option A - Dashboard (Easiest):**
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **"Database"** in the left sidebar
4. Click **"Replication"** tab at the top
5. Scroll down to find **"quotes"** table
6. Toggle **"Enable Realtime"** to **ON** ✅
7. Scroll to find **"contacts"** table  
8. Toggle **"Enable Realtime"** to **ON** ✅

**Option B - SQL Editor:**
1. Go to SQL Editor in Supabase Dashboard
2. Run this SQL:

```sql
-- Enable Realtime for quotes table
ALTER PUBLICATION supabase_realtime ADD TABLE quotes;

-- Enable Realtime for contacts table
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;

-- Verify it worked (should show both tables)
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename IN ('quotes', 'contacts');
```

---

## ✅ STEP 2: Check Browser Console

1. Open your admin panel
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for these logs:

**✅ GOOD - Working:**
```
[Realtime] Quotes subscription status: SUBSCRIBED
[Realtime] Contacts subscription status: SUBSCRIBED
```

**❌ BAD - Not Working:**
```
[Realtime] Quotes subscription status: CHANNEL_ERROR
[Realtime] Quotes subscription status: TIMED_OUT
```

---

## ✅ STEP 3: Test Real-time Updates

1. Keep admin panel open with browser console (F12) visible
2. Open your website in another tab
3. Submit a quote form
4. Watch the console in admin panel

**You should see:**
```
[Realtime] New quote received: {id: "...", name: "...", ...}
```

**And a toast notification should appear!**

---

## Common Issues & Fixes

### Issue 1: Console shows "CHANNEL_ERROR"
**Fix:** Realtime is not enabled on Supabase tables (see Step 1)

### Issue 2: Console shows "TIMED_OUT"
**Fix:** Check your internet connection or Supabase service status

### Issue 3: No console logs at all
**Fix:** Refresh the admin panel page to establish connection

### Issue 4: Console shows "SUBSCRIBED" but no updates
**Possible causes:**
- RLS (Row Level Security) policies blocking SELECT
- Wrong Supabase URL or API key
- Browser cache issue (try hard refresh: Ctrl+Shift+R)

---

## ✅ STEP 4: Verify RLS Policies

Run this SQL in Supabase SQL Editor:

```sql
-- Check if quotes table has SELECT policy for anon role
SELECT * FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'quotes';

-- If no policies exist or SELECT is blocked, add this:
CREATE POLICY "Allow anon read quotes" ON quotes
FOR SELECT TO anon
USING (true);

-- Same for contacts
CREATE POLICY "Allow anon read contacts" ON contacts
FOR SELECT TO anon
USING (true);
```

---

## ✅ STEP 5: Check Supabase Client

Verify your `.env.local` file has correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**After changing .env file, restart your dev server!**

```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

---

## Quick Test Checklist

- [ ] Realtime enabled on `quotes` table in Supabase
- [ ] Realtime enabled on `contacts` table in Supabase
- [ ] Browser console shows "SUBSCRIBED" status
- [ ] RLS policies allow SELECT for anon role
- [ ] `.env.local` has correct Supabase credentials
- [ ] Dev server restarted after any .env changes
- [ ] Hard refresh admin panel (Ctrl+Shift+R)

---

## Still Not Working?

### Check Supabase Service Status
Visit: https://status.supabase.com/

### Verify with SQL
Run in Supabase SQL Editor to check if Realtime is enabled:

```sql
SELECT 
    schemaname, 
    tablename,
    CASE 
        WHEN tablename IN (
            SELECT tablename 
            FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime'
        ) THEN 'ENABLED ✅'
        ELSE 'DISABLED ❌'
    END as realtime_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('quotes', 'contacts');
```

Expected output:
```
public | quotes   | ENABLED ✅
public | contacts | ENABLED ✅
```

If it shows "DISABLED ❌", run:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE quotes;
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
```

---

## Contact Support

If none of these work, check:
1. Supabase project logs
2. Network tab in browser DevTools
3. Supabase Discord/GitHub for known issues



