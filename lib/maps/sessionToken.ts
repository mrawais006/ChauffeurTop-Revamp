/**
 * Session Token Manager (UUID v4)
 * 
 * CRITICAL FOR COST OPTIMIZATION:
 * Groups multiple autocomplete requests into a single billing session
 * 
 * How it works:
 * 1. User starts typing → getOrCreateToken() creates new session with UUID v4
 * 2. User keeps typing → same token reused (all requests billed as ONE session)
 * 3. User selects place → completeSession() clears token
 * 4. Next search → new session starts
 * 
 * Savings: ~$2.83/1000 requests compared to per-request billing
 * 
 * IMPORTANT: Session tokens only work with AutocompleteService.getPlacePredictions()
 * They do NOT work with the Autocomplete widget.
 */

// Generate UUID v4 (browser-compatible)
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class SessionTokenManager {
  private static instance: SessionTokenManager;
  private currentToken: google.maps.places.AutocompleteSessionToken | null = null;
  private currentTokenId: string | null = null; // For logging
  private sessionCount = 0;

  static getInstance(): SessionTokenManager {
    if (!SessionTokenManager.instance) {
      SessionTokenManager.instance = new SessionTokenManager();
    }
    return SessionTokenManager.instance;
  }

  /**
   * Get current session token or create a new one
   * Uses UUID v4 for proper session tracking
   */
  getOrCreateToken(): google.maps.places.AutocompleteSessionToken | null {
    if (typeof window === 'undefined' || !window.google?.maps?.places) {
      console.warn('[SessionToken] Google Maps Places API not available');
      return null;
    }

    // Return existing token if we have one (reuse within session)
    if (this.currentToken) {
      return this.currentToken;
    }

    // Create new session token
    try {
      this.currentToken = new google.maps.places.AutocompleteSessionToken();
      this.currentTokenId = generateUUID();
      this.sessionCount++;
      console.log(`[SessionToken] New session created: ${this.currentTokenId.substring(0, 8)}... (#${this.sessionCount})`);
      return this.currentToken;
    } catch (error) {
      console.error('[SessionToken] Failed to create session token:', error);
      return null;
    }
  }

  /**
   * Complete the current session (call AFTER place selection)
   * This clears the token so the next search starts a new billing session
   */
  completeSession(): void {
    if (this.currentToken) {
      console.log(`[SessionToken] Session completed: ${this.currentTokenId?.substring(0, 8)}... (#${this.sessionCount})`);
      this.currentToken = null;
      this.currentTokenId = null;
    }
  }

  /**
   * Reset session without logging (for cleanup on component unmount)
   */
  resetSession(): void {
    this.currentToken = null;
    this.currentTokenId = null;
  }

  /**
   * Check if there's an active session
   */
  hasActiveSession(): boolean {
    return this.currentToken !== null;
  }

  /**
   * Get session metrics for monitoring
   */
  getMetrics() {
    return {
      totalSessions: this.sessionCount,
      hasActiveSession: this.hasActiveSession(),
      currentTokenId: this.currentTokenId?.substring(0, 8) || null,
    };
  }
}

export const sessionTokenManager = SessionTokenManager.getInstance();
