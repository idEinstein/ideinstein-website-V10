/**
 * Animation Configuration System
 * Standardized animation constants based on startup page quality patterns
 * 
 * This configuration extracts the proven animation patterns from your premium
 * startup pages and makes them available for consistent use across the site.
 */

/**
 * Base animation durations (in seconds)
 * Based on successful patterns from StartupPathContent and premium pages
 */
export const ANIMATION_DURATIONS = {
  // Fast interactions - buttons, hover states
  fast: 0.2,
  
  // Normal interactions - cards, form elements
  normal: 0.4,
  
  // Slow/entrance animations - sections, page elements
  slow: 0.8,
  
  // Entrance animations - main content reveals
  entrance: 0.8,
  
  // Exit animations - slightly faster than entrance
  exit: 0.6,
  
  // Micro-interactions - touch feedback, small state changes
  micro: 0.15,
  
  // Hover transitions - proven from startup pages
  hover: 0.3
} as const;

/**
 * Staggered animation delays (in seconds)
 * Based on successful `delay: index * 0.1` pattern from startup pages
 */
export const STAGGER_DELAYS = {
  // Base stagger - proven pattern from startup pages
  base: 0.1,
  
  // Fast stagger - for smaller elements
  fast: 0.05,
  
  // Slow stagger - for larger sections
  slow: 0.15,
  
  // Dense content - many items
  dense: 0.08,
  
  // Sparse content - few items
  sparse: 0.2
} as const;

/**
 * Easing curves for different animation types
 * Optimized for smooth, professional feel
 */
export const EASING_CURVES = {
  // Smooth - general purpose easing
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  
  // Bounce - playful interactions
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  
  // Sharp - quick, decisive actions
  sharp: [0.4, 0, 0.2, 1] as const,
  
  // Gentle - subtle, elegant transitions
  gentle: [0.25, 0.1, 0.25, 1] as const,
  
  // Spring - natural, organic feel
  spring: [0.175, 0.885, 0.32, 1.275] as const
} as const;

/**
 * Mobile-optimized animation settings
 * Respects battery life and performance constraints
 */
export const MOBILE_ANIMATION_CONFIG = {
  // Reduced durations for mobile performance
  durationMultiplier: 0.75,
  
  // Touch feedback duration - proven from startup pages
  touchFeedbackDuration: 0.15,
  
  // Battery-conscious mode settings
  batteryConscious: true,
  
  // Reduced motion fallback duration
  reducedMotionDuration: 0.01,
  
  // Mobile-specific easing (less CPU intensive)
  easing: EASING_CURVES.gentle,
  
  // Touch scale values - proven from startup pages
  touchScale: {
    active: 0.98,
    rest: 1.0
  }
} as const;

/**
 * Accessibility settings
 * Ensures animations respect user preferences
 */
export const ACCESSIBILITY_CONFIG = {
  // Respect user's reduced motion preference
  respectReducedMotion: true,
  
  // Fallback duration for reduced motion
  fallbackDuration: 0.01,
  
  // Essential animations only mode
  essentialAnimationsOnly: false,
  
  // Focus management during animations
  manageFocus: true,
  
  // Screen reader compatibility
  screenReaderFriendly: true
} as const;

/**
 * Performance optimization settings
 */
export const PERFORMANCE_CONFIG = {
  // Hardware acceleration properties
  hardwareAcceleration: ['transform', 'opacity'] as const,
  
  // Will-change management
  willChangeAuto: true,
  
  // Animation cleanup
  autoCleanup: true,
  
  // Performance monitoring
  enableMonitoring: false,
  
  // Frame rate target
  targetFPS: 60
} as const;

/**
 * Proven animation variants extracted from startup pages
 * These are the exact patterns that work well in StartupPathContent, SoloFounderAdvantageSection, etc.
 */
export const STARTUP_PROVEN_VARIANTS = {
  // Standard fade-in-up pattern used throughout startup pages
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  },
  
  // Card entrance with stagger (used in startup grids)
  cardEntrance: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 } // Note: delay added per card: delay: index * 0.1
  },
  
  // Hover effects from startup cards
  cardHover: {
    whileHover: { 
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    },
    transition: { duration: 0.3 }
  },
  
  // Touch feedback from startup mobile interactions
  touchFeedback: {
    whileTap: { scale: 0.98 },
    transition: { duration: 0.15 }
  },
  
  // Section reveal pattern
  sectionReveal: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
    viewport: { once: true, margin: "-100px" }
  }
} as const;

/**
 * Stagger container pattern from startup pages
 */
export const STARTUP_STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.1 // Matches the proven delay: index * 0.1 pattern
    }
  }
} as const;

/**
 * Main animation configuration object
 * Combines all settings into a single, easy-to-use configuration
 */
