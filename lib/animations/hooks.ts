/**
 * Animation Utility Hooks
 * React hooks for easy integration of proven animation patterns
 * 
 * These hooks make it simple to add startup-quality animations to existing
 * components without complex setup or configuration.
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useInView } from 'framer-motion';
import { Variants } from 'framer-motion';
import { 
  fadeInUp, 
  cardEntrance, 
  staggerContainer, 
  createStaggeredEntrance,
  createResponsiveVariant,
  createAccessibleVariant
} from './variants';
import { STAGGER_DELAYS } from './config';

/**
 * Hook for detecting user's motion preferences
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for detecting mobile devices
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

/**
 * Hook for battery-conscious animations on mobile
 */
export function useBatteryConscious(): boolean {
  const [isBatteryLow, setIsBatteryLow] = useState(false);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          setIsBatteryLow(battery.level < 0.2 && !battery.charging);
        };

        updateBatteryStatus();
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);

        return () => {
          battery.removeEventListener('levelchange', updateBatteryStatus);
          battery.removeEventListener('chargingchange', updateBatteryStatus);
        };
      });
    }
  }, []);

  return isBatteryLow;
}

/**
 * Hook for staggered animations - matches startup page patterns
 */
export function useStaggeredAnimation(itemCount: number, baseDelay: number = 0) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  return useMemo(() => {
    const variants = Array.from({ length: itemCount }, (_, index) => {
      let variant = createStaggeredEntrance(index, baseDelay);
      
      if (isMobile) {
        variant = createResponsiveVariant(variant, true);
      }
      
      if (prefersReducedMotion) {
        variant = createAccessibleVariant(variant, true);
      }
      
      return variant;
    });

    return {
      container: staggerContainer,
      items: variants
    };
  }, [itemCount, baseDelay, prefersReducedMotion, isMobile]);
}

/**
 * Hook for responsive animations that adapt to device capabilities
 */
export function useResponsiveAnimation(baseVariant: Variants) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const isBatteryLow = useBatteryConscious();

  return useMemo(() => {
    let variant = baseVariant;

    // Apply mobile optimizations
    if (isMobile || isBatteryLow) {
      variant = createResponsiveVariant(variant, true);
    }

    // Apply accessibility preferences
    if (prefersReducedMotion) {
      variant = createAccessibleVariant(variant, true);
    }

    return variant;
  }, [baseVariant, prefersReducedMotion, isMobile, isBatteryLow]);
}

/**
 * Hook for scroll-triggered animations with viewport detection
 */
export function useScrollAnimation(
  threshold: number = 0.1,
  triggerOnce: boolean = true
) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const baseVariant = useMemo(() => {
    let variant = fadeInUp;
    
    if (isMobile) {
      variant = createResponsiveVariant(variant, true);
    }
    
    if (prefersReducedMotion) {
      variant = createAccessibleVariant(variant, true);
    }
    
    return variant;
  }, [prefersReducedMotion, isMobile]);

  const viewportOptions = useMemo(() => ({
    threshold,
    triggerOnce,
    margin: isMobile ? '-50px' : '-100px' // Trigger earlier on mobile
  }), [threshold, triggerOnce, isMobile]);

  return {
    variant: baseVariant,
    viewport: viewportOptions
  };
}

/**
 * Hook for card animations - matches startup card quality
 */
export function useCardAnimation(index: number = 0) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  return useMemo(() => {
    let variant = createStaggeredEntrance(index);
    
    if (isMobile) {
      variant = createResponsiveVariant(variant, true);
    }
    
    if (prefersReducedMotion) {
      variant = createAccessibleVariant(variant, true);
    }
    
    return variant;
  }, [index, prefersReducedMotion, isMobile]);
}

/**
 * Hook for managing animation performance
 */
export function useAnimationPerformance() {
  const [isHighPerformance, setIsHighPerformance] = useState(true);

  useEffect(() => {
    // Check for performance indicators
    const checkPerformance = () => {
      const connection = (navigator as any).connection;
      const isSlowConnection = connection && 
        (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
      
      const isLowEndDevice = navigator.hardwareConcurrency && 
        navigator.hardwareConcurrency <= 2;

      setIsHighPerformance(!isSlowConnection && !isLowEndDevice);
    };

    checkPerformance();
  }, []);

  return {
    isHighPerformance,
    shouldReduceAnimations: !isHighPerformance
  };
}

/**
 * Hook for startup-quality interactive animations
 */
export function useInteractiveAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { shouldReduceAnimations } = useAnimationPerformance();

  return useMemo(() => {
    if (prefersReducedMotion || shouldReduceAnimations) {
      return {
        whileHover: {},
        whileTap: {},
        transition: { duration: 0.01 }
      };
    }

    return {
      whileHover: { 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3 }
      },
      whileTap: { 
        scale: 0.98,
        transition: { duration: 0.15 }
      }
    };
  }, [prefersReducedMotion, shouldReduceAnimations]);
}

