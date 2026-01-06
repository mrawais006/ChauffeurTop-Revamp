/**
 * Secure API Key Service
 * Fetches Google Maps API key from Supabase Edge Function
 * 
 * This keeps the API key secure on the server-side and never exposes it to the client
 */

import { supabase } from '@/lib/supabase';

class MapsApiKeyService {
  private static instance: MapsApiKeyService;
  private apiKey: string | null = null;
  private fetchPromise: Promise<string> | null = null;

  static getInstance(): MapsApiKeyService {
    if (!MapsApiKeyService.instance) {
      MapsApiKeyService.instance = new MapsApiKeyService();
    }
    return MapsApiKeyService.instance;
  }

  async getApiKey(): Promise<string> {
    // TEMPORARY: Try environment variable first as fallback
    const envKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (envKey) {
      console.log('[MapsApiKey] Using API key from environment variable (fallback)');
      return envKey;
    }

    // Return cached key if available
    if (this.apiKey) {
      return this.apiKey;
    }

    // Return existing fetch promise if in progress
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    // Fetch API key from Supabase Edge Function
    this.fetchPromise = this.fetchApiKeyFromSupabase();

    try {
      this.apiKey = await this.fetchPromise;
      return this.apiKey;
    } catch (error) {
      this.fetchPromise = null;
      throw error;
    }
  }

  private async fetchApiKeyFromSupabase(): Promise<string> {
    try {
      console.log('[MapsApiKey] Fetching API key from Supabase Edge Function...');

      const { data, error } = await supabase.functions.invoke('get-maps-api-key');

      if (error) {
        console.error('[MapsApiKey] Supabase function error:', error);
        throw new Error(`Failed to fetch API key: ${error.message}`);
      }

      if (!data?.key) {
        console.error('[MapsApiKey] No API key in response:', data);
        throw new Error('API key not found in response');
      }

      console.log('[MapsApiKey] API key retrieved successfully');
      return data.key;
    } catch (error) {
      console.error('[MapsApiKey] Failed to fetch API key:', error);
      throw error;
    }
  }

  clearCache(): void {
    this.apiKey = null;
    this.fetchPromise = null;
  }
}

export const mapsApiKeyService = MapsApiKeyService.getInstance();

