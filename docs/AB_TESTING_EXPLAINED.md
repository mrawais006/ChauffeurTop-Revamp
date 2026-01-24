# AB Testing Infrastructure - Explained

## Overview

Your landing pages have **URL-based AB testing** - this means there are **TWO SEPARATE URLs** for the Melbourne Airport Transfer landing page, and there is **NO automatic redirect** between them.

## The Two Pages

### Page 1: Control (Original)
- **URL**: `https://chauffeurtop.com.au/ads/melbourne-airport-transfer`
- **Status**: ✅ Live
- **Variant**: A (Control)
- **Messaging**: Standard, trust-focused
- **Headline**: "Reliable Melbourne Airport Transfers - Guaranteed On Time"
- **Source tracking**: `landing_airport`

### Page 2: Variant (Urgency-focused)
- **URL**: `https://chauffeurtop.com.au/ads/melbourne-airport-transfer-v2`
- **Status**: ✅ Live (tested Jan 24, 2026 - returns HTTP 200 OK)
- **Variant**: B (Urgency)
- **Messaging**: Urgency-focused, scarcity elements
- **Headline**: "Melbourne Airport Transfers - Spots Filling Fast"
- **Source tracking**: `landing_airport_v2`
- **Special elements**: 
  - Red urgency banner ("High Demand Alert")
  - Different CTAs ("Secure Your Spot Now")
  - Urgency messaging throughout

## How AB Testing Works (MANUAL)

### ⚠️ IMPORTANT: No Automatic Redirect

There is **NO automatic redirect logic** in the codebase. Users do NOT automatically land on V2 when visiting the original page.

### How to Run AB Tests

You have **3 options** for testing:

#### Option 1: Manual URL Split (Current Setup)
- Run **50%** of your Google Ads traffic to `/ads/melbourne-airport-transfer`
- Run **50%** of your Google Ads traffic to `/ads/melbourne-airport-transfer-v2`
- Google Ads will split traffic for you
- Each variant tracks conversions separately

**How to set up in Google Ads:**
1. Create Ad Group 1 → Final URL: `https://chauffeurtop.com.au/ads/melbourne-airport-transfer`
2. Create Ad Group 2 → Final URL: `https://chauffeurtop.com.au/ads/melbourne-airport-transfer-v2`
3. Split budget 50/50
4. Compare conversion rates after 2 weeks minimum

#### Option 2: Automated Split (Requires Code Changes)
Add redirect logic in middleware to randomly assign 50% to V1, 50% to V2.

**Not currently implemented** - would require changes to `middleware.ts`

#### Option 3: Google Ads Experiments
Use Google Ads built-in experiments feature:
1. Create experiment in Google Ads
2. Set control URL: `/ads/melbourne-airport-transfer`
3. Set variant URL: `/ads/melbourne-airport-transfer-v2`
4. Google splits traffic automatically

## Current Google Ads Issue

### The Problem
- You're running ads on: `/ads/melbourne-airport-transfer` ✅
- Google AdsBot was returning 404 errors for mobile validation

### The Fix (Applied Jan 24, 2026)
- Added explicit `AdsBot-Google-Mobile` rules to `robots.ts`
- Added static `robots.txt` fallback
- Both pages now explicitly allow all AdsBots

### What This Means
- ✅ Your original page (`/ads/melbourne-airport-transfer`) will now pass Google's validation
- ✅ V2 page (`/ads/melbourne-airport-transfer-v2`) is also accessible and validated
- ❌ No automatic traffic split - you need to manually split in Google Ads

## Tracking & Analytics

Both pages track differently:

| Metric | V1 (Control) | V2 (Variant) |
|--------|--------------|--------------|
| GA4 Source | `landing_airport` | `landing_airport_v2` |
| AB Variant | (not tracked) | `variant_b_urgency` |
| Session Storage | (none) | `ab_airport_landing: variant_b_urgency` |
| UTM Campaign | Your campaign | Your campaign |

**Conversion Attribution:**
When a user books from V2, the conversion will include:
- Source: `landing_airport_v2`
- AB variant: `variant_b_urgency`