export const ANIMATION_CONFIG = {
  durations: ANIMATION_DURATIONS,
  stagger: STAGGER_DELAYS,
  easing: EASING_CURVES,
  mobile: MOBILE_ANIMATION_CONFIG,
  accessibility: ACCESSIBILITY_CONFIG,
  performance: PERFORMANCE_CONFIG,
  // Add proven startup patterns
  startupVariants: STARTUP_PROVEN_VARIANTS,
  staggerContainer: STARTUP_STAGGER_CONTAINER
} as const;

/**
 * Responsive animation duration helper
 * Automatically adjusts durations based on device capabilities
 */
export function getResponsiveDuration(
  baseDuration: keyof typeof ANIMATION_DURATIONS,
  isMobile: boolean = false,
  prefersReducedMotion: boolean = false
): number {
  if (prefersReducedMotion) {
    return ACCESSIBILITY_CONFIG.fallbackDuration;
  }
  
  const duration = ANIMATION_DURATIONS[baseDuration];
  
  if (isMobile) {
    return duration * MOBILE_ANIMATION_CONFIG.durationMultiplier;
  }
  
  return duration;
}

/**
 * Stagger delay calculator
 * Generates stagger delays based on index and configuration
 */
export function calculateStaggerDelay(
  index: number,
  staggerType: keyof typeof STAGGER_DELAYS = 'base',
  baseDelay: number = 0
): number {
  return baseDelay + (index * STAGGER_DELAYS[staggerType]);
}

/**
 * Animation configuration validator
 * Ensures configuration values are within acceptable ranges
 */
export function validateAnimationConfig(config: Partial<typeof ANIMATION_CONFIG>): boolean {
  // Validate durations are positive numbers
  if (config.durations) {
    const durations = Object.values(config.durations);
    if (durations.some(d => typeof d !== 'number' || d < 0)) {
      return false;
    }
  }
  
  // Validate stagger delays are positive
  if (config.stagger) {
    const delays = Object.values(config.stagger);
    if (delays.some(d => typeof d !== 'number' || d < 0)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Export types for TypeScript support
 */
export type AnimationDuration = keyof typeof ANIMATION_DURATIONS;
export type StaggerDelay = keyof typeof STAGGER_DELAYS;
export type EasingCurve = keyof typeof EASING_CURVES;
export type AnimationConfigType = typeof ANIMATION_CONFIG;

/**
 * Utility functions to integrate proven patterns with existing components
 */

/**
 * Get startup-proven card animation with stagger
 * Use this to enhance existing ResponsiveCard components
 */
export function getStartupCardAnimation(index: number = 0) {
  return {
    ...STARTUP_PROVEN_VARIANTS.cardEntrance,
    transition: {
      ...STARTUP_PROVEN_VARIANTS.cardEntrance.transition,
      delay: index * STAGGER_DELAYS.base // Proven 0.1s stagger
    }
  };
}

/**
 * Get startup-proven hover effects
 * Use this to enhance existing card hover states
 */
export function getStartupHoverEffects() {
  return STARTUP_PROVEN_VARIANTS.cardHover;
}

/**
 * Get startup-proven touch feedback
 * Use this to enhance existing mobile interactions
 */
export function getStartupTouchFeedback() {
  return STARTUP_PROVEN_VARIANTS.touchFeedback;
}

/**
 * Get startup-proven section reveal
 * Use this to enhance existing ResponsiveSection components
 */
export function getStartupSectionReveal() {
  return STARTUP_PROVEN_VARIANTS.sectionReveal;
}

/**
 * Combine hover and touch effects for complete interaction
 * This matches the startup page pattern of hover + active states
 */
export function getStartupInteractionEffects() {
  return {
    ...STARTUP_PROVEN_VARIANTS.cardHover,
    ...STARTUP_PROVEN_VARIANTS.touchFeedback
  };
}

/**
 * Get CSS classes that match startup page animations
 * For components that use CSS instead of Framer Motion
 */
export function getStartupAnimationClasses() {
  return {
    // Hover effects matching startup cards
    cardHover: 'hover:shadow-xl transition-all duration-300',
    
    // Touch feedback matching startup mobile
    touchFeedback: 'active:scale-[0.98] transition-transform duration-150',
    
    // Combined interaction (hover + touch)
    fullInteraction: 'hover:shadow-xl active:scale-[0.98] transition-all duration-300',
    
    // Smooth transitions
    smoothTransition: 'transition-all duration-300 ease-out'
  };
}

/**
 * Integration helper for existing ResponsiveCard
 * Returns props to add startup-quality animations to ResponsiveCard
 */
export function enhanceResponsiveCardWithStartupAnimations(index: number = 0) {
  const animationClasses = getStartupAnimationClasses();
  
  return {
    // Add these classes to existing ResponsiveCard className
    animationClasses: animationClasses.fullInteraction,
    
    // Framer Motion props if converting to motion.div
    motionProps: getStartupCardAnimation(index),
    
    // Hover and tap effects
    interactionProps: getStartupInteractionEffects()
  };
}

/**
 * Default export for easy importing
 */
export default ANIMATION_CONFIG;