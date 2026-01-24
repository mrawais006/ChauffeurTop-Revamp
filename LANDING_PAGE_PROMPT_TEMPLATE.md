# High-Converting Google Ads Landing Page Prompt Template

## Instructions for Use
Replace all instances of `[BUSINESS_NAME]`, `[SERVICE_TYPE]`, and other bracketed placeholders with your specific details. Give this entire prompt to an AI assistant along with access to your project codebase.

---

## THE PROMPT

---

### Project Context

I need you to create a **high-converting Google Ads landing page** for **[BUSINESS_NAME]** - a **[INDUSTRY/SERVICE TYPE]** business.

**Primary Goal:** The ONLY goal is to get visitors to fill out the embedded quote/contact form. These pages will receive paid Google Ads traffic, so every element must be conversion-focused.

---

### Design Requirements

#### Visual Aesthetics
- **Match the project's existing brand colors, typography, and design system**
- Premium, elegant, and professional appearance
- Clean, uncluttered layout with generous whitespace
- High-quality imagery (use existing project assets or premium stock)
- Subtle animations that enhance without distracting
- Mobile-first responsive design

#### Guard Mode Constraints (CRITICAL)
These landing pages must be **isolated conversion funnels** with NO escape routes:

1. **NO main navigation menu** - Remove or hide the standard header navigation
2. **NO footer links** except:
   - Phone number (clickable)
   - Privacy Policy
   - Terms of Service
3. **Logo behavior:** Clickable but opens homepage in NEW TAB (not same tab)
4. **ONLY clickable elements allowed:**
   - CTA buttons that scroll to form
   - Phone number (tel: link)
   - Logo (new tab only)
   - Form submission
   - Legal links in footer

---

### Page Structure

#### Section 1: Hero (Above the Fold)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo - clicks to homepage in new tab]     [Phone Button]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     [COMPELLING HEADLINE - Address Pain Point]              │
│     [Subheadline - Unique Value Proposition]                │
│                                                             │
│     ┌─────────────────────────────────────┐                │
│     │     EMBEDDED QUOTE/CONTACT FORM     │                │
│     │     (Pre-select service if from     │                │
│     │      specific service ad)           │                │
│     └─────────────────────────────────────┘                │
│                                                             │
│     [Trust Badges: Rating Stars, Review Count, Awards]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Hero Requirements:**
- Background: Subtle gradient or high-quality relevant image with overlay
- Headline: 6-10 words, addresses the visitor's immediate need
- Subheadline: 15-25 words, emphasizes key differentiator
- Form: Visible without scrolling on desktop (above the fold)
- Trust signals: Star rating, review count, years in business, awards

#### Section 2: Social Proof / Trust Strip

```
┌─────────────────────────────────────────────────────────────┐
│  ★★★★★ [Rating]    |    [X]+ Reviews    |    [X] Years     │
│  "Partner logos or certification badges"                    │
└─────────────────────────────────────────────────────────────┘
```

#### Section 3: Key Benefits (Why Choose Us)

```
┌─────────────────────────────────────────────────────────────┐
│                    WHY CHOOSE [BUSINESS_NAME]               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Icon    │  │  Icon    │  │  Icon    │  │  Icon    │   │
│  │ Benefit  │  │ Benefit  │  │ Benefit  │  │ Benefit  │   │
│  │  Title   │  │  Title   │  │  Title   │  │  Title   │   │
│  │  Desc    │  │  Desc    │  │  Desc    │  │  Desc    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Benefits Section Requirements:**
- 4-6 key benefits with icons
- Short, punchy titles (2-4 words)
- Brief descriptions (1-2 sentences max)
- Icons should match brand style

#### Section 4: Service Details / How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                      HOW IT WORKS                           │
├─────────────────────────────────────────────────────────────┤
│     Step 1              Step 2              Step 3          │
│   [Icon/Number]       [Icon/Number]       [Icon/Number]     │
│   Get a Quote         We Confirm          Enjoy Service     │
│   Description         Description         Description       │
└─────────────────────────────────────────────────────────────┘
```

#### Section 5: Testimonials / Reviews

