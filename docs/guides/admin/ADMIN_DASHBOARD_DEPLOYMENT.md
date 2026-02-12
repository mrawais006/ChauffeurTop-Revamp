# 🚀 Admin Dashboard Deployment Guide

Complete deployment guide for the Chauffeur Top Admin Dashboard with reminder functionality.

## 📋 Table of Contents

1. [Database Setup](#database-setup)
2. [Supabase Edge Function Deployment](#supabase-edge-function-deployment)
3. [Environment Variables](#environment-variables)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## 1. Database Setup

### Step 1: Run the Schema Migration

Execute the SQL schema to add all required fields and indexes:

```bash
# Using Supabase CLI
supabase db push

# OR via Supabase Dashboard
# 1. Go to Supabase Dashboard > SQL Editor
# 2. Copy contents from supabase-admin-schema.sql
# 3. Click "Run"
```

### Step 2: Verify Tables

Check that all columns exist:

```sql
-- Check quotes table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'quotes';

-- Check contacts table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contacts';
```

### Step 3: Verify Indexes

```sql
-- List all indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('quotes', 'contacts');
```

---

## 2. Supabase Edge Function Deployment

### Prerequisites

Install Supabase CLI if you haven't:

```bash
npm install -g supabase
```

### Step 1: Login to Supabase

```bash
supabase login
```

### Step 2: Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Find your project ref in Supabase Dashboard > Settings > General > Reference ID

### Step 3: Deploy the Edge Function

```bash
# Deploy the send-reminder function
supabase functions deploy send-reminder
```

### Step 4: Set Secrets

You need to set the RESEND_API_KEY secret:

```bash
# Set Resend API Key
supabase secrets set RESEND_API_KEY=re_YOUR_RESEND_API_KEY
```

### Step 5: Verify Deployment

Test the function:

```bash
# Test via curl
curl -X POST \
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-reminder \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "test-123",
    "customerEmail": "test@example.com",
    "customerName": "John Doe",
    "pickupTime": "2024-01-10 10:00 AM",
    "pickupLocation": "123 Test St, Melbourne",
    "vehicleType": "Mercedes S-Class",
    "customMessage": "Test reminder message"
  }'
```

---

## 3. Environment Variables

### Required Environment Variables

Create or update `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Resend API (for Edge Function)
# Set via: supabase secrets set RESEND_API_KEY=your_key
```

### Get Your Keys

1. **Supabase URL & Keys**: 
   - Dashboard > Settings > API
   - Copy: Project URL, anon/public key, service_role key

2. **Resend API Key**:
   - Sign up at https://resend.com
   - Create API key
   - Set via Supabase secrets (see Step 4 above)

---

## 4. Testing

### Test 1: Database Access

```typescript
// Test in your app
import { fetchQuotes } from '@/lib/admin';

const quotes = await fetchQuotes();
console.log('Quotes count:', quotes.length);
```

### Test 2: Reminder Functionality

1. Log into admin dashboard
2. Navigate to "Upcoming" tab
3. Create a test booking with pickup time in next 24 hours
4. Click "Remind" button
5. Verify:
   - Toast notification appears
   - Email sent (check customer inbox)
   - `reminder_count` incremented in database
   - `last_reminder_sent` timestamp updated

### Test 3: Edge Function Logs

View logs in Supabase Dashboard:

```bash
# Via CLI
supabase functions logs send-reminder

# OR via Dashboard
# Functions > send-reminder > Logs
```

---

## 5. Troubleshooting

### Issue: Edge Function Returns 500 Error

**Possible Causes:**
- Missing RESEND_API_KEY secret
- Invalid Resend API key
- Email quota exceeded

**Solution:**
```bash
# Check secrets
supabase secrets list

# Re-set secret
supabase secrets set RESEND_API_KEY=your_key
```

### Issue: CORS Errors

**Solution:** Edge function already includes CORS headers. If still having issues:

```typescript
// Verify headers in supabase/functions/send-reminder/index.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

### Issue: Database Connection Failed

**Check:**
1. RLS policies allow admin access
2. Supabase service is running
3. Connection string is correct

```sql
-- Temporarily disable RLS for testing (NOT in production)
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
```

### Issue: Reminder Button Not Showing

**Check:**
1. Booking has `status = 'confirmed'`
2. `melbourne_datetime` is within next 24 hours
3. `showReminder={true}` prop passed to QuotesTable

```typescript
// In Upcoming tab
<QuotesTable 
  quotes={upcomingBookings} 
  onQuoteUpdate={loadQuotes}
  showReminder={true} // Must be true
/>
```

### Issue: Toast Notifications Not Appearing

**Check:**
1. Toaster component added to root layout
2. `sonner` package installed

```bash
# Reinstall if needed
npm install sonner
```

---

## 🎯 Production Checklist

Before going live:

- [ ] Database schema applied
- [ ] All indexes created
- [ ] Edge function deployed
- [ ] RESEND_API_KEY secret set
- [ ] Environment variables configured
- [ ] RLS policies configured (if using)
- [ ] Admin authentication working
- [ ] Test reminder email sent successfully
- [ ] Error handling tested
- [ ] Logs reviewed for errors
- [ ] Email delivery tested to various providers (Gmail, Outlook, etc.)

---

## 📊 Monitoring

### Key Metrics to Monitor

1. **Database Performance**
   - Query response times
   - Index usage
   - Table sizes

2. **Edge Function**
   - Invocation count
   - Error rate
   - Response times

3. **Email Delivery**
   - Sent count
   - Bounce rate
   - Open rate (if tracking enabled)

### View Metrics

```bash
# Supabase Dashboard
# Database > Performance
# Functions > send-reminder > Invocations
```

---

## 🔒 Security Best Practices

1. **Never expose service_role key** in client-side code
2. **Use RLS policies** to restrict data access
3. **Validate input** in Edge Functions
4. **Rate limit** reminder sending (prevent spam)
5. **Log all actions** for audit trail
6. **Rotate API keys** regularly

---

## 📞 Support

For issues or questions:
- Supabase Docs: https://supabase.com/docs
- Resend Docs: https://resend.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**🎉 Your admin dashboard is now fully deployed and operational!**

