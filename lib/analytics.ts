// Google Analytics 4 configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Predefined events for common actions
export const trackEvent = {
  // Contact form submissions
  contactForm: (formType: string) => {
    event({
      action: 'form_submit',
      category: 'Contact',
      label: formType,
    });
  },

  // Service page views
  serviceView: (serviceName: string) => {
    event({
      action: 'service_view',
      category: 'Services',
      label: serviceName,
    });
  },

  // Quote requests
  quoteRequest: (serviceType: string) => {
    event({
      action: 'quote_request',
      category: 'Lead Generation',
      label: serviceType,
    });
  },

  // Blog interactions
  blogRead: (articleTitle: string) => {
    event({
      action: 'article_read',
      category: 'Blog',
      label: articleTitle,
    });
  },

  // Store interactions
  productView: (productName: string) => {
    event({
      action: 'product_view',
      category: 'Store',
      label: productName,
    });
  },

  // Download tracking
  downloadFile: (fileName: string) => {
    event({
      action: 'file_download',
      category: 'Downloads',
      label: fileName,
    });
  },

  // Navigation tracking
  navigationClick: (linkText: string, destination: string) => {
    event({
      action: 'navigation_click',
      category: 'Navigation',
      label: `${linkText} -> ${destination}`,
    });
  },

  // Search tracking
  search: (query: string, resultsCount: number) => {
    event({
      action: 'search',
      category: 'Search',
      label: query,
      value: resultsCount,
    });
  },

  // Homepage-specific tracking for conversion optimization
  homepage: {
    // Hero section engagement
    heroEngagement: (action: 'view' | 'cta_click' | 'path_select', details?: string) => {
      event({
        action: `hero_${action}`,
        category: 'Homepage Hero',
        label: details,
      });
    },

    // 3-second rule compliance tracking
    threeSecondRule: (compliant: boolean, timeToValue: number) => {
      event({
        action: 'three_second_rule',
        category: 'Homepage Performance',
        label: compliant ? 'compliant' : 'non_compliant',
        value: Math.round(timeToValue),
      });
    },

    // Path selection tracking (startup vs enterprise)
    pathSelection: (audienceType: 'startup' | 'enterprise', source: string) => {
      event({
        action: 'audience_path_select',
        category: 'Homepage Conversion',
        label: `${audienceType}_from_${source}`,
      });
    },

    // Comparison table interactions
    comparisonInteraction: (action: 'view' | 'feature_focus' | 'cta_click', feature?: string) => {
      event({
        action: `comparison_${action}`,
        category: 'Homepage Comparison',
        label: feature,
      });
    },

    // Section view tracking for optimization
    sectionView: (sectionName: string, timeSpent?: number) => {
      event({
        action: 'section_view',
        category: 'Homepage Sections',
        label: sectionName,
        value: timeSpent ? Math.round(timeSpent) : undefined,
      });
    },

    // CTA performance tracking
    ctaClick: (ctaType: 'primary' | 'secondary', location: string, text: string) => {
      event({
        action: 'cta_click',
        category: 'Homepage CTA',
        label: `${ctaType}_${location}_${text}`,
      });
    },

    // Metrics engagement tracking
    metricsEngagement: (metricType: string, action: 'view' | 'hover' | 'click') => {
      event({
        action: `metrics_${action}`,
        category: 'Homepage Metrics',
        label: metricType,
      });
    },
  },
};

// Enhanced ecommerce tracking (for future store functionality)
export const ecommerce = {
  // Track product purchases
  purchase: (transactionId: string, value: number, items: unknown[]) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: 'EUR',
        items: items,
      });
    }
  },

  // Track add to cart
  addToCart: (itemId: string, itemName: string, value: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'EUR',
        value: value,
        items: [
          {
            item_id: itemId,
            item_name: itemName,
            quantity: 1,
            price: value,
          },
        ],
      });
    }
  },
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'consent',
      targetIdOrAction?: string,
      config?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
        transaction_id?: string;
        currency?: string;
        items?: unknown[];
        // Consent-specific properties
        analytics_storage?: 'granted' | 'denied';
        ad_storage?: 'granted' | 'denied';
        ad_user_data?: 'granted' | 'denied';
        ad_personalization?: 'granted' | 'denied';
      }
    ) => void;
  }
}