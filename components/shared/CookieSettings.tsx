'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, BarChart3, RefreshCw } from 'lucide-react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

interface CookieSettingsProps {
  language?: 'en' | 'de';
}

export default function CookieSettings({ language = 'en' }: CookieSettingsProps) {
  const { preferences, hasConsent, updatePreferences, resetConsent } = useCookieConsent();
  const [showSaved, setShowSaved] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);
  
  const translations = {
    en: {
      title: 'Cookie Settings',
      description: 'Manage your cookie preferences and privacy settings.',
      saveChanges: 'Save Changes',
      resetConsent: 'Reset All Settings'
    },
    de: {
      title: 'Cookie-Einstellungen', 
      description: 'Verwalten Sie Ihre Cookie-Präferenzen.',
      saveChanges: 'Änderungen speichern',
      resetConsent: 'Alle zurücksetzen'
    }
  };

  const t = translations[language];

  const handleToggle = (category: keyof typeof preferences) => {
    if (category === 'necessary') return;
    
    setLocalPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSave = () => {
    updatePreferences(localPreferences);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t.title}
        </CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Analytics Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Analytics Cookies</h4>
            <p className="text-sm text-muted-foreground">Google Analytics tracking</p>
          </div>
          <Button
            variant={localPreferences.analytics ? "default" : "outline"}
            size="sm"
            onClick={() => handleToggle('analytics')}
          >
            {localPreferences.analytics ? 'ON' : 'OFF'}
          </Button>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            {showSaved ? 'Saved!' : t.saveChanges}
          </Button>
          <Button variant="outline" onClick={resetConsent}>
            {t.resetConsent}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}