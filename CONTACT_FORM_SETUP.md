# Contact Form Implementation Guide

## ✅ What Has Been Implemented

All files have been created with your **luxury black/gold theme** maintained:

### 📁 Backend Logic Files (Pure Logic - No Theme)
1. ✅ `lib/constants.ts` - Business configuration & helper functions
2. ✅ `lib/supabase.ts` - Supabase client initialization
3. ✅ `types/contact.ts` - TypeScript type definitions
4. ✅ `schemas/contact.ts` - Zod validation schemas
5. ✅ `actions/contact.ts` - Server action (your API logic)

### 🎨 Frontend Files (Your Luxury Theme Maintained)
6. ✅ `components/contact/ContactForm.tsx` - Refactored with backend integration
7. ✅ `app/thank-you/page.tsx` - Success page with your theme

### 📦 Dependencies Installed
- ✅ `zod` - Form validation
- ✅ `@supabase/supabase-js` - Database client

---

## 🔧 Setup Steps

### Step 1: Environment Variables
Create or update `.env.local` in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

**Get these values from:**
1. Go to your Supabase project dashboard
2. Settings → API
3. Copy `Project URL` and `anon/public key`

---

### Step 2: Create Supabase Database Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for contact form)
CREATE POLICY "Anyone can submit contact form" 
ON contacts FOR INSERT 
TO public 
WITH CHECK (true);

-- Create policy to allow authenticated users to read (for admin)
CREATE POLICY "Authenticated users can read contacts" 
ON contacts FOR SELECT 
TO authenticated 
USING (true);

-- Add index for faster queries
CREATE INDEX contacts_created_at_idx ON contacts(created_at DESC);
CREATE INDEX contacts_email_idx ON contacts(email);
```

---

### Step 3: Create Supabase Edge Function (Optional - For Email Notifications)

This step is **optional** but recommended for automatic email notifications.

#### Option A: Create Edge Function via Supabase Dashboard
1. Go to Supabase Dashboard → Edge Functions
2. Create new function: `send-notification`
3. Deploy the function

#### Option B: Skip for Now
The contact form will still work and save to database. You just won't get email notifications.

**Note:** If you skip this, you'll see a console warning about notification errors, but contacts will still be saved successfully.

---

### Step 4: Test Your Contact Form

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:** `http://localhost:3000/contact`

3. **Fill out the form and submit**

4. **You should be redirected to:** `http://localhost:3000/thank-you`

5. **Check your Supabase dashboard:** Go to Table Editor → contacts table to see the submitted data

---

## 🎯 How It Works - The Flow

```
User fills form in /contact
         ↓
User clicks "Send Message"
         ↓
Form calls submitContactForm() server action
         ↓
Server validates data with Zod schema
         ↓
Server saves to Supabase 'contacts' table
         ↓
Server attempts to send email notification (optional)
         ↓
Returns success/error to form
         ↓
On success: Redirect to /thank-you
On error: Show error message
```

---

## 📂 File Structure Summary

```
chauffeur-app/
├── .env.local                          # Your environment variables (create this)
├── app/
│   ├── contact/
│   │   └── page.tsx                   # Contact page (existing - no changes needed)
│   └── thank-you/
│       └── page.tsx                   # ✅ NEW - Thank you page
├── components/
│   └── contact/
│       └── ContactForm.tsx            # ✅ UPDATED - Now has backend logic
├── lib/
│   ├── constants.ts                   # ✅ NEW - Business config
│   ├── supabase.ts                    # ✅ NEW - Database client
│   └── utils.ts                       # Existing
├── actions/
│   └── contact.ts                     # ✅ NEW - Server action (API)
├── schemas/
│   └── contact.ts                     # ✅ NEW - Validation rules
└── types/
    └── contact.ts                     # ✅ NEW - TypeScript types
```

---

## 🐛 Troubleshooting

### Error: "Missing NEXT_PUBLIC_SUPABASE_URL"
**Solution:** Create `.env.local` file with your Supabase credentials

### Error: "Failed to save contact"
**Solution:** Make sure you created the `contacts` table in Supabase

### Warning: "Notification may not have been sent"
**Solution:** This is OK! Contact is still saved. Create Edge Function if you want emails.

### Form doesn't submit
**Solution:** Check browser console for errors. Make sure all dependencies are installed.

---

## 🚀 Next Steps

1. ✅ Create `.env.local` with Supabase credentials
2. ✅ Run SQL to create `contacts` table
3. ✅ Test the form
4. ⏳ (Optional) Set up Supabase Edge Function for email notifications
5. ⏳ (Later) Apply same pattern to booking form

---

## 📝 Notes

- Your **luxury theme is maintained** in all frontend files
- All **backend logic is separated** into reusable files
- Form is **type-safe** with TypeScript and Zod validation
- Design uses your **black/gold/luxury-gold colors**
- **Loading states** and **error handling** are implemented
- Form fields are **disabled during submission**

---

## 🎓 For Your Learning

Remember the architecture:
- **types/** = Data shapes (TypeScript interfaces)
- **schemas/** = Validation rules (Zod schemas)
- **actions/** = Backend logic (Server actions = your API)
- **lib/** = Shared utilities (Supabase client, constants)
- **components/** = Frontend UI (React components)

This separation makes code:
- ✅ Easy to maintain
- ✅ Easy to test
- ✅ Easy to reuse
- ✅ Type-safe throughout

---

Need help? Check the troubleshooting section or ask me! 🚀

