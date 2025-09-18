'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Settings, Shield, BarChart3 } from 'lucide-react';

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
    title: 'Cookie Preferences',
    description: 'We use cookies to enhance your browsing experience and analyze our traffic.',
    acceptAll: 'Accept All',
    rejectAll: 'Reject All',
    customize: 'Customize',
    savePreferences: 'Save Preferences',
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

  const t = translations[language];

  // Non-blocking initialization
  useEffect(() => {
    requestIdleCallback(() => {
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
    });
  }, []);

  // Apply cookie preferences (non-blocking)
  useEffect(() => {
    if (!hasInteracted) return;

    requestIdleCallback(() => {
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
    });
  }, [preferences, hasInteracted]);

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

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed bottom-0 left-0 right-0 p-4 md:bottom-4 md:left-4 md:right-auto md:max-w-md">
        <Card className="shadow-xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t.title}
              </CardTitle>
              {showDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardDescription className="text-sm">
              {t.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            {!showDetails ? (
              <div className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button 
                    onClick={handleAcceptAll}
                    className="flex-1"
                    size="sm"
                  >
                    {t.acceptAll}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleRejectAll}
                    className="flex-1"
                    size="sm"
                  >
                    {t.rejectAll}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetails(true)}
                  className="w-full"
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t.customize}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Tabs defaultValue="cookies" className="w-full">
                  <TabsList className="grid grid-cols-1 w-full">
                    <TabsTrigger value="cookies" className="text-xs">Cookie Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="cookies" className="space-y-3 mt-3">
                    {/* Necessary Cookies */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{t.necessary.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {t.necessary.always}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t.necessary.description}
                        </p>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart3 className="h-4 w-4" />
                          <h4 className="font-medium text-sm">{t.analytics.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t.analytics.description}
                        </p>
                      </div>
                      <Button
                        variant={preferences.analytics ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTogglePreference('analytics')}
                        className="ml-3"
                      >
                        {preferences.analytics ? 'ON' : 'OFF'}
                      </Button>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{t.marketing.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {t.marketing.description}
                        </p>
                      </div>
                      <Button
                        variant={preferences.marketing ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTogglePreference('marketing')}
                        className="ml-3"
                      >
                        {preferences.marketing ? 'ON' : 'OFF'}
                      </Button>
                    </div>

                    {/* Preference Cookies */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{t.preferences.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {t.preferences.description}
                        </p>
                      </div>
                      <Button
                        variant={preferences.preferences ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTogglePreference('preferences')}
                        className="ml-3"
                      >
                        {preferences.preferences ? 'ON' : 'OFF'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col gap-2">
                  <Button onClick={handleSavePreferences} size="sm">
                    {t.savePreferences}
                  </Button>
                  <div className="flex gap-2 text-xs">
                    <a href="/privacy" className="text-primary hover:underline">
                      {t.privacyPolicy}
                    </a>
                    <span className="text-muted-foreground">•</span>
                    <a href="/privacy#cookies" className="text-primary hover:underline">
                      {t.cookiePolicy}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Remove the global gtag declaration since it's already defined in lib/analytics.ts