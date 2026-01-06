/**
 * Google Maps API Loader
 * Handles loading and initialization of Google Maps JavaScript API
 * Uses the new functional API (v3.58+)
 */

import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MAPS_CONFIG } from './config';
import { mapsApiKeyService } from './apiKey';

class MapsLoader {
  private static instance: MapsLoader;
  private loadPromise: Promise<void> | null = null;
  private isLoading = false;
  private isInitialized = false;

  static getInstance(): MapsLoader {
    if (!MapsLoader.instance) {
      MapsLoader.instance = new MapsLoader();
    }
    return MapsLoader.instance;
  }

  async loadGoogleMapsApi(): Promise<void> {
    // Already loaded
    if (typeof window !== 'undefined' && window.google?.maps?.places) {
      console.log('[MapsLoader] API already loaded');
      return Promise.resolve();
    }

    // Already loading
    if (this.loadPromise && this.isLoading) {
      console.log('[MapsLoader] Already loading, returning existing promise');
      return this.loadPromise;
    }

    console.log('[MapsLoader] Starting Maps API load');
    this.isLoading = true;

    // Load the API
    this.loadPromise = this.loadMapsAPI()
      .catch((error) => {
        console.error('[MapsLoader] Failed to load Maps API:', error);
        this.isLoading = false;
        this.loadPromise = null;
        throw error;
      })
      .finally(() => {
        this.isLoading = false;
      });

    return this.loadPromise;
  }

  private async loadMapsAPI(): Promise<void> {
    try {
      // Get API key from Supabase
      const apiKey = await mapsApiKeyService.getApiKey();
      
      // Set options for the Google Maps loader (only once)
      if (!this.isInitialized) {
        setOptions({
          apiKey,
          version: MAPS_CONFIG.version,
          region: MAPS_CONFIG.region,
          language: MAPS_CONFIG.language,
        });
        this.isInitialized = true;
        console.log('[MapsLoader] Loader options set');
      }

      // Import the Places library
      console.log('[MapsLoader] Importing Places library...');
      await importLibrary('places');
      console.log('[MapsLoader] Places library loaded successfully');

      // Wait for Places API to be ready
      return new Promise<void>((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (window.google?.maps?.places) {
            clearInterval(checkInterval);
            console.log('[MapsLoader] Places API ready');
            resolve();
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Timeout waiting for Places API'));
        }, 10000);
      });
    } catch (error) {
      console.error('[MapsLoader] Error loading Maps API:', error);
      throw error;
    }
  }

  isApiLoaded(): boolean {
    return !!(typeof window !== 'undefined' && window.google?.maps?.places);
  }
}

export const mapsLoader = MapsLoader.getInstance();

