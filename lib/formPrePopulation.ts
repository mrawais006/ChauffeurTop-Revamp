/**
 * Form Pre-Population Utility
 * 
 * Manages form data in sessionStorage for pre-populating the booking form
 * from various entry points (homepage widget, fleet page, service pages, landing pages).
 */

const STORAGE_KEY = 'chauffeur_form_data';
const STORAGE_EXPIRY_KEY = 'chauffeur_form_data_expiry';
const EXPIRY_DURATION = 30 * 60 * 1000; // 30 minutes

export interface PrePopulationData {
  // Location & Trip Details
  pickup?: string;
  destination?: string;
  date?: string;
  time?: string;
  passengers?: number;
  
  // Vehicle & Service
  vehicle_type?: string;
  service_type?: string;
  
  // Source Tracking
  source?: string;
  source_page?: string;
  
  // UTM Parameters
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  
  // Metadata
  timestamp?: number;
}

/**
 * Save form data to sessionStorage
 */
export function saveFormData(data: Partial<PrePopulationData>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existingData = getFormData() || {};
    const mergedData: PrePopulationData = {
      ...existingData,
      ...data,
      timestamp: Date.now(),
    };
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
    sessionStorage.setItem(STORAGE_EXPIRY_KEY, String(Date.now() + EXPIRY_DURATION));
  } catch (error) {
    console.error('Error saving form data to sessionStorage:', error);
  }
}

/**
 * Get form data from sessionStorage
 * Returns null if data is expired or doesn't exist
 */
export function getFormData(): PrePopulationData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const expiry = sessionStorage.getItem(STORAGE_EXPIRY_KEY);
    
    // Check if data has expired
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      clearFormData();
      return null;
    }
    
    const data = sessionStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    return JSON.parse(data) as PrePopulationData;
  } catch (error) {
    console.error('Error reading form data from sessionStorage:', error);
    return null;
  }
}

/**
 * Clear form data from sessionStorage
 */
export function clearFormData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_EXPIRY_KEY);
  } catch (error) {
    console.error('Error clearing form data from sessionStorage:', error);
  }
}

/**
 * Check if there's pre-populated data available
 */
export function hasFormData(): boolean {
  return getFormData() !== null;
}

/**
 * Get the source page URL for redirect on session expiry
 */
export function getSourcePage(): string | null {
  const data = getFormData();
  return data?.source_page || null;
}

/**
 * Capture UTM parameters from URL
 */
export function captureUTMParams(): Partial<PrePopulationData> {
  if (typeof window === 'undefined') return {};
  
  try {
    const params = new URLSearchParams(window.location.search);
    const utmData: Partial<PrePopulationData> = {};
    
    const utm_source = params.get('utm_source');
    const utm_medium = params.get('utm_medium');
    const utm_campaign = params.get('utm_campaign');
    const utm_content = params.get('utm_content');
    const utm_term = params.get('utm_term');
    const gclid = params.get('gclid');
    
    if (utm_source) utmData.utm_source = utm_source;
    if (utm_medium) utmData.utm_medium = utm_medium;
    if (utm_campaign) utmData.utm_campaign = utm_campaign;
    if (utm_content) utmData.utm_content = utm_content;
    if (utm_term) utmData.utm_term = utm_term;
    if (gclid) utmData.gclid = gclid;
    
    return utmData;
  } catch (error) {
    console.error('Error capturing UTM params:', error);
    return {};
  }
}

/**
 * Save UTM parameters from current URL to sessionStorage
 */
export function saveUTMParams(): void {
  const utmData = captureUTMParams();
  if (Object.keys(utmData).length > 0) {
    saveFormData(utmData);
  }
}

/**
 * Pre-populate form for vehicle selection
 */
export function saveVehicleSelection(vehicleType: string, sourcePage: string = 'fleet'): void {
  saveFormData({
    vehicle_type: vehicleType,
    source: 'vehicle_selection',
    source_page: sourcePage,
  });
}

/**
 * Pre-populate form for service selection
 */
export function saveServiceSelection(serviceType: string, sourcePage: string): void {
  saveFormData({
    service_type: serviceType,
    source: 'service_selection',
    source_page: sourcePage,
  });
}

/**
 * Pre-populate form from homepage widget
 */
export function saveWidgetData(data: {
  pickup?: string;
  destination?: string;
  date?: string;
  time?: string;
  passengers?: number;
}): void {
  saveFormData({
    ...data,
    source: 'homepage_widget',
    source_page: '/',
  });
}

/**
 * Pre-populate form from landing page
 */
export function saveLandingPageData(
  serviceType: string,
  source: string,
  sourcePage: string
): void {
  // First capture any UTM params
  const utmData = captureUTMParams();
  
  saveFormData({
    service_type: serviceType,
    source: source,
    source_page: sourcePage,
    ...utmData,
  });
}

/**
 * Get lead source data for submission
 */
export function getLeadSourceData(): Partial<PrePopulationData> {
  const data = getFormData();
  if (!data) return {};
  
  return {
    source: data.source,
    source_page: data.source_page,
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
    utm_content: data.utm_content,
    utm_term: data.utm_term,
    gclid: data.gclid,
  };
}
