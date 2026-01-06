/**
 * Session Token Manager
 * 
 * CRITICAL FOR COST OPTIMIZATION:
 * Groups multiple autocomplete requests into a single billing session
 * 
 * How it works:
 * 1. User starts typing → getToken() creates new session
 * 2. User keeps typing → same token reused (all FREE in one session)
 * 3. User selects place → completeSession() ends session
 * 4. Next search → new session starts
 * 
 * Savings: ~$2.83/1000 requests compared to per-request billing
 */

class SessionTokenManager {
  private static instance: SessionTokenManager;
  private currentToken: google.maps.places.AutocompleteSessionToken | null = null;
  private sessionCount = 0;

  static getInstance(): SessionTokenManager {
    if (!SessionTokenManager.instance) {
      SessionTokenManager.instance = new SessionTokenManager();
    }
    return SessionTokenManager.instance;
  }

  /**
   * Get current session token or create a new one
   */
  getToken(): google.maps.places.AutocompleteSessionToken | null {
    if (typeof window === 'undefined' || !window.google?.maps?.places) {
      return null;
    }

    if (!this.currentToken) {
      this.currentToken = new google.maps.places.AutocompleteSessionToken();
      this.sessionCount++;
      console.log(`[SessionToken] New session created (#${this.sessionCount})`);
    }

    return this.currentToken;
  }

  /**
   * Complete the current session (call after place selection)
   */
  completeSession(): void {
    if (this.currentToken) {
      console.log(`[SessionToken] Session completed (#${this.sessionCount})`);
      this.currentToken = null;
    }
  }

  /**
   * Get session metrics for monitoring
   */
  getMetrics() {
    return {
      totalSessions: this.sessionCount,
      hasActiveSession: !!this.currentToken,
    };
  }
}

export const sessionTokenManager = SessionTokenManager.getInstance();

