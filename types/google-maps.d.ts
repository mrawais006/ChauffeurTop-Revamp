// Extend Window interface for Google Maps
declare global {
  interface Window {
    google?: typeof google;
    googleMapsLoaded?: boolean;
    googleMapsLoadAttempted?: boolean;
    initGoogleMapsCallback?: () => void;
  }
}

export interface GeolocationPosition {
  lat: number;
  lng: number;
}

export interface AutocompletePlace {
  formatted_address?: string;
  name?: string;
  place_id?: string;
}

export {};

