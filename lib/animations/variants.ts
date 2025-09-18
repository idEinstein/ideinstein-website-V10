/**
 * Motion Variants Library
 * Standardized Framer Motion variants based on proven startup page patterns
 * 
 * This library provides ready-to-use motion variants that match the quality
 * and feel of the premium startup pages across the site.
 */

import { Variants } from 'framer-motion';
import { ANIMATION_DURATIONS, STAGGER_DELAYS } from './config';

/**
 * Core entrance animations - extracted from startup pages
 */
export const fadeInUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 30 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_DURATIONS.entrance // 0.8s from startup pages
    }
  }
};

export const fadeInUpFast: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_DURATIONS.normal, // 0.6s for cards
      ease: "easeOut"
    }
  }
};

/**
 * Stagger container - for grid layouts like startup pages
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: STAGGER_DELAYS.base, // 0.1s proven pattern
      delayChildren: 0.1
    }
  }
};

export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: STAGGER_DELAYS.fast, // 0.05s for dense content
      delayChildren: 0.05
    }
  }
};

/**
 * Card animations - matching startup page card quality
 */
export const cardEntrance: Variants = {
  initial: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATIONS.normal, // 0.6s from startup cards
      ease: "easeOut"
    }
  }
};

export const cardHover: Variants = {
  initial: { 
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: ANIMATION_DURATIONS.hover, // 0.3s
      ease: "easeOut"
    }
  }
};

/**
 * Touch feedback - mobile optimized from startup pages
 */
export const touchFeedback: Variants = {
  initial: { scale: 1 },
  tap: { 
    scale: 0.98,
    transition: {
      duration: ANIMATION_DURATIONS.micro, // 0.15s
      ease: "easeInOut"
    }
  }
};

/**
 * Scroll reveal animations - for sections
 */
export const scrollReveal: Variants = {
  initial: { 
    opacity: 0, 
    y: 30 
  },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_DURATIONS.entrance, // 0.8s
      ease: "easeOut"
    }
  }
};

export const scrollRevealLeft: Variants = {
  initial: { 
    opacity: 0, 
    x: -30 
  },
  whileInView: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: ANIMATION_DURATIONS.entrance,
      ease: "easeOut"
    }
  }
};

export const scrollRevealRight: Variants = {
  initial: { 
    opacity: 0, 
    x: 30 
  },
  whileInView: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: ANIMATION_DURATIONS.entrance,
      ease: "easeOut"
    }
  }
};

/**
 * Combined interaction variants - hover + touch
 */
export const interactiveCard: Variants = {
  initial: { 
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: ANIMATION_DURATIONS.hover,
      ease: "easeOut"
    }
  },
  tap: { 
    scale: 0.98,
    transition: {
      duration: ANIMATION_DURATIONS.micro,
      ease: "easeInOut"
    }
  }
};

/**
 * Button animations - enhanced from startup CTAs
 */
export const buttonHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: ANIMATION_DURATIONS.fast, // 0.2s
      ease: "easeOut"
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: ANIMATION_DURATIONS.micro,
      ease: "easeInOut"
    }
  }
};

/**
 * Icon animations - for interactive elements
 */
export const iconHover: Variants = {
  initial: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: "easeOut"
    }
  }
};

export const iconBounce: Variants = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 2,
      ease: "easeInOut"
    }
  }
};

/**
 * Loading and state animations
 */
export const fadeInOut: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATIONS.fast
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATIONS.fast
    }
  }
};

export const slideInOut: Variants = {
  initial: { x: "100%", opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: "easeOut"
    }
  },
  exit: { 
    x: "100%", 
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: "easeIn"
    }
  }
};

/**
 * Utility functions for dynamic variants
 */

/**
 * Create a staggered entrance variant with custom delay
 */
export function createStaggeredEntrance(index: number, baseDelay: number = 0): Variants {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: ANIMATION_DURATIONS.normal,
        delay: baseDelay + (index * STAGGER_DELAYS.base), // Proven 0.1s pattern
        ease: "easeOut"
      }
    }
  };
}

/**
 * Create a custom card hover with specific scale and shadow
 */
export function createCardHover(
  scale: number = 1.02, 
  shadowIntensity: 'light' | 'medium' | 'heavy' = 'medium'
): Variants {
  const shadows = {
    light: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    medium: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    heavy: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  };

  return {
    initial: { 
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: { 
      scale,
      boxShadow: shadows[shadowIntensity],
      transition: {
        duration: ANIMATION_DURATIONS.hover,
        ease: "easeOut"
      }
    }
  };
}

/**
 * Responsive variants - adjust for mobile
 */
export function createResponsiveVariant(
  baseVariant: Variants, 
  isMobile: boolean = false
): Variants {
  if (!isMobile) return baseVariant;

  // Reduce animation intensity for mobile
  const mobileVariant = { ...baseVariant };
  
  if (mobileVariant.animate && typeof mobileVariant.animate === 'object') {
    const animate = mobileVariant.animate as any;
    if (animate.transition) {
      animate.transition.duration = animate.transition.duration * 0.75; // 25% faster on mobile
    }
  }

  return mobileVariant;
}

/**
 * Accessibility-aware variants
 */
export function createAccessibleVariant(
  baseVariant: Variants,
  prefersReducedMotion: boolean = false
): Variants {
  if (!prefersReducedMotion) return baseVariant;

  // Create reduced motion version
  const reducedVariant = { ...baseVariant };
  
  if (reducedVariant.animate && typeof reducedVariant.animate === 'object') {
    const animate = reducedVariant.animate as any;
    if (animate.transition) {
      animate.transition.duration = 0.01; // Nearly instant
    }
  }

  return reducedVariant;
}

/**
 * Export all variants as a collection
 */
export const motionVariants = {
  // Core animations
  fadeInUp,
  fadeInUpFast,
  
  // Containers
  staggerContainer,
  staggerContainerFast,
  
  // Cards
  cardEntrance,
  cardHover,
  interactiveCard,
  
  // Interactions
  touchFeedback,
  buttonHover,
  
  // Icons
  iconHover,
  iconBounce,
  
  // Scroll
  scrollReveal,
  scrollRevealLeft,
  scrollRevealRight,
  
  // States
  fadeInOut,
  slideInOut,
  
  // Utilities
  createStaggeredEntrance,
  createCardHover,
  createResponsiveVariant,
  createAccessibleVariant
};

export default motionVariants;