/**
 * Hook for enhanced ResponsiveCard integration
 */
export function useEnhancedCard(index: number = 0) {
  const cardVariant = useCardAnimation(index);
  const interactiveProps = useInteractiveAnimation();
  const { shouldReduceAnimations } = useAnimationPerformance();

  return {
    // Framer Motion props
    variants: cardVariant,
    initial: "initial",
    animate: "animate",
    ...(!shouldReduceAnimations && interactiveProps),
    
    // CSS classes for fallback
    className: shouldReduceAnimations 
      ? "transition-all duration-150" 
      : "hover:shadow-xl active:scale-[0.98] transition-all duration-300"
  };
}

/**
 * Hook for section animations with scroll detection
 */
export function useEnhancedSection() {
  const { variant, viewport } = useScrollAnimation();
  const prefersReducedMotion = useReducedMotion();

  return {
    variants: variant,
    initial: "initial",
    whileInView: "animate",
    viewport,
    
    // CSS fallback
    className: prefersReducedMotion 
      ? "" 
      : "animate-fade-in-up"
  };
}

/**
 * Hook for grid animations with staggered children
 */
export function useEnhancedGrid(itemCount: number) {
  const { container, items } = useStaggeredAnimation(itemCount);
  const prefersReducedMotion = useReducedMotion();

  return {
    containerProps: {
      variants: container,
      initial: "initial",
      animate: "animate"
    },
    itemProps: (index: number) => ({
      variants: items[index] || items[0],
      initial: "initial",
      animate: "animate"
    }),
    
    // CSS fallback
    containerClassName: prefersReducedMotion ? "" : "stagger-container",
    itemClassName: (index: number) => 
      prefersReducedMotion ? "" : `stagger-item delay-${index * 100}`
  };
}

/**
 * Utility function to get startup-quality animation classes
 */
export function useStartupAnimationClasses() {
  const prefersReducedMotion = useReducedMotion();
  const { shouldReduceAnimations } = useAnimationPerformance();

  return useMemo(() => {
    if (prefersReducedMotion || shouldReduceAnimations) {
      return {
        card: "transition-opacity duration-150",
        section: "",
        button: "transition-transform duration-150",
        icon: "transition-transform duration-150"
      };
    }

    return {
      card: "hover:shadow-xl active:scale-[0.98] transition-all duration-300",
      section: "animate-fade-in-up",
      button: "hover:scale-105 active:scale-95 transition-transform duration-200",
      icon: "hover:scale-110 hover:rotate-3 transition-transform duration-200"
    };
  }, [prefersReducedMotion, shouldReduceAnimations]);
}

/**
 * Hook for automatic animation cleanup
 */
export function useAnimationCleanup() {
  const [animationRefs] = useState(new Set<HTMLElement>());

  const registerElement = useCallback((element: HTMLElement | null) => {
    if (element) {
      animationRefs.add(element);
    }
  }, [animationRefs]);

  const unregisterElement = useCallback((element: HTMLElement | null) => {
    if (element) {
      animationRefs.delete(element);
    }
  }, [animationRefs]);

  useEffect(() => {
    return () => {
      // Cleanup any running animations
      animationRefs.forEach(element => {
        if (element.style) {
          element.style.willChange = 'auto';
        }
      });
      animationRefs.clear();
    };
  }, [animationRefs]);

  return { registerElement, unregisterElement };
}

/**
 * Export all hooks for easy importing
 */
export const animationHooks = {
  useReducedMotion,
  useIsMobile,
  useBatteryConscious,
  useStaggeredAnimation,
  useResponsiveAnimation,
  useScrollAnimation,
  useCardAnimation,
  useAnimationPerformance,
  useInteractiveAnimation,
  useEnhancedCard,
  useEnhancedSection,
  useEnhancedGrid,
  useStartupAnimationClasses,
  useAnimationCleanup
};

export default animationHooks;