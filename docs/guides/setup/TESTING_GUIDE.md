# Booking Confirmation System - Quick Test Guide

## Quick Testing Checklist

Use this checklist to quickly verify the booking confirmation system is working correctly.

### ✅ Pre-Deployment Tests (Local)

#### 1. Check Files Exist
```bash
# API Route
ls app/api/confirm-booking/route.ts

# Pages
ls app/confirm-booking/[token]/page.tsx
ls app/confirm-booking/error/page.tsx

# Edge Functions
ls supabase/functions/send-quote-response/index.ts
ls supabase/functions/send-follow-up/index.ts
ls supabase/functions/send-confirmation-email/index.ts
```

#### 2. Verify Environment Variables
```bash
# Check .env.local exists and has required variables
cat .env.local | grep SUPABASE
cat .env.local | grep SITE_URL
```

### ✅ Post-Deployment Tests

#### Test 1: Quote Confirmation Flow (5 minutes)

**Steps**:
1. Open admin panel: `http://localhost:3000/admin`
2. Find a quote with status "new" or "contacted"
3. Click on the quote to open details
4. Click "Send Quote" button
5. Fill in pricing (e.g., Base Fare: $150)
6. Click "Send Quote"

**Expected Results**:
- ✅ Toast shows "Quote sent successfully!"
- ✅ Quote status changes to "contacted"
- ✅ `quoted_price` field populated
- ✅ `confirmation_token` generated (check in database)
- ✅ Email received (check inbox or Resend dashboard)

**Check Email**:
- ✅ Subject: "Your ChauffeurTop Quote - $150.00"
- ✅ Contains trip details
- ✅ Shows price breakdown
- ✅ Has "Confirm Booking" button
- ✅ Button links to: `/api/confirm-booking?token=...`

---

#### Test 2: Customer Confirms Booking (2 minutes)

**Steps**:
1. Open the email from Test 1
2. Click "Confirm Booking" button

**Expected Results**:
- ✅ Redirects to confirmation page
- ✅ Shows green success banner
- ✅ Displays "Booking Confirmed! 🎉"
- ✅ Shows all booking details
- ✅ Displays booking reference number
- ✅ Shows "What Happens Next?" section

**Check Database**:
```sql
SELECT status, quote_accepted_at, confirmation_token 
FROM quotes 
WHERE id = 'your-quote-id';
```
- ✅ `status` = 'confirmed'
- ✅ `quote_accepted_at` has timestamp
- ✅ `confirmation_token` = NULL (cleared)

**Check Emails**:
- ✅ Customer receives confirmation email
- ✅ Admin receives notification email

---

#### Test 3: Already Confirmed Detection (1 minute)

**Steps**:
1. Click the same "Confirm Booking" link again
2. Or visit: `/api/confirm-booking?token=same-token`

**Expected Results**:
- ✅ Shows confirmation page (not error)
- ✅ **Amber banner** instead of green
- ✅ Message: "Booking Already Confirmed"
- ✅ Subtitle: "This booking has already been confirmed. No further action is needed."
- ✅ Still shows booking details
- ✅ No duplicate emails sent

---

#### Test 4: Discount Follow-Up (3 minutes)

**Steps**:
1. Find a quote with status "contacted" (not confirmed)
2. Click "Follow Up" button
3. Select "Offer Discount"
4. Choose "Percentage" and enter "10"
5. Click "Send Follow-up"

**Expected Results**:
- ✅ Toast shows "Follow-up sent successfully!"
- ✅ Quote price updated in admin panel
- ✅ New `confirmation_token` generated
- ✅ Email received with discount offer

**Check Email**:
- ✅ Subject contains "Special Offer" or "Discount"
- ✅ Shows original price (strikethrough)
- ✅ Shows new discounted price
- ✅ Highlights savings amount
- ✅ Has "Claim Your Discount Now!" button

**Test Confirmation**:
1. Click the discount confirmation button
2. ✅ Confirms at **discounted price**
3. ✅ Shows correct amount on confirmation page

