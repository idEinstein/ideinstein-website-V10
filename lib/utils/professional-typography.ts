/**
 * Professional Typography System
 * 
 * Comprehensive typography utilities for consistent, accessible, and responsive text handling
 * across the IdEinstein website.
 */

import { cn } from '@/lib/utils';

// Typography Variants
export type TypographyVariant = 
  | 'display-xl' | 'display-lg' | 'display-md'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body-xl' | 'body-lg' | 'body-md' | 'body-sm'
  | 'caption' | 'label';

// Text Wrapping Options
export type TextWrap = 'professional' | 'balanced' | 'pretty' | 'none';

// Text Container Sizes
export type TextContainer = 'sm' | 'md' | 'lg' | 'xl' | 'none';

// Line Height Options
export type LineHeight = 'tight' | 'normal' | 'relaxed' | 'loose';

// Import standardized font sizes
import { standardFontSizes, type FontSizeCategory } from './standardized-font-sizes';

// Typography Configuration using standardized font sizes
export const typographyConfig = {
  variants: {
    // Display Headings (Hero sections)
    'display-xl': standardFontSizes['hero-heading'],
    'display-lg': {
      mobile: 'text-3xl',     // 30px
      tablet: 'text-4xl',     // 36px
      desktop: 'text-5xl',    // 48px
      weight: 'font-bold',
      leading: 'leading-tight'
    },
    'display-md': {
      mobile: 'text-2xl',     // 24px
      tablet: 'text-3xl',     // 30px
      desktop: 'text-4xl',    // 36px
      weight: 'font-bold',
      leading: 'leading-tight'
    },
    
    // Standard Headings (using standardized sizes)
    'h1': standardFontSizes['hero-heading'],
    'h2': standardFontSizes['section-heading'],
    'h3': standardFontSizes['subsection-heading'],
    'h4': standardFontSizes['card-heading'],
    'h5': standardFontSizes['small-heading'],
    'h6': standardFontSizes['small-heading'],
    
    // Body Text (using standardized sizes)
    'body-xl': standardFontSizes['large-description'],
    'body-lg': standardFontSizes['standard-description'],
    'body-md': standardFontSizes['small-description'],
    'body-sm': standardFontSizes['caption'],
    
    // Captions and Labels (using standardized sizes)
    'caption': standardFontSizes['caption'],
    'label': {
      mobile: 'text-sm',      // 14px
      tablet: 'text-base',    // 16px
      desktop: 'text-base',   // 16px
      weight: 'font-medium',
      leading: 'leading-normal'
    }
  },
  
  wrapping: {
    professional: 'text-wrap-professional',
    balanced: 'text-wrap-balanced',
    pretty: 'text-wrap-pretty',
    none: 'text-wrap-none'
  },
  
  containers: {
    sm: 'text-container-sm',   // ~65ch
    md: 'text-container-md',   // ~75ch
    lg: 'text-container-lg',   // ~85ch
    xl: 'text-container-xl',   // ~95ch
    none: ''
  },
  
  lineHeights: {
    tight: 'leading-tight',     // 1.25
    normal: 'leading-normal',   // 1.5
    relaxed: 'leading-relaxed', // 1.625
    loose: 'leading-loose'      // 2
  }
} as const;

/**
 * Generate responsive typography classes
 */
export function responsiveTypography(
  variant: TypographyVariant,
  options: {
    wrap?: TextWrap;
    container?: TextContainer;
    leading?: LineHeight;
    className?: string;
  } = {}
): string {
  const config = typographyConfig.variants[variant];
  const {
    wrap = 'professional',
    container = 'none',
    leading,
    className = ''
  } = options;

  const classes = [
    // Responsive sizes
    config.mobile,
    `md:${config.tablet}`,
    `lg:${config.desktop}`,
    
    // Weight and default leading
    config.weight,
    leading ? typographyConfig.lineHeights[leading] : config.leading,
    
    // Text wrapping
    typographyConfig.wrapping[wrap],
    
    // Container
    container !== 'none' ? typographyConfig.containers[container] : '',
    
    // Custom classes
    className
  ];

  return cn(...classes.filter(Boolean));
}

/**
 * Get typography classes for headings with optimal defaults
 */
export function headingTypography(
  level: 1 | 2 | 3 | 4 | 5 | 6,
  options: {
    wrap?: TextWrap;
    container?: TextContainer;
    className?: string;
  } = {}
): string {
  const variant = `h${level}` as TypographyVariant;
  return responsiveTypography(variant, {
    wrap: 'balanced',
    leading: 'tight',
    ...options
  });
}

/**
 * Get typography classes for body text with optimal defaults
 */
export function bodyTypography(
  size: 'xl' | 'lg' | 'md' | 'sm' = 'md',
  options: {
    wrap?: TextWrap;
    container?: TextContainer;
    className?: string;
  } = {}
): string {
  const variant = `body-${size}` as TypographyVariant;
  return responsiveTypography(variant, {
    wrap: 'pretty',
    leading: 'relaxed',
    container: 'lg',
    ...options
  });
}

/**
 * Get typography classes for display text with optimal defaults
 */
export function displayTypography(
  size: 'xl' | 'lg' | 'md',
  options: {
    wrap?: TextWrap;
    container?: TextContainer;
    className?: string;
  } = {}
): string {
  const variant = `display-${size}` as TypographyVariant;
  return responsiveTypography(variant, {
    wrap: 'balanced',
    leading: 'tight',
    ...options
  });
}

/**
 * Utility for creating consistent text containers
 */
export function textContainer(
  size: TextContainer = 'lg',
  className?: string
): string {
  return cn(
    size !== 'none' ? typographyConfig.containers[size] : '',
    className
  );
}

/**
 * Accessibility-focused text utilities
 */
export const accessibilityText = {
  // Screen reader only
  srOnly: 'sr-only',
  
  // Skip links
  skipLink: 'skip-link',
  
  // High contrast support
  highContrast: 'text-contrast-adaptive',
  
  // Focus indicators
  focusable: 'text-focusable',
  
  // Reduced motion support
  motionSafe: 'motion-safe:transition-all motion-safe:duration-200'
} as const;

/**
 * Performance-optimized text utilities
 */
export const performanceText = {
  // Prevent layout shift
  stable: 'text-stable',
  
  // Optimize font rendering
  optimized: 'font-display-swap antialiased',
  
  // GPU acceleration for animations
  accelerated: 'transform-gpu will-change-transform'
} as const;

/**
 * Validation utilities for development
 */
export function validateTypography(element: HTMLElement): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check for text overflow
  if (element.scrollWidth > element.clientWidth) {
    issues.push('Text overflow detected');
  }
  
  // Check for proper contrast (simplified check)
  const styles = window.getComputedStyle(element);
  const color = styles.color;
  const backgroundColor = styles.backgroundColor;
  
  // Add more validation logic as needed
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Development helpers
 */
export const devHelpers = {
  // Log typography information
  logTypography: (element: HTMLElement) => {
    const styles = window.getComputedStyle(element);
    console.log('Typography Debug:', {
      fontSize: styles.fontSize,
      lineHeight: styles.lineHeight,
      fontWeight: styles.fontWeight,
      textOverflow: element.scrollWidth > element.clientWidth,
      element
    });
  },
  
  // Highlight text containers
  highlightContainers: () => {
    document.querySelectorAll('[class*="text-container"]').forEach(el => {
      (el as HTMLElement).style.outline = '2px solid red';
    });
  }
} as const;