'use client';

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { generateResponsiveClasses, preserveDesktopExperience, BREAKPOINTS } from '@/lib/utils/responsive-utilities';
import { optimizeForTouch } from '@/lib/utils/touch-optimization';

export interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  mobileLayout?: 'stack' | 'grid' | 'flex';
  desktopLayout?: 'grid' | 'flex' | 'block';
  enableLazyLoading?: boolean;
  enableAnalytics?: boolean;
  touchOptimized?: boolean;
  preserveDesktop?: boolean;
  testId?: string;
}

interface LayoutConfig {
  mobile: string;
  tablet?: string;
  desktop: string;
}

/**
 * ResponsiveWrapper Component
 * 
 * Provides automatic layout adaptation between mobile and desktop with:
 * - Automatic mobile/desktop layout switching
 * - Performance optimization with lazy loading integration
 * - Error boundary integration and analytics tracking
 * - Desktop layout preservation
 */
export function ResponsiveWrapper({
  children,
  className = '',
  mobileLayout = 'stack',
  desktopLayout = 'block',
  enableLazyLoading = true,
  enableAnalytics = true,
  touchOptimized = true,
  preserveDesktop = true,
  testId = 'responsive-wrapper'
}: ResponsiveWrapperProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Detect mobile/desktop on client side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia(BREAKPOINTS.mobile).matches);
    };
    
    checkMobile();
    setIsLoaded(true);
    
    const mediaQuery = window.matchMedia(BREAKPOINTS.mobile);
    mediaQuery.addEventListener('change', checkMobile);
    
    return () => mediaQuery.removeEventListener('change', checkMobile);
  }, []);

  // Analytics tracking
  useEffect(() => {
    if (enableAnalytics && isLoaded) {
      // Track responsive wrapper usage
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'responsive_wrapper_render', {
          event_category: 'responsive_design',
          event_label: `${isMobile ? 'mobile' : 'desktop'}_${isMobile ? mobileLayout : desktopLayout}`
        });
      }
    }
  }, [isMobile, isLoaded, enableAnalytics, mobileLayout, desktopLayout]);

  // Generate layout classes based on configuration
  const getLayoutClasses = (): string => {
    const layoutConfigs: Record<string, LayoutConfig> = {
      // Mobile layouts
      stack: {
        mobile: 'flex flex-col space-y-4',
        tablet: 'flex flex-col space-y-6',
        desktop: desktopLayout === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' :
                desktopLayout === 'flex' ? 'flex flex-row space-x-6' : 'block space-y-6'
      },
      grid: {
        mobile: 'grid grid-cols-1 gap-4',
        tablet: 'grid grid-cols-2 gap-6',
        desktop: desktopLayout === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' :
                desktopLayout === 'flex' ? 'flex flex-wrap gap-6' : 'block space-y-6'
      },
      flex: {
        mobile: 'flex flex-col space-y-4',
        tablet: 'flex flex-col space-y-6',
        desktop: desktopLayout === 'flex' ? 'flex flex-row space-x-6' :
                desktopLayout === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'block space-y-6'
      }
    };

    const config = layoutConfigs[mobileLayout];
    return generateResponsiveClasses(config);
  };

  // Generate responsive classes
  const responsiveClasses = getLayoutClasses();
  
  // Add touch optimization if enabled
  const touchClasses = touchOptimized ? optimizeForTouch('', {
    minTouchTarget: 44,
    touchFeedback: false, // Don't add feedback to wrapper itself
    preserveHover: preserveDesktop
  }) : '';

  // Combine all classes
  const wrapperClasses = `
    ${responsiveClasses}
    ${touchClasses}
    ${className}
    transition-all duration-300 ease-in-out
  `.trim().replace(/\s+/g, ' ');

  // Lazy loading wrapper for performance
  const LazyContent = enableLazyLoading ? lazy(() => 
    Promise.resolve({ default: () => <>{children}</> })
  ) : null;

  // Loading fallback
  const LoadingFallback = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );



  // Server-side rendering fallback
  if (!isLoaded) {
    return (
      <div 
        className={`${responsiveClasses} ${className}`.trim()}
        data-testid={testId}
      >
        {children}
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <h3 className="text-red-800 font-medium mb-2">Layout Error</h3>
        <p className="text-red-600 text-sm">
          There was an error rendering this responsive layout. Please refresh the page.
        </p>
      </div>
    }>
      <div 
        className={wrapperClasses}
        data-testid={testId}
        data-mobile={isMobile}
        data-layout={isMobile ? mobileLayout : desktopLayout}
      >
        {enableLazyLoading && LazyContent ? (
          <Suspense fallback={<LoadingFallback />}>
            <LazyContent />
          </Suspense>
        ) : (
          children
        )}
      </div>
    </ErrorBoundary>
  );
}

// Preset configurations for common use cases
export const ResponsiveWrapperPresets = {
  // Card grid that stacks on mobile
  cardGrid: {
    mobileLayout: 'stack' as const,
    desktopLayout: 'grid' as const,
    touchOptimized: true,
    enableLazyLoading: true
  },
  
  // Content sections that stack on mobile
  contentSection: {
    mobileLayout: 'stack' as const,
    desktopLayout: 'block' as const,
    touchOptimized: false,
    enableLazyLoading: false
  },
  
  // Navigation items that flex on desktop
  navigation: {
    mobileLayout: 'stack' as const,
    desktopLayout: 'flex' as const,
    touchOptimized: true,
    enableLazyLoading: false
  },
  
  // Form sections with responsive layout
  formSection: {
    mobileLayout: 'stack' as const,
    desktopLayout: 'grid' as const,
    touchOptimized: true,
    enableLazyLoading: false
  }
};

// Higher-order component for easy wrapping
export function withResponsiveWrapper<P extends object>(
  Component: React.ComponentType<P>,
  wrapperProps?: Partial<ResponsiveWrapperProps>
) {
  return function WrappedComponent(props: P) {
    return (
      <ResponsiveWrapper {...wrapperProps}>
        <Component {...props} />
      </ResponsiveWrapper>
    );
  };
}

export default ResponsiveWrapper;