/**
 * Analytics Utility for GA4 Event Tracking
 * 
 * Provides type-safe event tracking throughout the application.
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

/**
 * Track a custom event in Google Analytics 4
 */
export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (window.gtag) {
      window.gtag('event', eventName, params);
    }
    
    // Also push to dataLayer for GTM
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// ============================================
// Form Events
// ============================================

export function trackFormStart(formName: string, location: string): void {
  trackEvent('form_start', {
    form_name: formName,
    form_location: location,
  });
}

export function trackFormFieldCompleted(
  formName: string,
  fieldName: string,
  location: string
): void {
  trackEvent('form_field_completed', {
    form_name: formName,
    field_name: fieldName,
    form_location: location,
  });
}

export function trackFormSubmit(
  formName: string,
  location: string,
  serviceType?: string
): void {
  trackEvent('form_submit', {
    form_name: formName,
    form_location: location,
    service_type: serviceType,
  });
}

export function trackFormError(
  formName: string,
  errorType: string,
  location: string
): void {
  trackEvent('form_error', {
    form_name: formName,
    error_type: errorType,
    form_location: location,
  });
}

// ============================================
// CTA Events
// ============================================

export function trackCTAClick(
  ctaName: string,
  location: string,
  destination?: string
): void {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: location,
    cta_destination: destination,
  });
}

export function trackScrollToForm(location: string): void {
  trackEvent('scroll_to_form', {
    trigger_location: location,
  });
}

// ============================================
// Phone & Communication Events
// ============================================

export function trackPhoneClick(location: string): void {
  trackEvent('phone_click', {
    click_location: location,
  });
}

export function trackWhatsAppClick(location: string): void {
  trackEvent('whatsapp_click', {
    click_location: location,
  });
}

// ============================================
// Exit Intent Events
// ============================================

export function trackExitIntentShown(): void {
  trackEvent('exit_intent_shown');
}

export function trackExitIntentConverted(email: string): void {
  trackEvent('exit_intent_converted', {
    has_email: !!email,
  });
}

export function trackExitIntentDismissed(): void {
  trackEvent('exit_intent_dismissed');
}

// ============================================
// Scroll Depth Tracking
// ============================================

let scrollDepthTracked: Record<number, boolean> = {};

export function trackScrollDepth(depth: number): void {
  if (scrollDepthTracked[depth]) return;
  
  scrollDepthTracked[depth] = true;
  trackEvent('scroll_depth', {
    percent: depth,
  });
}

export function initScrollDepthTracking(): () => void {
  if (typeof window === 'undefined') return () => {};
  
  scrollDepthTracked = {};
  
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
    
    [25, 50, 75, 100].forEach((threshold) => {
      if (scrollPercent >= threshold && !scrollDepthTracked[threshold]) {
        trackScrollDepth(threshold);
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

// ============================================
// Landing Page Events
// ============================================

export function trackLandingPageView(
  pageName: string,
  source?: string,
  campaign?: string
): void {
  trackEvent('landing_page_view', {
    page_name: pageName,
    traffic_source: source,
    campaign: campaign,
  });
}

export function trackVehicleSelection(
  vehicleType: string,
  location: string
): void {
  trackEvent('vehicle_selection', {
    vehicle_type: vehicleType,
    selection_location: location,
  });
}

export function trackServiceSelection(
  serviceType: string,
  location: string
): void {
  trackEvent('service_selection', {
    service_type: serviceType,
    selection_location: location,
  });
}

// ============================================
// A/B Testing Events
// ============================================

export function trackABVariant(
  testName: string,
  variantName: string
): void {
  trackEvent('ab_test_exposure', {
    test_name: testName,
    variant_name: variantName,
  });
}

// ============================================
// Conversion Events
// ============================================

export function trackQuoteSubmitted(
  serviceType: string,
  vehicleType: string,
  source: string
): void {
  trackEvent('quote_submitted', {
    service_type: serviceType,
    vehicle_type: vehicleType,
    lead_source: source,
  });
}

export function trackBookingConfirmed(
  bookingId: string,
  value?: number
): void {
  trackEvent('booking_confirmed', {
    booking_id: bookingId,
    booking_value: value,
  });
}
