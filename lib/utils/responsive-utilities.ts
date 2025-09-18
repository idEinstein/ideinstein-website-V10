/**
 * Responsive Utilities Library
 * Mobile-first helper functions with desktop preservation
 */

export interface ResponsiveConfig {
  mobile: string;
  tablet?: string;
  desktop: string;
  preserveDesktop?: boolean;
}

export interface TouchTarget {
  minSize: number;
  padding: string;
  margin: string;
}

/**
 * Generate responsive classes with mobile-first approach
 */
export function generateResponsiveClasses(config: ResponsiveConfig): string {
  const { mobile, tablet, desktop, preserveDesktop = true } = config;
  
  let classes = mobile;
  
  if (tablet) {
    classes += ` sm:${tablet}`;
  }
  
  classes += ` lg:${desktop}`;
  
  return classes;
}

/**
 * Preserve desktop experience while optimizing mobile
 */
export function preserveDesktopExperience(
  mobileClasses: string,
  desktopClasses: string
): string {
  return `${mobileClasses} lg:${desktopClasses}`;
}

/**
 * Generate responsive padding classes - Mobile-first defaults
 */
export function responsivePadding(
  mobile: string = 'p-3',
  tablet: string = 'p-4', 
  desktop: string = 'p-6'
): string {
  return generateResponsiveClasses({
    mobile,
    tablet,
    desktop
  });
}

/**
 * Generate responsive text size classes
 */
export function responsiveText(
  mobile: string,
  desktop: string,
  tablet?: string
): string {
  return generateResponsiveClasses({
    mobile,
    tablet,
    desktop
  });
}

/**
 * Generate responsive spacing classes
 */
export function responsiveSpacing(
  mobile: string,
  desktop: string,
  tablet?: string
): string {
  return generateResponsiveClasses({
    mobile,
    tablet,
    desktop
  });
}

/**
 * Generate responsive icon size classes
 */
export function responsiveIconSize(
  mobile: string = 'w-6 h-6',
  tablet: string = 'w-7 h-7',
  desktop: string = 'w-8 h-8'
): string {
  return generateResponsiveClasses({
    mobile,
    tablet,
    desktop
  });
}

/**
 * WCAG compliant touch target configuration
 */
export const TOUCH_TARGET: TouchTarget = {
  minSize: 44, // 44px minimum for WCAG AA
  padding: 'p-3',
  margin: 'm-1'
};

/**
 * Common responsive breakpoint utilities
 */
export const BREAKPOINTS = {
  mobile: '(max-width: 640px)',
  tablet: '(min-width: 641px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)'
} as const;

/**
 * Responsive card padding utility - Mobile-first optimized
 */
export function cardPadding(): string {
  return responsivePadding('p-3', 'p-4', 'p-6');
}

/**
 * Responsive card title utility - Mobile-first optimized
 */
export function cardTitle(): string {
  return responsiveText('text-base', 'text-xl', 'text-lg');
}

/**
 * Responsive card description utility
 */
export function cardDescription(): string {
  return responsiveText('text-sm', 'text-base', 'text-base');
}

/**
 * Responsive card icon utility - Mobile-first optimized
 */
export function cardIcon(): string {
  return responsiveIconSize('w-8 h-8', 'w-10 h-10', 'w-12 h-12');
}

/**
 * Touch-friendly hover states
 */
export function touchFriendlyHover(hoverClasses: string): string {
  return `${hoverClasses} active:scale-95 touch-manipulation`;
}

/**
 * Responsive margin bottom utility
 */
export function responsiveMarginBottom(
  mobile: string = 'mb-3',
  tablet: string = 'mb-4',
  desktop: string = 'mb-4'
): string {
  return generateResponsiveClasses({
    mobile,
    tablet,
    desktop
  });
}

/**
 * Validate responsive configuration
 */
export function validateResponsiveConfig(config: ResponsiveConfig): boolean {
  return !!(config.mobile && config.desktop);
}

/**
 * Generate responsive grid classes
 */
export function responsiveGrid(
  mobile: string = 'grid-cols-1',
  tablet: string = 'grid-cols-2', 
  desktop: string = 'grid-cols-3'
): string {
  return generateResponsiveClasses({
    mobile,
    tablet,
    desktop
  });
}

/**
 * Generate responsive gap classes
 */
export function responsiveGap(
  mobile: string = 'gap-4',
  tablet: string = 'gap-6',
  desktop: string = 'gap-8'
): string {
  return generateResponsiveClasses({
    mobile,
    tablet,
    desktop
  });
}

/**
 * PROVEN PATTERNS FROM HOMEPAGE/STARTUP OPTIMIZATIONS
 * These utilities are based on successful implementations
 */

