# 🔐 Supabase Edge Function Setup for Google Maps API Key

## Overview

Your Google Maps API key is now fetched securely from a Supabase Edge Function instead of being exposed in client-side code. This is more secure!

---

## 📁 Step 1: Create Edge Function File Structure

In your Supabase project, create this file structure:

```
supabase/
└── functions/
    └── get-maps-api-key/
        └── index.ts
```

---

## 📝 Step 2: Create the Edge Function

Create file: `supabase/functions/get-maps-api-key/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  // CORS headers for browser access
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers, status: 200 });
  }

  try {
    // Get API key from Supabase secrets (stored securely on server)
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY not configured in Supabase secrets');
    }

    console.log('[get-maps-api-key] API key retrieved successfully');

    return new Response(
      JSON.stringify({ key: apiKey }),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('[get-maps-api-key] Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to retrieve API key' 
      }),
      { headers, status: 500 }
    );
  }
});
```

---

## 🚀 Step 3: Deploy the Edge Function

### Option A: Using Supabase CLI (Recommended)

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Deploy the function:**
   ```bash
   supabase functions deploy get-maps-api-key
   ```

### Option B: Using Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Edge Functions** (left sidebar)
4. Click **"New Function"**
5. Name it: `get-maps-api-key`
6. Copy and paste the code from Step 2
7. Click **"Deploy"**

---

## 🔑 Step 4: Set the Secret in Supabase

### Option A: Using Supabase CLI

```bash
supabase secrets set GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
```

### Option B: Using Supabase Dashboard

1. Go to **Project Settings** → **Edge Functions**
2. Scroll down to **"Secrets"**
3. Click **"Add Secret"**
4. Name: `GOOGLE_MAPS_API_KEY`
5. Value: Your actual Google Maps API key
6. Click **"Save"**

---

## 🧪 Step 5: Test the Edge Function

### Test in Browser Console:

```javascript
// Replace with your Supabase URL and anon key
const { createClient } = supabase;
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_ANON_KEY');

const { data, error } = await supabase.functions.invoke('get-maps-api-key');

console.log('Response:', data);
console.log('Error:', error);
```

### Test with cURL:

```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/get-maps-api-key' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

**Expected Response:**
```json
{
  "key": "AIzaSy..."
}
```

---

## ✅ Step 6: Update Your .env.local

You can now **REMOVE** the Google Maps API key from `.env.local` since it's now fetched from Supabase!

Your `.env.local` should only have:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🔒 Security Benefits

### Before (Environment Variable):
```
Client → Reads NEXT_PUBLIC_GOOGLE_MAPS_API_KEY from browser
❌ API key visible in browser DevTools
❌ Anyone can see your key in JavaScript
⚠️ Must restrict key in Google Cloud Console
```

### After (Supabase Edge Function):
```
Client → Calls Supabase Edge Function → Returns API key from server
✅ API key NEVER exposed to client
✅ Key stored securely in Supabase secrets
✅ Can rotate key without redeploying app
✅ Extra layer of security
```

---

## 🐛 Troubleshooting

### Problem: "Failed to fetch API key"

**Check:**
1. Edge Function is deployed: `supabase functions list`
2. Secret is set: Check Supabase Dashboard → Edge Functions → Secrets
3. Function name is correct: `get-maps-api-key` (exact match)

### Problem: "GOOGLE_MAPS_API_KEY not configured"

**Solution:**
```bash
supabase secrets set GOOGLE_MAPS_API_KEY=your_actual_key_here
```

### Problem: CORS error

**Solution:** Make sure your Edge Function has the correct CORS headers (already included in the code above).

### Problem: "No data in response"

**Check browser console:**
```javascript
const { data, error } = await supabase.functions.invoke('get-maps-api-key');
console.log('Data:', data);
console.log('Error:', error);
```

---

## 📊 Testing Your Implementation

1. **Restart your Next.js dev server:**
   ```bash
   npm run dev
   ```

2. **Open your booking page:**
   ```
   http://localhost:3000/booking
   ```

3. **Check browser console:**
   - You should see: `[MapsApiKey] Fetching API key from Supabase Edge Function...`
   - Then: `[MapsApiKey] API key retrieved successfully`
   - Then: `[MapsLoader] API loaded`
   - Then: `[Autocomplete] Initialized with cost-optimized settings`

4. **Test autocomplete:**
   - Click on "Pickup Location" field
   - Start typing an address
   - Autocomplete suggestions should appear! 🎉

---

## 💰 Cost Considerations

**Supabase Edge Function Costs:**
- First 500,000 invocations/month: **FREE** ✅
- After that: ~$0.50 per 1 million invocations

**Impact:**
- Autocomplete initialization: 1 call per page load
- Typical usage: ~10,000 page loads/month = **$0.00** (within free tier)

**Totally free for most use cases!** 🎉

---

## 🔄 Key Rotation (When Needed)

To rotate your Google Maps API key:

1. **Create new key in Google Cloud Console**
2. **Update Supabase secret:**
   ```bash
   supabase secrets set GOOGLE_MAPS_API_KEY=new_key_here
   ```
3. **Done!** No code changes needed, no redeployment needed ✅

---

## 📚 Useful Commands

```bash
# List all Edge Functions
supabase functions list

# View function logs
supabase functions logs get-maps-api-key

# Delete function (if needed)
supabase functions delete get-maps-api-key

# List all secrets
supabase secrets list

# Delete a secret
supabase secrets unset GOOGLE_MAPS_API_KEY
```

---

## ✨ You're All Set!

Once you deploy the Edge Function and set the secret, your Google Maps API key will be:

- 🔒 **Secure** - Never exposed to client
- 🔄 **Rotatable** - Change without redeploying
- 💰 **Free** - Within Supabase free tier
- ⚡ **Fast** - Cached after first fetch

**Next Step:** Deploy the Edge Function to Supabase and test your booking form!

---

Need help? Check the troubleshooting section or Supabase documentation:
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Supabase CLI Guide](https://supabase.com/docs/guides/cli)

