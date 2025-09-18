// Performance monitoring utilities
export const performanceMonitor = {
  // Measure page load performance
  measurePageLoad: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        // Core Web Vitals
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        
        // Network timing
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnect: navigation.connectEnd - navigation.connectStart,
        serverResponse: navigation.responseEnd - navigation.requestStart,
        
        // Page processing
        domProcessing: navigation.domComplete - navigation.responseEnd,
        
        // Total page load time
        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      };
    }
    return null;
  },

  // Measure Largest Contentful Paint (LCP)
  measureLCP: (callback: (lcp: number) => void) => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        callback((lastEntry as any).startTime);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  },

  // Measure First Input Delay (FID)
  measureFID: (callback: (fid: number) => void) => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: unknown) => {
          callback((entry as any).processingStart - (entry as any).startTime);
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  },

  // Measure Cumulative Layout Shift (CLS)
  measureCLS: (callback: (cls: number) => void) => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: unknown) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        callback(clsValue);
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  },

  // Log performance metrics to analytics
  logPerformanceMetrics: () => {
    const metrics = performanceMonitor.measurePageLoad();
    if (metrics && typeof window !== 'undefined' && window.gtag) {
      // Log to Google Analytics
      window.gtag('event', 'page_performance', {
        event_category: 'Performance',
        event_label: `DOM: ${Math.round(metrics.domContentLoaded)}ms, Load: ${Math.round(metrics.totalLoadTime)}ms`,
        value: Math.round(metrics.totalLoadTime),
      });
    }
  },
};

// Auto-log performance metrics on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.logPerformanceMetrics();
    }, 1000);
  });
}