'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { CookieUtils } from '@/hooks/useCookieConsent';

// Google Analytics Measurement ID - will be configured via environment variable
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const GoogleAnalytics = () => {
  useEffect(() => {
    // Only initialize if GA ID is configured
    if (!GA_MEASUREMENT_ID) return;
    
    // Initialize Google Analytics with default denied consent
    if (typeof window !== 'undefined') {
      window.gtag?.('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied'
      });

      // Check if user has already given consent
      if (CookieUtils.canTrack('analytics')) {
        window.gtag?.('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted'
        });
      }
    }
  }, []);

  // Don't render if no measurement ID is configured
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;