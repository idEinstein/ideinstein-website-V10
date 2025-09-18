'use client';

import { useState, useEffect, useCallback } from 'react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentHook {
  preferences: CookiePreferences;
  hasConsent: boolean;
  updatePreferences: (newPreferences: Partial<CookiePreferences>) => void;
  resetConsent: () => void;
  canTrack: (category: keyof CookiePreferences) => boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false
};

export function useCookieConsent(): CookieConsentHook {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasConsent, setHasConsent] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    requestIdleCallback(() => {
      try {
        const stored = localStorage.getItem('cookie-consent');
        const timestamp = localStorage.getItem('cookie-consent-timestamp');
        
        if (stored && timestamp) {
          const consentData = JSON.parse(stored);
          const consentTime = parseInt(timestamp);
          const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
          
          if (consentTime > thirtyDaysAgo) {
            setPreferences(consentData);
            setHasConsent(true);
          }
        }
      } catch (error) {
        console.warn('Error loading cookie preferences:', error);
      }
    });
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<CookiePreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPreferences, necessary: true };
      
      // Store in localStorage
      try {
        localStorage.setItem('cookie-consent', JSON.stringify(updated));
        localStorage.setItem('cookie-consent-timestamp', Date.now().toString());
      } catch (error) {
        console.warn('Error saving cookie preferences:', error);
      }
      
      return updated;
    });
    setHasConsent(true);
  }, []);

  const resetConsent = useCallback(() => {
    try {
      localStorage.removeItem('cookie-consent');
      localStorage.removeItem('cookie-consent-timestamp');
    } catch (error) {
      console.warn('Error resetting cookie consent:', error);
    }
    
    setPreferences(defaultPreferences);
    setHasConsent(false);
  }, []);

  const canTrack = useCallback((category: keyof CookiePreferences) => {
    return hasConsent && preferences[category];
  }, [hasConsent, preferences]);

  return {
    preferences,
    hasConsent,
    updatePreferences,
    resetConsent,
    canTrack
  };
}

// Utility functions for cookie management
export const CookieUtils = {
  /**
   * Check if a specific tracking category is allowed
   */
  canTrack: (category: keyof CookiePreferences): boolean => {
    try {
      const stored = localStorage.getItem('cookie-consent');
      if (!stored) return false;
      
      const preferences = JSON.parse(stored);
      return preferences[category] === true;
    } catch {
      return false;
    }
  },

  /**
   * Get current consent timestamp
   */
  getConsentTimestamp: (): number | null => {
    try {
      const timestamp = localStorage.getItem('cookie-consent-timestamp');
      return timestamp ? parseInt(timestamp) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if consent is still valid (within 30 days)
   */
  isConsentValid: (): boolean => {
    const timestamp = CookieUtils.getConsentTimestamp();
    if (!timestamp) return false;
    
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return timestamp > thirtyDaysAgo;
  },

  /**
   * Trigger Google Analytics consent update
   */
  updateGAConsent: (hasAnalyticsConsent: boolean): void => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: hasAnalyticsConsent ? 'granted' : 'denied',
        ad_storage: hasAnalyticsConsent ? 'granted' : 'denied'
      });
    }
  }
};

export type { CookiePreferences, CookieConsentHook };