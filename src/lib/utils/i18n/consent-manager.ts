// src/lib/tracking/utils/consent-manager.ts
export class ConsentManager {
  private static readonly CONSENT_KEY = '';
  private static readonly CONSENT_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 year

  static async checkConsent(customCheck?: () => boolean | Promise<boolean>): Promise<boolean> {
    // First check custom consent function if provided
    if (customCheck) {
      try {
        return await customCheck();
      } catch (e) {
        console.error('Custom consent check failed:', e);
        return false;
      }
    }

    // Check stored consent
    const storedConsent = this.getStoredConsent();
    if (storedConsent !== null) {
      return storedConsent;
    }

    // Check for common consent management platforms
    return this.checkConsentManagementPlatforms();
  }

  static grantConsent(): void {
    try {
      const expiry = Date.now() + this.CONSENT_DURATION;
      localStorage.setItem(this.CONSENT_KEY, JSON.stringify({ granted: true, expiry }));
      
      // Notify Facebook Pixel
      if (typeof window.fbq === 'function') {
        window.fbq('consent', 'grant');
      }
    } catch (e) {
      console.error('Failed to store consent:', e);
    }
  }

  static revokeConsent(): void {
    try {
      localStorage.removeItem(this.CONSENT_KEY);
      
      // Notify Facebook Pixel
      if (typeof window.fbq === 'function') {
        window.fbq('consent', 'revoke');
      }
    } catch (e) {
      console.error('Failed to revoke consent:', e);
    }
  }

  private static getStoredConsent(): boolean | null {
    try {
      const stored = localStorage.getItem(this.CONSENT_KEY);
      if (!stored) return null;

      const { granted, expiry } = JSON.parse(stored);
      if (Date.now() > expiry) {
        localStorage.removeItem(this.CONSENT_KEY);
        return null;
      }

      return granted;
    } catch (e) {
      return null;
    }
  }

  private static checkConsentManagementPlatforms(): boolean {
    // Check for common CMP implementations
    const w = window as any;

    // OneTrust
    if (w.OneTrust?.getConsentModel) {
      const consent = w.OneTrust.getConsentModel();
      return consent?.social_media || consent?.targeting_cookies || true;
    }

    // Cookiebot
    if (w.Cookiebot?.consent) {
      return w.Cookiebot.consent.marketing || true;
    }

    // Google Consent Mode
    if (w.gtag && typeof w.gtag === 'function') {
      // Implementation depends on your Google Consent setup
      return true;
    }

    // Default to true if no CMP is detected (you might want to change this)
    return true;
  }
}