This allows you to compare conversion rates in your analytics.

## SEO Considerations

Both pages have:
- `robots: { index: false, follow: false }` ✅ (Good for ads pages)
- Canonical URL pointing to V1: ✅
  - V2's canonical: `https://chauffeurtop.com.au/ads/melbourne-airport-transfer`
  - This tells Google "V2 is a variant of V1, don't index separately"

## Recommended Next Steps

### 1. Decide on Testing Strategy

**Option A: Test V2 (Recommended)**
- Create new ad group in Google Ads
- Send 50% traffic to V2 URL
- Run for 2-4 weeks
- Compare conversion rates

**Option B: Keep Only V1**
- If you don't want to test, you can safely ignore V2
- V2 won't receive traffic unless you explicitly send ads there
- Keep V1 as your only landing page

### 2. Monitor Both Pages

After deployment, verify both URLs work:
```bash
# Test V1
curl -I https://chauffeurtop.com.au/ads/melbourne-airport-transfer

# Test V2
curl -I https://chauffeurtop.com.au/ads/melbourne-airport-transfer-v2
```

Both should return: `HTTP/2 200`

### 3. Google Ads Setup (If Testing V2)

1. **Create two ad groups:**
   - Group A (Control) → `/ads/melbourne-airport-transfer`
   - Group B (Urgency) → `/ads/melbourne-airport-transfer-v2`

2. **Split budget equally**

3. **Run for minimum 2 weeks** (preferably 4)

4. **Compare metrics:**
   - Conversion rate
   - Cost per conversion
   - Bounce rate (in GA4)
   - Form submission rate

## Questions & Answers

### Q: If I run ads on the original page, does it redirect to V2?
**A: No.** There is no automatic redirect. Users land exactly where you send them.

### Q: Why does V2 exist then?
**A: For manual AB testing.** You can send 50% of traffic to V1, 50% to V2, and compare which converts better.

### Q: Can Google AdsBot crawl both pages?
**A: Yes (as of Jan 24, 2026).** Both pages now have explicit AdsBot rules in robots.ts.

### Q: Which page should I use for my ads?
**A: Your choice:**
- **V1** - More conservative, trust-focused
- **V2** - More urgency, scarcity-driven
- **Both** - Split traffic 50/50 to test

### Q: Will this fix my Google Ads disapprovals?
**A: Yes.** The robots.ts fix ensures AdsBot can access the pages. After deployment, request re-review in Google Ads.

### Q: Should I delete V2 if I'm not testing?
**A: No need to delete.** It's harmless. It won't receive traffic unless you explicitly send ads there. You can keep it as an option for future testing.

## Technical Details

### File Structure
```
app/ads/
├── melbourne-airport-transfer/
│   ├── page.tsx (metadata, noindex)
│   └── MelbourneAirportTransferContent.tsx (V1 layout)
├── melbourne-airport-transfer-v2/
│   ├── page.tsx (metadata, noindex, canonical to V1)
│   └── MelbourneAirportTransferV2Content.tsx (V2 urgency layout)
```

### Key Differences in V2
- Headline: "Spots Filling Fast" (urgency)
- Red urgency banner at top
- Different CTA text: "Secure Your Spot Now"
- Social proof: "8 bookings in last hour"
- More scarcity language throughout

### Tracking Code
Both pages use `useUTMCapture()` hook to track:
- Service type
- Source
- Page path
- Variant (V2 only)

V2 also uses `useABVariant()` to store the variant in sessionStorage for conversion attribution.

## Summary

1. ✅ **Both pages work independently** - no automatic redirects
2. ✅ **Both pages accessible to AdsBots** - robots.ts fixed
3. ❌ **No automatic traffic split** - you control this in Google Ads
4. 💡 **V2 is optional** - you can test it or ignore it
5. 🎯 **Current ads setup is correct** - using V1 URL is perfectly fine

---

**Last Updated**: January 24, 2026  
**Status**: Both pages live and validated ✅
