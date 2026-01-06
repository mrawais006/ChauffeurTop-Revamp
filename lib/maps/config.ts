/**
 * Google Maps API Configuration
 * 
 * COST OPTIMIZATION:
 * - Locked version for stability and predictable billing
 * - Only 'places' library loaded
 * - BASIC_FIELDS only to stay in FREE tier ($0 with $200 credit)
 */

export const MAPS_CONFIG = {
  version: '3.58', // Locked version - update quarterly
  libraries: ['places'] as const,
  region: 'AU',
  language: 'en',
};

/**
 * CRITICAL: ONLY use Basic SKU fields to stay FREE
 * 
 * Field Tiers:
 * - BASIC: FREE with $200 monthly credit
 * - CONTACT: $3/1000 requests
 * - ATMOSPHERE: $5/1000 requests
 * - ADVANCED (geometry, address_components): $17/1000 requests ⚠️
 */
export const BASIC_AUTOCOMPLETE_FIELDS = [
  'formatted_address', // ✅ FREE
  'name',             // ✅ FREE
  'place_id',         // ✅ FREE
] as const;

/**
 * DO NOT USE - Triggers expensive Advanced pricing
 */
export const EXPENSIVE_FIELDS_AVOID = [
  'geometry',           // ❌ $17/1000
  'address_components', // ❌ $17/1000
  'reviews',
  'rating',
] as const;

/**
 * Geographic bounds for Victoria and South Australia
 */
export const AUSTRALIA_BOUNDS = {
  south: -39.5,  // Southern Victoria
  west: 134.0,   // Western SA
  north: -34.0,  // Northern SA
  east: 150.0,   // Eastern Victoria
};

/**
 * Major cities for location bias
 */
export const MAJOR_CITIES = {
  melbourne: { lat: -37.8136, lng: 144.9631 },
  adelaide: { lat: -34.9285, lng: 138.6007 },
  geelong: { lat: -38.1499, lng: 144.3617 },
  ballarat: { lat: -37.5622, lng: 143.8503 },
} as const;

/**
 * Default autocomplete options (cost-optimized)
 */
export const DEFAULT_AUTOCOMPLETE_OPTIONS: google.maps.places.AutocompleteOptions = {
  componentRestrictions: { country: 'au' },
  types: ['geocode', 'establishment'],
  fields: BASIC_AUTOCOMPLETE_FIELDS as any,
};

/**
 * Create geographic bounds for better results
 */
export function createAustraliaBounds(): google.maps.LatLngBounds | undefined {
  if (typeof window === 'undefined' || !window.google?.maps) {
    return undefined;
  }

  return new google.maps.LatLngBounds(
    new google.maps.LatLng(AUSTRALIA_BOUNDS.south, AUSTRALIA_BOUNDS.west),
    new google.maps.LatLng(AUSTRALIA_BOUNDS.north, AUSTRALIA_BOUNDS.east)
  );
}

