/**
 * Mobile-specific utilities for customer portal
 */

export const mobileBreakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
} as const;

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 640;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 640 && window.innerWidth < 1024;
};

export const optimizeForTouch = (element: HTMLElement) => {
  element.style.touchAction = 'manipulation';
  element.style.minHeight = '44px'; // iOS recommended minimum
  element.style.minWidth = '44px';
};

export const handleMobileScroll = (container: HTMLElement) => {
  // Smooth scrolling for mobile
  container.style.scrollBehavior = 'smooth';
  container.style.overflowX = 'auto';
  (container.style as any).scrollbarWidth = 'none';
  (container.style as any).msOverflowStyle = 'none';
};

export const mobileOptimizedClasses = {
  container: 'px-2 sm:px-4 md:px-6 lg:px-8',
  card: 'p-4 sm:p-6',
  button: 'px-3 py-3 sm:py-2 text-base sm:text-sm touch-manipulation',
  text: {
    heading: 'text-2xl sm:text-3xl',
    subheading: 'text-base sm:text-lg',
    body: 'text-sm sm:text-base'
  },
  spacing: {
    section: 'space-y-4 sm:space-y-6',
    grid: 'gap-4 sm:gap-6'
  }
} as const;
