"use client";

import { useEffect } from "react";
import { saveUTMParams, saveLandingPageData } from "@/lib/formPrePopulation";
import { trackLandingPageView, trackABVariant } from "@/lib/analytics";

interface UTMCaptureOptions {
  serviceType?: string;
  source?: string;
  pagePath?: string;
  variant?: string;
}

/**
 * Hook to capture UTM parameters and track landing page views
 * Call this in landing page components to capture attribution data
 */
export function useUTMCapture(options: UTMCaptureOptions = {}) {
  const { serviceType, source, pagePath, variant } = options;

  useEffect(() => {
    // Capture UTM params from URL
    saveUTMParams();

    // If this is a landing page, save the landing page data
    if (serviceType && source && pagePath) {
      saveLandingPageData(serviceType, source, pagePath);
    }

    // Track the page view
    if (pagePath) {
      const urlParams = new URLSearchParams(window.location.search);
      trackLandingPageView(
        pagePath,
        urlParams.get("utm_source") || undefined,
        urlParams.get("utm_campaign") || undefined
      );
    }

    // Track A/B variant if specified
    if (variant && pagePath) {
      trackABVariant(pagePath, variant);
    }
  }, [serviceType, source, pagePath, variant]);
}

/**
 * Hook specifically for A/B test variant pages
 */
export function useABVariant(testName: string, variantName: string) {
  useEffect(() => {
    trackABVariant(testName, variantName);
    
    // Store variant in sessionStorage for conversion attribution
    sessionStorage.setItem(`ab_${testName}`, variantName);
  }, [testName, variantName]);

  return variantName;
}

/**
 * Get the current A/B variant for a test
 */
export function getABVariant(testName: string): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(`ab_${testName}`);
}
