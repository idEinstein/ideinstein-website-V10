'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Settings, X } from 'lucide-react';
import Link from 'next/link';

interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    timestamp: 0
  });

  useEffect(() => {
    // Check existing consent
    const savedConsent = localStorage.getItem('gdpr-consent');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        // Check if consent is less than 1 year old
        if (Date.now() - parsed.timestamp < 365 * 24 * 60 * 60 * 1000) {
          setConsent(parsed);
          return;
        }
      } catch (error) {
        console.warn('Invalid consent data, showing banner');
      }
    }
    
    // Show banner if no valid consent
    setShowBanner(true);
  }, []);

  const saveConsent = (newConsent: Partial<CookieConsent>) => {
    const finalConsent = {
      ...consent,
      ...newConsent,
      essential: true, // Always true
      timestamp: Date.now()
    };
    
    setConsent(finalConsent);
    localStorage.setItem('gdpr-consent', JSON.stringify(finalConsent));
    
    // Set cookie for server-side access
    document.cookie = `gdpr-consent=${JSON.stringify(finalConsent)}; path=/; max-age=31536000; secure; samesite=strict`;
    
    setShowBanner(false);
    setShowSettings(false);
    
    // Initialize Google Analytics if consent given
    if (finalConsent.analytics && typeof window !== 'undefined') {
      // Initialize GA4 here when ready for production
      console.log('Analytics consent granted - GA4 will be initialized in production');
    }
  };

  const acceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
  };

  const acceptEssential = () => {
    saveConsent({ analytics: false, marketing: false });
  };

  const handleCustomSettings = () => {
    saveConsent({
      analytics: consent.analytics,
      marketing: consent.marketing
    });
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🇩🇪 Cookie-Einstellungen / Cookie Settings
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Deutsch:</strong> Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung zu bieten. 
                    Essentielle Cookies sind für die Grundfunktionen erforderlich. 
                    <Link href="/privacy" className="text-blue-600 underline ml-1">Datenschutzerklärung</Link>
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>English:</strong> We use cookies to provide you with the best possible experience. 
                    Essential cookies are required for basic functionality. 
                    <Link href="/privacy" className="text-blue-600 underline ml-1">Privacy Policy</Link>
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={acceptAll} className="bg-blue-600 hover:bg-blue-700">
                      Alle akzeptieren / Accept All
                    </Button>
                    <Button variant="outline" onClick={acceptEssential}>
                      Nur erforderliche / Essential Only
                    </Button>
                    <Button variant="outline" onClick={() => setShowSettings(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Einstellungen / Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Cookie-Einstellungen / Cookie Settings</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Erforderliche Cookies / Essential Cookies</h3>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      Immer aktiv / Always active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden. 
                    / These cookies are necessary for basic website functionality and cannot be disabled.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Analyse-Cookies / Analytics Cookies</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent.analytics}
                        onChange={(e) => setConsent(prev => ({ ...prev, analytics: e.target.checked }))}
                        className="sr-only peer"
                        aria-label="Analytics Cookies Toggle"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Helfen uns zu verstehen, wie Sie die Website nutzen (Google Analytics). 
                    / Help us understand how you use the website (Google Analytics).
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Marketing-Cookies / Marketing Cookies</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent.marketing}
                        onChange={(e) => setConsent(prev => ({ ...prev, marketing: e.target.checked }))}
                        className="sr-only peer"
                        aria-label="Marketing Cookies Toggle"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Für personalisierte Inhalte und Werbung (zukünftige Implementierung). 
                    / For personalized content and advertising (future implementation).
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button onClick={handleCustomSettings} className="flex-1">
                  Einstellungen speichern / Save Settings
                </Button>
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Abbrechen / Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}