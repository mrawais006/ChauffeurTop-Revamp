# Rollback Guide

Emergency procedures to undo changes if issues arise.

---

## Quick Rollback Options

### Option 1: Vercel Instant Rollback (Fastest)
1. Go to [Vercel Dashboard](https://vercel.com)
2. Select the ChauffeurTop project
3. Go to "Deployments" tab
4. Find the last working deployment
5. Click "..." menu → "Promote to Production"

### Option 2: Git Revert
```bash
# View recent commits
git log --oneline -10

# Revert specific commit
git revert <commit-hash>

# Push the revert
git push origin main
```

### Option 3: File-Level Restore
```bash
# Restore a single file from a specific commit
git checkout <commit-hash> -- path/to/file

# Or restore from the previous commit
git checkout HEAD~1 -- path/to/file
```

---

## Rollback Procedures by Change Category

### 1. robots.ts Rollback

**Symptoms:** Search engines blocked, indexing issues

**Rollback:**
```bash
# Delete the file
rm app/robots.ts

# Or restore to empty state
git checkout HEAD~1 -- app/robots.ts
```

**Verification:**
- Visit https://chauffeurtop.com.au/robots.txt
- Should return 404 (not found) after rollback

---

### 2. sitemap.ts Rollback

**Symptoms:** Sitemap errors, Supabase connection issues

**Rollback:**
```bash
rm app/sitemap.ts
```

**Verification:**
- Visit https://chauffeurtop.com.au/sitemap.xml
- Should return 404 after rollback

---

### 3. Middleware Rollback

**Symptoms:** Pages not loading, security header issues, broken functionality

**Rollback:**
```bash
rm middleware.ts
```

**Verification:**
- All pages should load normally
- No security headers (back to baseline)
- Forms work correctly

---

### 4. next.config.ts Rollback

**Symptoms:** Build failures, header issues, redirect loops

**Original State:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eixvfhpxaxxdiekonldc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
```

**Rollback:**
```bash
git checkout HEAD~1 -- next.config.ts
```

---

### 5. Service Page Component Split Rollback

**Symptoms:** Page not rendering, metadata not showing, component errors

For each affected service page, the rollback restores the single-file structure.

**Example - Airport Transfers:**

**Rollback Steps:**
1. Delete the new content file:
```bash
rm app/services/airport-transfers/AirportTransfersContent.tsx
```

2. Restore original page.tsx from PRE_CHANGES_STATE.md or git:
```bash
git checkout HEAD~1 -- app/services/airport-transfers/page.tsx
```

**All Service Pages to Rollback:**
- `app/services/airport-transfers/`
- `app/services/corporate-travel/`
- `app/services/family-travel/`
- `app/services/luxury-tours/`
- `app/services/cruise-ship-transfers/`
- `app/services/conference-events/`
- `app/services/student-transfers/`
- `app/services/wedding-limos/`
- `app/services/night-out/`
- `app/services/page.tsx`

**Ads Pages:**
- `app/ads/melbourne-airport-transfer/`
- `app/ads/corporate-transfer/`
- `app/ads/family-transfer/`

---

### 6. Canonical URL Rollback

**Symptoms:** Wrong canonical URLs, SEO issues

**Rollback:**
Remove the `alternates` property from each page's metadata export.

**Pattern:**
```typescript
// Remove this from metadata:
alternates: {
  canonical: 'https://chauffeurtop.com.au/...',
},
```

---

### 7. URL Redirect Rollback

**Symptoms:** Redirect loops, wrong destinations, 404s

**Rollback:**
Remove the `redirects()` function from `next.config.ts`

---

### 8. Image Optimization Rollback

**Symptoms:** Broken images, quality issues

**Rollback:**
Restore original images from backup:
```bash
# If backed up
cp -r backup/public/images/* public/images/

# Or from git
git checkout HEAD~1 -- public/
```

---

## Emergency Contacts

If critical issues arise:
1. Check Vercel deployment logs
2. Use Vercel instant rollback
3. Check Supabase dashboard for API issues

---

## Pre-Deployment Checklist

Before each deployment, ensure:

- [ ] Local build succeeds (`npm run build`)
- [ ] All pages tested locally
- [ ] Booking form tested
- [ ] Contact form tested
- [ ] Mobile view tested
- [ ] Previous deployment noted for rollback

---

## Post-Rollback Verification

After any rollback:

1. [ ] Site loads correctly
2. [ ] All navigation works
3. [ ] Booking form submits successfully
4. [ ] Contact form submits successfully
5. [ ] No console errors
6. [ ] Mobile responsive
7. [ ] Check Vercel function logs for errors

---

*Keep this document updated as changes are made during the audit.*