```
┌─────────────────────────────────────────────────────────────┐
│                  WHAT OUR CLIENTS SAY                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │  "Testimonial quote..."                              │  │
│  │   - Customer Name, Location       ★★★★★             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  "Testimonial quote..."                              │  │
│  │   - Customer Name, Location       ★★★★★             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Testimonials Requirements:**
- 2-4 real testimonials
- Include customer name and location
- Star ratings visible
- Optional: customer photos (adds credibility)

#### Section 6: Service-Specific Content (Optional)

If this landing page is for a specific service (e.g., Airport Transfers), include:
- Service-specific benefits
- Pricing information if applicable
- Service area coverage
- FAQ section relevant to that service

#### Section 7: FAQ Section

```
┌─────────────────────────────────────────────────────────────┐
│                  FREQUENTLY ASKED QUESTIONS                 │
├─────────────────────────────────────────────────────────────┤
│  ▸ Question 1                                               │
│    Answer collapsed/expandable                              │
│  ▸ Question 2                                               │
│    Answer collapsed/expandable                              │
│  ▸ Question 3                                               │
│    Answer collapsed/expandable                              │
└─────────────────────────────────────────────────────────────┘
```

**FAQ Requirements:**
- 4-6 most common questions
- Address objections/concerns
- Keep answers concise
- Use accordion/expandable format

#### Section 8: Final CTA Section

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         READY TO [DESIRED ACTION]?                          │
│         [Urgency Statement]                                 │
│                                                             │
│         ┌─────────────────────────┐                        │
│         │   GET YOUR FREE QUOTE   │                        │
│         └─────────────────────────┘                        │
│                                                             │
│         Or call us: [PHONE NUMBER]                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Section 9: Minimal Footer

```
┌─────────────────────────────────────────────────────────────┐
│  © [YEAR] [BUSINESS_NAME]  |  Privacy  |  Terms  |  Phone  │
└─────────────────────────────────────────────────────────────┘
```

---

### Mobile-Specific Requirements

1. **Sticky CTA Bar** at bottom of screen on mobile:
   - Two buttons: "Call Now" and "Get Quote"
   - Always visible while scrolling
   - High contrast, thumb-friendly size

2. **Form Optimization:**
   - Large touch targets (min 44px height)
   - Auto-zoom prevention on inputs
   - Simplified fields for mobile

3. **Performance:**
   - Lazy load images below fold
   - Optimize for Core Web Vitals
   - Fast initial load (< 3 seconds)

---

### Form Requirements

The embedded form should:

1. **Essential Fields Only:**
   - Name
   - Email
   - Phone
   - Service-specific fields (minimal)
   - Message/Notes (optional)

2. **Smart Features:**
   - Pre-select service based on ad landing
   - Phone number auto-formatting
   - Email validation
   - Clear error messages

3. **Submission Behavior:**
   - Show loading state during submission
   - Redirect to thank-you page OR show inline success
   - Track conversion in Google Ads

---

### Technical Implementation

1. **URL Structure:** `/ads/[service-name]` (e.g., `/ads/airport-transfers`)

2. **Tracking Requirements:**
   - UTM parameter capture (source, medium, campaign, content, term)
   - Google Ads conversion tracking pixel
   - Google Analytics 4 event tracking
   - Lead source tracking to database

3. **SEO:**
   - Add `noindex, nofollow` meta tag (these are ad landing pages, not organic)

4. **Performance:**
   - Minimize JavaScript
   - Optimize images (WebP format)
   - Preload critical assets

---

### Content Tone & Style

- **Professional yet approachable**
- **Benefit-focused, not feature-focused**
- **Urgency without being pushy**
- **Trust-building language**
- **Local/personal touch where appropriate**

---

### Example Headlines by Industry

**Service Business:**
- "Professional [Service] in [City] - Get Your Free Quote"
- "[City]'s Most Trusted [Service] Provider"
- "Fast, Reliable [Service] When You Need It"

**Luxury/Premium:**
- "Experience Premium [Service] in [City]"
- "The [City] [Service] Experience You Deserve"
- "[Service] Excellence, Delivered"

---

### Checklist Before Launch

- [ ] All navigation links removed (except logo → new tab)
- [ ] Form submits correctly and tracks conversion
- [ ] Mobile sticky CTA bar working
- [ ] Phone number clickable (tel: link)
- [ ] UTM parameters captured
- [ ] Page loads under 3 seconds
- [ ] Trust badges/reviews visible
- [ ] noindex meta tag added
- [ ] Thank you page configured
- [ ] Google Ads conversion tracking verified

---

### Additional Instructions for AI

1. **Study the existing project first** - Match the design system, components, colors, and typography already in use

2. **Reuse existing components** where possible - Forms, buttons, cards should match the rest of the site

3. **Create a dedicated layout** for landing pages that removes the standard header/footer

4. **The form should integrate with the existing backend** - Use the same submission logic, just with different tracking

5. **Make it pixel-perfect** - These pages represent the brand to paid traffic

---

## PLACEHOLDERS TO REPLACE

| Placeholder | Description |
|-------------|-------------|
| `[BUSINESS_NAME]` | Your business name |
| `[INDUSTRY/SERVICE TYPE]` | e.g., "luxury chauffeur service" |
| `[CITY]` | Primary service area |
| `[SERVICE_NAME]` | Specific service for this landing page |
| `[PHONE NUMBER]` | Business phone |
| `[RATING]` | Google/Yelp rating (e.g., 4.9) |
| `[REVIEW_COUNT]` | Number of reviews |
| `[YEARS]` | Years in business |

---

## Final Note

This landing page should feel like a **premium, focused experience** that makes visitors feel confident about submitting their information. Every element should either:
1. Build trust
2. Highlight benefits
3. Drive toward form submission

Remove anything that doesn't serve these three purposes.

---

*Template created based on high-converting landing pages built for ChauffeurTop luxury chauffeur service.*
