# Component Catalog

> Last Updated: 2026-02-12
> Total Components: 110+
> Framework: React 19 with Next.js App Router

---

## Table of Contents

1. [Component Organization](#1-component-organization)
2. [UI Components (Base)](#2-ui-components-base)
3. [Layout Components](#3-layout-components)
4. [Booking Components](#4-booking-components)
5. [Home Page Components](#5-home-page-components)
6. [Landing Page Components](#6-landing-page-components)
7. [Admin Components](#7-admin-components)
8. [Service Page Components](#8-service-page-components)
9. [Blog Components](#9-blog-components)
10. [Maps Components](#10-maps-components)
11. [Contact Components](#11-contact-components)
12. [About Components](#12-about-components)
13. [Component Tree](#13-component-tree)

---

## 1. Component Organization

```
src/components/
├── ui/           # Base UI primitives (shadcn/ui + Radix)
├── layout/       # Navbar, Footer, ConditionalLayout
├── booking/      # Booking form and sub-components
├── home/         # Homepage section components
├── landing/      # Ad landing page components
├── admin/        # Admin dashboard (largest section, 50+)
│   └── marketing/  # Marketing campaign components
├── services/     # Service page components
├── blog/         # Blog viewing components
├── maps/         # Google Maps integration
├── contact/      # Contact form
└── about/        # About page sections
```

**Convention:** All interactive components use `'use client'` directive. Server components are the default.

---

## 2. UI Components (Base)

These are foundational components built on [Radix UI](https://radix-ui.com/) following the [shadcn/ui](https://ui.shadcn.com/) pattern.

| Component | File | Description |
|-----------|------|-------------|
| `Button` | `ui/button.tsx` | Button with variants: default, gold, destructive, outline, ghost, link |
| `Input` | `ui/input.tsx` | Text input field |
| `Textarea` | `ui/textarea.tsx` | Multi-line text input |
| `Select` | `ui/select.tsx` | Dropdown select (Radix) |
| `Checkbox` | `ui/checkbox.tsx` | Checkbox input (Radix) |
| `RadioGroup` | `ui/radio-group.tsx` | Radio button group (Radix) |
| `Dialog` | `ui/dialog.tsx` | Modal dialog (Radix) |
| `Popover` | `ui/popover.tsx` | Popover tooltip (Radix) |
| `Tabs` | `ui/tabs.tsx` | Tab navigation (Radix) |
| `Avatar` | `ui/avatar.tsx` | User avatar |
| `Badge` | `ui/badge.tsx` | Status badge/label |
| `Card` | `ui/card.tsx` | Card container |
| `Label` | `ui/label.tsx` | Form label |
| `Table` | `ui/table.tsx` | Data table |
| `Calendar` | `ui/calendar.tsx` | Date picker calendar |
| `Toaster` | `ui/toaster.tsx` | Toast notification container (Sonner) |

### Custom UI Components

| Component | File | Description |
|-----------|------|-------------|
| `WhatsAppButton` | `ui/WhatsAppButton.tsx` | Floating WhatsApp contact button |
| `FloatingContactButton` | `ui/FloatingContactButton.tsx` | Floating phone/contact button |
| `LiveBookingNotification` | `ui/LiveBookingNotification.tsx` | Real-time booking notification popup |
| `AnimatedCardsStack` | `ui/animated-cards-stack.tsx` | Stacked card animation component |

---

## 3. Layout Components

### `Navbar`
- **File:** `layout/Navbar.tsx`
- **Type:** Client Component
- **State:** `scrolled`, `mobileMenuOpen`, `mounted`, `mobileServicesOpen`
- **Features:** Sticky header, scroll detection, desktop dropdown, mobile overlay menu, mobile sticky CTA button
- **Navigation:** Home, Fleet, About, Blogs, Contact + Services dropdown (9 services)

### `Footer`
- **File:** `layout/Footer.tsx`
- **Type:** Client Component
- **Sections:** Brand + social, Quick links, Services, Contact info, Payment icons, Legal

### `ConditionalLayout`
- **File:** `layout/ConditionalLayout.tsx`
- **Props:** `{ children, hideNavbar?, hideFooter? }`
- **Purpose:** Wraps page content, conditionally shows/hides Navbar and Footer (hidden on admin, landing pages)

### `PaymentIcons`
- **File:** `layout/PaymentIcons.tsx`
- **Purpose:** Displays accepted payment method logos in footer

---

## 4. Booking Components

### `BookingForm` (Main)
- **File:** `booking/BookingForm.tsx`
- **Type:** Client Component
- **State:** All form fields, loading, errors, submitted
- **Hooks:** `useState`, `useEffect`, `useRouter`, `useUTMCapture`
- **Flow:** Multi-step form -> Zod validation -> `submitBookingForm()` server action -> redirect to thank-you
- **Features:** Pre-population from sessionStorage, GA4 event tracking, return trip support

### Sub-Components

| Component | Props | Description |
|-----------|-------|-------------|
| `ServiceTypeSelect` | `{ value, onChange }` | 7 service type options |
| `VehicleSelect` | `{ value, onChange }` | Vehicle dropdown with image preview |
| `ContactDetails` | `{ onPhoneChange, selectedVehicle, defaultPassengers }` | Name, email, phone, passengers |
| `LocationDetails` | `{ pickup, destinations, handlers }` | Pickup + up to 4 destinations with autocomplete |
| `DateTimeSelect` | `{ date, time, onDateChange, onTimeChange }` | Date and time pickers |
| `ReturnTripToggle` | `{ needsReturnTrip, onToggle }` | Return trip checkbox |
| `ReturnTripDetails` | `{ returnTrip state, handlers }` | Return trip pickup, destination, date, time |
| `AirportDetails` | `{ flightNumber, terminalType, handlers }` | Flight number, terminal selection |
| `DriverInstructions` | - | Special instructions textarea |

### `BookingPageForm` (Alternative)
- **File:** `booking/BookingPageForm.tsx`
- **Features:** Glass-morphism design, country dropdown with flags (239 countries), vehicle preview cards

---

## 5. Home Page Components

| Component | File | Description |
|-----------|------|-------------|
| `HeroSection` | `home/HeroSection.tsx` | Main hero banner with CTA |
| `HeroCarousel` | `home/HeroCarousel.tsx` | Auto-sliding image carousel |
| `BookingWidget` | `home/BookingWidget.tsx` | Compact horizontal booking widget (saves to sessionStorage) |
| `IntroductionSection` | `home/IntroductionSection.tsx` | Company introduction |
| `FourPillars` | `home/FourPillars.tsx` | 4 key business values with scroll animation |
| `ServicesGrid` | `home/ServicesGrid.tsx` | Grid of service offerings |
| `VehicleFleet` | `home/VehicleFleet.tsx` | Vehicle showcase with specs |
| `ReviewsSection` | `home/ReviewsSection.tsx` | Customer testimonials carousel |
| `FAQSection` | `home/FAQSection.tsx` | Expandable FAQ accordion |
| `InformationSection` | `home/InformationSection.tsx` | Additional info section |
| `CTASection` | `home/CTASection.tsx` | Call-to-action booking prompt |

---

## 6. Landing Page Components

Designed for ad campaigns with conversion optimization:

| Component | File | Description |
|-----------|------|-------------|
| `LandingPageLayout` | `landing/LandingPageLayout.tsx` | Layout wrapper with UTM capture |
| `LandingPageHero` | `landing/LandingPageHero.tsx` | Hero section for landing pages |
| `LandingPageForm` | `landing/LandingPageForm.tsx` | Booking form tailored for landing pages |
| `LandingFleetGrid` | `landing/LandingFleetGrid.tsx` | Vehicle fleet display |
| `USPSection` | `landing/USPSection.tsx` | Unique selling propositions |
| `TestimonialsSection` | `landing/TestimonialsSection.tsx` | Customer testimonials |
| `ExitIntentPopup` | `landing/ExitIntentPopup.tsx` | Exit-intent popup with email capture |

---

## 7. Admin Components

The admin dashboard is the largest component section (50+ files).

### Core Admin

| Component | Description |
|-----------|-------------|
| `AdminSidebar` | Navigation sidebar with tabs |
| `AdminHeader` | Top bar with user info |
| `ProtectedRoute` | Auth guard HOC - redirects to /login if unauthenticated |
| `RealtimeStatus` | Shows realtime connection status |
| `PWAInstallPrompt` | Progressive Web App install button |
| `PushNotificationSetup` | Push notification permission UI |

### Quote Management

| Component | Description |
|-----------|-------------|
| `QuoteRow` | Table row for a single quote |
| `QuoteDetailsDialog` | Full quote details modal |
| `QuoteResponseDialog` | Send quote response to customer |
| `QuoteFilters` | Filter quotes by status, service, date, etc. |
| `SendReminderDialog` | Send reminder email/SMS |
| `CompleteBookingDialog` | Mark booking as completed |
| `ReviewRequestDialog` | Send review request |

### Contact Management

| Component | Description |
|-----------|-------------|
| `ContactsTable` | Contact submissions table |
| `ContactFilters` | Filter contacts |
| `ContactDetailsDialog` | Contact details modal |

### Blog Management

| Component | Description |
|-----------|-------------|
| `BlogsTable` | Blog posts listing table |
| `BlogEditor` | Rich text editor (TipTap) for creating/editing posts |

### Analytics

| Component | Description |
|-----------|-------------|
| `StatCard` | Individual stat display card |
| `RevenueStats` | Revenue breakdown by period |
| `DateRangePicker` | Date range selection for filtering |

### Marketing

| Component | Description |
|-----------|-------------|
| `marketing/MarketingDashboard` | Campaign overview |
| `marketing/CampaignComposer` | Create/edit email campaigns |
| `marketing/AudienceManager` | Manage email audiences |
| `marketing/CampaignHistory` | Past campaign performance |
| `EmailSubscribersTable` | Newsletter subscriber list |

### Common Admin UI

| Component | Description |
|-----------|-------------|
| `SearchBar` | Global search input |
| `SortDropdown` | Sort options dropdown |
| `FilterDropdown` | Filter options dropdown |

---

## 8. Service Page Components

| Component | File | Description |
|-----------|------|-------------|
| `ServiceHero` | `services/ServiceHero.tsx` | Hero section with service-specific image |
| `ContentBlock` | `services/ContentBlock.tsx` | Text + image content block |
| `ProcessSteps` | `services/ProcessSteps.tsx` | Step-by-step process visualization |
| `FleetGrid` | `services/FleetGrid.tsx` | Available vehicles for service |

---

## 9. Blog Components

| Component | File | Description |
|-----------|------|-------------|
| `ViewTracker` | `blog/ViewTracker.tsx` | Tracks and increments blog post views |
| `RelatedPosts` | `blog/RelatedPosts.tsx` | Shows related blog posts |

---

## 10. Maps Components

### `AddressAutocomplete`
- **File:** `maps/AddressAutocomplete.tsx`
- **Props:** `{ id?, name?, placeholder?, defaultValue?, required?, onAddressSelect, className? }`
- **Hook:** `useGoogleAutocomplete`
- **Features:** Google Places autocomplete, error tooltip, loading spinner, no results message
- **Config:** Restricted to Australia ('au'), debounced (500ms), session token optimization

---

## 11. Contact Components

### `ContactForm`
- **File:** `contact/ContactForm.tsx`
- **Type:** Client Component
- **State:** Form inputs, loading, errors
- **Features:** 4 info cards (phone, email, location, hours), glass-effect design, Zod validation

### `ServiceAreas`
- **File:** `contact/ServiceAreas.tsx`
- **Purpose:** Displays service coverage areas

---

## 12. About Components

| Component | Description |
|-----------|-------------|
| `AboutHero` | About page hero banner |
| `AboutContent` | Main about content |
| `WhyChooseUs` | Value proposition section |
| `OurChauffeurs` | Chauffeur team showcase |
| `OurHistory` | Company history |
| `Timeline` | Company timeline visualization |
| `ReadyToBook` | CTA section |

---

## 13. Component Tree

```
App Root
├── ConditionalLayout
│   ├── Navbar (desktop dropdown, mobile overlay)
│   ├── Page Content
│   │   ├── Home: HeroSection → BookingWidget → FourPillars → ServicesGrid → VehicleFleet → Reviews → FAQ
│   │   ├── Booking: BookingForm → [ServiceType, Vehicle, Contact, Location, DateTime, ReturnTrip, Airport, Instructions]
│   │   ├── Admin: ProtectedRoute → AdminSidebar + AdminHeader + [Quotes | Contacts | Blogs | Marketing]
│   │   ├── Services: ServiceHero → ContentBlock → ProcessSteps → FleetGrid
│   │   ├── Blog: ViewTracker + Content + RelatedPosts
│   │   └── Landing: LandingPageLayout → LandingPageHero + LandingPageForm + USP + Testimonials
│   └── Footer
├── FloatingContactButton (global)
├── LiveBookingNotification (global)
└── ExitIntentPopup (landing pages)
```