/**
 * Proven card padding pattern - optimized from homepage/startup success
 * Mobile: 12px, Tablet: 16px, Desktop: 24px
 */
export function provenCardPadding(): string {
  return responsivePadding('p-3', 'p-4', 'p-6');
}

/**
 * Proven button optimization pattern - full width on mobile, auto on desktop
 */
export function provenButtonWidth(): string {
  return 'w-full sm:w-auto';
}

/**
 * Proven touch feedback pattern - scale on mobile, preserve hover on desktop
 */
export function provenTouchFeedback(): string {
  return 'active:scale-[0.98] sm:active:scale-100 transition-all duration-150';
}

/**
 * Proven grid stacking pattern - single column mobile, multi-column desktop
 */
export function provenGridStacking(desktopCols: number = 2): string {
  return `grid-cols-1 lg:grid-cols-${desktopCols}`;
}

/**
 * Proven icon sizing pattern - smaller on mobile, larger on desktop
 */
export function provenIconSizing(): string {
  return responsiveIconSize('w-4 h-4', 'w-5 h-5', 'w-6 h-6');
}

/**
 * Proven typography scaling pattern - readable on mobile, elegant on desktop
 */
export function provenTypographyScale(): string {
  return responsiveText('text-sm', 'text-base', 'text-lg');
}

/**
 * Proven section spacing pattern - tighter on mobile, spacious on desktop
 */
export function provenSectionSpacing(): string {
  return responsiveSpacing('space-y-4', 'space-y-6', 'space-y-8');
}

/**
 * Proven container padding pattern - edge-to-edge mobile, contained desktop
 */
export function provenContainerPadding(): string {
  return responsivePadding('px-4', 'px-6', 'px-8');
}

/**
 * PAGE-SPECIFIC OPTIMIZATION UTILITIES
 * Templates for different page types
 */

/**
 * Business page optimization (About, Contact, Solutions)
 */
export function businessPageOptimization() {
  return {
    containerPadding: provenContainerPadding(),
    sectionSpacing: provenSectionSpacing(),
    cardPadding: provenCardPadding(),
    buttonWidth: provenButtonWidth(),
    touchFeedback: provenTouchFeedback(),
    gridStacking: provenGridStacking(2),
    typography: provenTypographyScale()
  };
}

/**
 * Service page optimization (Technical content)
 */
export function servicePageOptimization() {
  return {
    containerPadding: provenContainerPadding(),
    sectionSpacing: 'space-y-6 sm:space-y-8 md:space-y-12',
    cardPadding: provenCardPadding(),
    buttonWidth: provenButtonWidth(),
    touchFeedback: provenTouchFeedback(),
    gridStacking: provenGridStacking(3),
    typography: responsiveText('text-sm', 'text-base', 'text-lg'),
    technicalContent: 'max-w-none sm:max-w-2xl md:max-w-4xl'
  };
}

/**
 * Content page optimization (Blog, Documentation)
 */
export function contentPageOptimization() {
  return {
    containerPadding: 'px-4 sm:px-6 md:px-8',
    sectionSpacing: 'space-y-4 sm:space-y-6 md:space-y-8',
    cardPadding: provenCardPadding(),
    buttonWidth: provenButtonWidth(),
    touchFeedback: provenTouchFeedback(),
    gridStacking: provenGridStacking(2),
    typography: responsiveText('text-base', 'text-lg', 'text-xl'),
    readingWidth: 'max-w-none sm:max-w-2xl md:max-w-4xl lg:max-w-5xl'
  };
}

/**
 * Form page optimization (Contact, Auth, Portal)
 */
export function formPageOptimization() {
  return {
    containerPadding: provenContainerPadding(),
    sectionSpacing: 'space-y-4 sm:space-y-6',
    formPadding: 'p-4 sm:p-6 md:p-8',
    inputSpacing: 'space-y-3 sm:space-y-4',
    buttonWidth: provenButtonWidth(),
    touchFeedback: provenTouchFeedback(),
    formWidth: 'w-full sm:max-w-md md:max-w-lg'
  };
}

/**
 * DESKTOP PRESERVATION UTILITIES
 * Ensure desktop experience remains unchanged
 */

/**
 * Preserve desktop animations while adding mobile optimizations
 */
export function preserveDesktopAnimations(mobileClasses: string, desktopAnimations: string): string {
  return `${mobileClasses} lg:${desktopAnimations}`;
}

/**
 * Preserve desktop hover states while adding mobile touch feedback
 */
export function preserveDesktopHover(mobileTouch: string, desktopHover: string): string {
  return `${mobileTouch} lg:${desktopHover}`;
}

/**
 * Preserve desktop layout while optimizing mobile
 */
export function preserveDesktopLayout(mobileLayout: string, desktopLayout: string): string {
  return `${mobileLayout} lg:${desktopLayout}`;
}