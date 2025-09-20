'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Settings, Shield, BarChart3, Cookie, Eye, Target, Sliders } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentProps {
  language?: 'en' | 'de';
}

const translations = {
  en: {
    title: 'We value your privacy',
    description: 'We use cookies to enhance your experience, analyze site performance, and deliver personalized content.',
    acceptAll: 'Accept All Cookies',
    rejectAll: 'Reject Optional',
    customize: 'Manage Preferences',
    savePreferences: 'Save My Choices',
    close: 'Close',
    necessary: {
      title: 'Necessary Cookies',
      description: 'Essential for website functionality and security. Cannot be disabled.',
      always: 'Always Active'
    },
    analytics: {
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website (Google Analytics).',
      toggle: 'Analytics'
    },
    marketing: {
      title: 'Marketing Cookies',
      description: 'Used for advertising and remarketing purposes.',
      toggle: 'Marketing'
    },
    preferences: {
      title: 'Preference Cookies',
      description: 'Remember your settings and preferences.',
      toggle: 'Preferences'
    },
    privacyPolicy: 'Privacy Policy',
    cookiePolicy: 'Cookie Policy'
  },
  de: {
    title: 'Cookie-Einstellungen',
    description: 'Wir verwenden Cookies, um Ihr Browsing-Erlebnis zu verbessern und unseren Traffic zu analysieren.',
    acceptAll: 'Alle akzeptieren',
    rejectAll: 'Alle ablehnen',
    customize: 'Anpassen',
    savePreferences: 'Einstellungen speichern',
    close: 'Schließen',
    necessary: {
      title: 'Notwendige Cookies',
      description: 'Wesentlich für Website-Funktionalität und Sicherheit. Können nicht deaktiviert werden.',
      always: 'Immer aktiv'
    },
    analytics: {
      title: 'Analytische Cookies',
      description: 'Helfen uns zu verstehen, wie Besucher mit unserer Website interagieren (Google Analytics).',
      toggle: 'Analytik'
    },
    marketing: {
      title: 'Marketing-Cookies',
      description: 'Werden für Werbung und Remarketing-Zwecke verwendet.',
      toggle: 'Marketing'
    },
    preferences: {
      title: 'Präferenz-Cookies',
      description: 'Merken sich Ihre Einstellungen und Präferenzen.',
      toggle: 'Präferenzen'
    },
    privacyPolicy: 'Datenschutzerklärung',
    cookiePolicy: 'Cookie-Richtlinie'
  }
};

export default function CookieConsent({ language = 'en' }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be changed
    analytics: false,
    marketing: false,
    preferences: false
  });
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const t = translations[language];

  // Hydration-safe mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize cookie consent after mounting
  useEffect(() => {
    if (!isMounted) return;

    // Use setTimeout to avoid blocking the main thread
    const timeoutId = setTimeout(() => {
      try {
        const consent = localStorage.getItem('cookie-consent');
        const lastInteraction = localStorage.getItem('cookie-consent-timestamp');
        
        if (!consent || !lastInteraction) {
          setIsVisible(true);
          return;
        }

        const consentData = JSON.parse(consent);
        const timestamp = parseInt(lastInteraction);
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

        if (timestamp < thirtyDaysAgo) {
          setIsVisible(true);
        } else {
          setPreferences(consentData);
          setHasInteracted(true);
        }
      } catch (error) {
        console.warn('Cookie consent initialization error:', error);
        setIsVisible(true);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isMounted]);

  // Apply cookie preferences (hydration-safe)
  useEffect(() => {
    if (!hasInteracted || !isMounted) return;

    const timeoutId = setTimeout(() => {
      try {
        // Handle Google Analytics
        if (preferences.analytics) {
          // Enable GA if not already loaded
          if (typeof window !== 'undefined' && !window.gtag) {
            loadGoogleAnalytics();
          }
        } else {
          // Disable GA tracking
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', {
              analytics_storage: 'denied'
            });
          }
        }

        // Store preferences
        localStorage.setItem('cookie-consent', JSON.stringify(preferences));
        localStorage.setItem('cookie-consent-timestamp', Date.now().toString());
      } catch (error) {
        console.warn('Error applying cookie preferences:', error);
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [preferences, hasInteracted, isMounted]);

  const loadGoogleAnalytics = () => {
    // This will be implemented when GA_MEASUREMENT_ID is configured
    // For now, just set consent state
    if (typeof window !== 'undefined') {
      window.gtag?.('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setPreferences(newPreferences);
    setHasInteracted(true);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setPreferences(newPreferences);
    setHasInteracted(true);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    setHasInteracted(true);
    setIsVisible(false);
    setShowDetails(false);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot toggle necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm">
      <div className="fixed bottom-0 left-0 right-0 p-3 md:bottom-6 md:left-6 md:right-auto md:max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Cookie className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {t.description}
                  </p>
                </div>
              </div>
              {showDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!showDetails ? (
              <div className="space-y-4">
                {/* Primary Actions */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button 
                    onClick={handleAcceptAll}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                    size="default"
                  >
                    {t.acceptAll}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleRejectAll}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-xl transition-all duration-200"
                    size="default"
                  >
                    {t.rejectAll}
                  </Button>
                </div>
                
                {/* Secondary Action */}
                <Button
                  variant="ghost"
                  onClick={() => setShowDetails(true)}
                  className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-all duration-200"
                  size="default"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t.customize}
                </Button>
                
                {/* Privacy Links */}
                <div className="flex justify-center gap-4 text-xs text-gray-500 pt-2">
                  <a href="/privacy" className="hover:text-blue-600 transition-colors underline">
                    {t.privacyPolicy}
                  </a>
                  <span>•</span>
                  <a href="/privacy#cookies" className="hover:text-blue-600 transition-colors underline">
                    {t.cookiePolicy}
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Customize Your Experience</h4>
                  <p className="text-sm text-gray-600">Choose which cookies you'd like to allow</p>
                </div>

                <div className="space-y-4">
                  {/* Necessary Cookies */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold text-gray-900">{t.necessary.title}</h5>
                          <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">
                            {t.necessary.always}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {t.necessary.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-900">{t.analytics.title}</h5>
                          <button
                            onClick={() => handleTogglePreference('analytics')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {t.analytics.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Target className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-900">{t.marketing.title}</h5>
                          <button
                            onClick={() => handleTogglePreference('marketing')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              preferences.marketing ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {t.marketing.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preference Cookies */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sliders className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-900">{t.preferences.title}</h5>
                          <button
                            onClick={() => handleTogglePreference('preferences')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              preferences.preferences ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences.preferences ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {t.preferences.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-gray-100">
                  <Button 
                    onClick={handleSavePreferences} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                    size="default"
                  >
                    {t.savePreferences}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Remove the global gtag declaration since it's already defined in lib/analytics.ts