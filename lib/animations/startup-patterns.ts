/**
 * Startup Page Animation Patterns
 * 
 * Extracted from the working startup page animations to ensure consistency
 * across all components. These patterns provide the exact timing, easing,
 * and class combinations that make the startup page look great.
 */

// Core animation variants (exact from startup page)
export const startupAnimationVariants = {
  // Standard entrance animation used throughout startup page
  entrance: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    // Default transition - can be overridden with delay
    transition: { duration: 0.6 }
  },

  // Section header animation
  sectionHeader: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  }
} as const;

// Stagger timing function (exact from startup page)
export const getStaggerDelay = (index: number): number => {
  return index * 0.1; // 100ms delay between items
};

// Hover and interaction classes (exact from startup page)
export const startupInteractionClasses = {
  // Card hover effects
  cardHover: "hover:shadow-lg transition-all duration-300",
  
  // Mobile touch feedback
  mobileTouch: "active:scale-[0.98] sm:active:scale-100",
  
  // Combined card interaction (most common pattern)
  cardInteraction: "hover:shadow-lg active:scale-[0.98] sm:active:scale-100 transition-all duration-300",
  
  // Button hover (for CTAs)
  buttonHover: "hover:shadow-xl transition-all duration-300"
} as const;

// Grid layout classes (exact from startup page)
export const startupGridClasses = {
  // Two column grid (challenges section)
  twoColumn: "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8",
  
  // Three column grid (services section)
  threeColumn: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8",
  
  // Four column grid (metrics)
  fourColumn: "grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
} as const;

// Container classes (exact from startup page)
export const startupContainerClasses = {
  section: "py-20",
  container: "container mx-auto px-4",
  textCenter: "text-center mb-12 sm:mb-16",
  maxWidth: "max-w-6xl mx-auto"
} as const;

// Responsive card props (matching startup page usage)
export const startupCardProps = {
  service: {
    variant: "service" as const,
    enableHover: true,
    enableTouch: true,
    className: "h-full active:scale-[0.98] sm:active:scale-100"
  }
} as const;

/**
 * Creates motion props for entrance animation with optional stagger delay
 */
export function createEntranceAnimation(index?: number) {
  return {
    initial: startupAnimationVariants.entrance.initial,
    whileInView: startupAnimationVariants.entrance.animate,
    transition: {
      ...startupAnimationVariants.entrance.transition,
      ...(typeof index === 'number' && { delay: getStaggerDelay(index) })
    }
  };
}

/**
 * Creates motion props for section header animation
 */
export function createSectionHeaderAnimation() {
  return {
    initial: startupAnimationVariants.sectionHeader.initial,
    whileInView: startupAnimationVariants.sectionHeader.animate,
    transition: startupAnimationVariants.sectionHeader.transition
  };
}

/**
 * Combines all card interaction classes
 */
export function getCardInteractionClasses(additionalClasses?: string): string {
  return `${startupInteractionClasses.cardInteraction} ${additionalClasses || ''}`.trim();
}

/**
 * Creates complete card animation props with interaction classes
 */
export function createCardAnimation(index?: number, additionalClasses?: string) {
  return {
    ...createEntranceAnimation(index),
    className: getCardInteractionClasses(additionalClasses)
  };
}

/**
 * Standard viewport options for whileInView animations
 */
export const startupViewportOptions = {
  once: true,
  margin: "-50px"
} as const;

// Export all patterns for easy importing
export const startupPatterns = {
  variants: startupAnimationVariants,
  interactions: startupInteractionClasses,
  grids: startupGridClasses,
  containers: startupContainerClasses,
  cardProps: startupCardProps,
  createEntranceAnimation,
  createSectionHeaderAnimation,
  createCardAnimation,
  getCardInteractionClasses,
  getStaggerDelay,
  viewport: startupViewportOptions
} as const;

export default startupPatterns;