---

#### Test 5: Invalid Token Handling (1 minute)

**Steps**:
1. Visit: `/api/confirm-booking?token=invalid-token-123`

**Expected Results**:
- ✅ Redirects to `/confirm-booking/error`
- ✅ Shows error icon
- ✅ Title: "Booking Not Found"
- ✅ Helpful error message
- ✅ Contact information displayed
- ✅ "Return to Homepage" button
- ✅ "Make New Booking" button

---

#### Test 6: Missing Token Handling (1 minute)

**Steps**:
1. Visit: `/api/confirm-booking` (no token parameter)

**Expected Results**:
- ✅ Redirects to `/confirm-booking/error?reason=missing_token`
- ✅ Shows appropriate error message
- ✅ Contact information displayed

---

### 🔍 Database Verification

Run these SQL queries to verify data integrity:

```sql
-- Check quote was updated correctly
SELECT 
  id,
  name,
  email,
  status,
  quoted_price,
  quote_sent_at,
  quote_accepted_at,
  confirmation_token
FROM quotes
WHERE id = 'your-quote-id';

-- Check activity was logged
SELECT 
  action_type,
  created_at,
  details
FROM quote_activities
WHERE quote_id = 'your-quote-id'
ORDER BY created_at DESC;

-- Expected activities:
-- 1. 'quote_sent' - when admin sent quote
-- 2. 'customer_confirmed' - when customer confirmed
-- 3. 'discount_sent' - if discount was offered
```

---

### 📧 Email Verification

#### Check Resend Dashboard
1. Go to https://resend.com/emails
2. Verify emails were sent:
   - Quote email to customer
   - Confirmation email to customer
   - Notification email to admin

#### Check Email Content
- ✅ Professional design with gradients
- ✅ All details correct
- ✅ Links work correctly
- ✅ Responsive on mobile
- ✅ No broken images
- ✅ Correct sender address

---

### 🐛 Common Issues & Solutions

#### Issue: Email not received
**Solutions**:
- Check spam folder
- Verify Resend API key is set correctly
- Check Resend dashboard for delivery status
- Verify domain is verified in Resend

#### Issue: "Invalid token" error
**Solutions**:
- Check token was saved to database
- Verify token in URL matches database
- Check token wasn't already used (should be NULL after confirmation)

#### Issue: Edge Function error
**Solutions**:
- Check function logs: `supabase functions logs send-quote-response`
- Verify environment variables are set
- Check Resend API key is valid
- Ensure SITE_URL is correct

#### Issue: Already confirmed not showing
**Solutions**:
- Verify status is 'confirmed' in database
- Check confirmation_token is NULL
- Clear browser cache
- Check API route logic

---

### ✅ Final Verification Checklist

Before marking as complete:

- [ ] All 6 tests pass successfully
- [ ] Emails are being delivered
- [ ] Database updates correctly
- [ ] Error handling works
- [ ] "Already confirmed" message shows correctly
- [ ] Discount flow works end-to-end
- [ ] Admin notifications working
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Edge Functions deployed
- [ ] Environment variables set

---

### 📊 Success Metrics

**System is working correctly if**:
- ✅ 100% of confirmation links work
- ✅ 0% duplicate confirmations processed
- ✅ 100% of emails delivered
- ✅ All error cases handled gracefully
- ✅ Database stays consistent

---

## Need Help?

If any test fails:
1. Check the [walkthrough.md](file:///C:/Users/ummeh/.gemini/antigravity/brain/0e5e1e73-c7fd-46cf-8105-d731e5477905/walkthrough.md) for detailed flow
2. Review [supabase/functions/README.md](file:///d:/Projetcs/ChauffeurTopWebsite/ChauffeurTopRevamp/chauffeur-app/supabase/functions/README.md) for deployment
3. Check Edge Function logs
4. Verify environment variables

**All tests passing? 🎉 The system is ready for production!**
