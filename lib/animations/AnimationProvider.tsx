'use client';

/**
 * Animation Provider System
 * 
 * Global context provider for animation settings, device capability detection,
 * and performance optimization. Provides startup-quality animation management
 * across the entire application.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ANIMATION_CONFIG } from './config';

// Animation quality levels
export type AnimationQuality = 'high' | 'medium' | 'low' | 'disabled';

// Device capability detection
export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
  batteryLevel?: number;
  isLowPowerMode: boolean;
  connectionSpeed: 'slow' | 'fast' | 'unknown';
  hardwareAcceleration: boolean;
}

// Animation settings
export interface AnimationSettings {
  quality: AnimationQuality;
  enableAnimations: boolean;
  enableStagger: boolean;
  enableHover: boolean;
  enableScrollAnimations: boolean;
  respectReducedMotion: boolean;
  performanceMode: boolean;
}

// Animation context interface
export interface AnimationContextType {
  // Device capabilities
  device: DeviceCapabilities;
  
  // Animation settings
  settings: AnimationSettings;
  
  // Control functions
  setAnimationQuality: (quality: AnimationQuality) => void;
  toggleAnimations: (enabled?: boolean) => void;
  setPerformanceMode: (enabled: boolean) => void;
  
  // Utility functions
  shouldAnimate: (animationType?: 'hover' | 'scroll' | 'stagger' | 'entrance') => boolean;
  getOptimizedDuration: (baseDuration: number) => number;
  getOptimizedDelay: (baseDelay: number) => number;
  
  // Performance monitoring
  reportPerformance: (animationName: string, duration: number, fps: number) => void;
  getPerformanceMetrics: () => Record<string, any>;
}

// Create context
const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

// Default device capabilities
const defaultDeviceCapabilities: DeviceCapabilities = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  prefersReducedMotion: false,
  isLowPowerMode: false,
  connectionSpeed: 'unknown',
  hardwareAcceleration: true
};

// Default animation settings
const defaultAnimationSettings: AnimationSettings = {
  quality: 'high',
  enableAnimations: true,
  enableStagger: true,
  enableHover: true,
  enableScrollAnimations: true,
  respectReducedMotion: true,
  performanceMode: false
};

/**
 * Animation Provider Component
 * 
 * Provides global animation context with device detection and performance optimization
 */
export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [device, setDevice] = useState<DeviceCapabilities>(defaultDeviceCapabilities);
  const [settings, setSettings] = useState<AnimationSettings>(defaultAnimationSettings);
  const [performanceMetrics, setPerformanceMetrics] = useState<Record<string, any>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-adjust animation quality based on device capabilities
  const autoAdjustAnimationQuality = useCallback((deviceCaps: DeviceCapabilities) => {
    let quality: AnimationQuality = 'high';
    let performanceMode = false;

    // Reduce quality for low-end devices
    if (deviceCaps.prefersReducedMotion) {
      quality = 'disabled';
    } else if (deviceCaps.isLowPowerMode || deviceCaps.connectionSpeed === 'slow') {
      quality = 'low';
      performanceMode = true;
    } else if (deviceCaps.isMobile && !deviceCaps.hardwareAcceleration) {
      quality = 'medium';
      performanceMode = true;
    }

    setSettings(prev => ({
      ...prev,
      quality,
      performanceMode,
      enableAnimations: quality !== 'disabled',
      respectReducedMotion: deviceCaps.prefersReducedMotion
    }));
  }, []);

  // Device detection on client side - Non-blocking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use requestIdleCallback for non-blocking device detection
    const detectDevice = () => {
      const performDetection = () => {
        try {
          const userAgent = navigator.userAgent.toLowerCase();
          const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent) || window.innerWidth < 768;
          const isTablet = /tablet|ipad/i.test(userAgent) || (window.innerWidth >= 768 && window.innerWidth < 1024);
          const isDesktop = !isMobile && !isTablet;

          // Check for reduced motion preference
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          // Simplified hardware acceleration check
          let hardwareAcceleration = true;
          try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            hardwareAcceleration = !!gl;
          } catch {
            hardwareAcceleration = false;
          }

          // Simplified connection detection
          const connection = (navigator as any).connection;
          let connectionSpeed: 'slow' | 'fast' | 'unknown' = 'unknown';
          
          if (connection) {
            const effectiveType = connection.effectiveType;
            connectionSpeed = ['slow-2g', '2g', '3g'].includes(effectiveType) ? 'slow' : 'fast';
          }

          const newDevice: DeviceCapabilities = {
            isMobile,
            isTablet,
            isDesktop,
            prefersReducedMotion,
            isLowPowerMode: false, // Simplified - no battery API dependency
            connectionSpeed,
            hardwareAcceleration
          };

          setDevice(newDevice);
          autoAdjustAnimationQuality(newDevice);
          setIsInitialized(true);
        } catch (error) {
          console.warn('Device detection error:', error);
          setIsInitialized(true); // Still initialize with defaults
        }
      };

      // Use requestIdleCallback if available, otherwise setTimeout with minimal delay
      if ('requestIdleCallback' in window) {
        requestIdleCallback(performDetection);
      } else {
        setTimeout(performDetection, 1);
      }
    };

    detectDevice();

    // Lightweight event listeners
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(detectDevice);
      } else {
        setTimeout(detectDevice, 1);
      }
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    window.addEventListener('resize', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('resize', handleMediaChange);
    };
  }, [autoAdjustAnimationQuality]);

  // Control functions
  const setAnimationQuality = useCallback((quality: AnimationQuality) => {
    setSettings(prev => ({
      ...prev,
      quality,
      enableAnimations: quality !== 'disabled'
    }));
  }, []);

  const toggleAnimations = useCallback((enabled?: boolean) => {
    setSettings(prev => ({
      ...prev,
      enableAnimations: enabled !== undefined ? enabled : !prev.enableAnimations,
      quality: enabled === false ? 'disabled' : prev.quality === 'disabled' ? 'high' : prev.quality
    }));
  }, []);

  const setPerformanceMode = useCallback((enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      performanceMode: enabled,
      quality: enabled ? 'low' : 'high'
    }));
  }, []);

  // Utility functions
  const shouldAnimate = useCallback((animationType?: 'hover' | 'scroll' | 'stagger' | 'entrance') => {
    if (!settings.enableAnimations || settings.quality === 'disabled') {
      return false;
    }

    if (device.prefersReducedMotion && settings.respectReducedMotion) {
      return false;
    }

    // Check specific animation types
    switch (animationType) {
      case 'hover':
        return settings.enableHover && !device.isMobile; // Disable hover on mobile
      case 'scroll':
        return settings.enableScrollAnimations;
      case 'stagger':
        return settings.enableStagger && settings.quality !== 'low';
      case 'entrance':
      default:
        return true;
    }
  }, [settings, device]);

  const getOptimizedDuration = useCallback((baseDuration: number) => {
    if (!settings.enableAnimations) return 0.01;

    switch (settings.quality) {
      case 'disabled':
        return 0.01;
      case 'low':
        return baseDuration * 0.5; // 50% faster
      case 'medium':
        return baseDuration * 0.75; // 25% faster
      case 'high':
      default:
        return baseDuration;
    }
  }, [settings.quality, settings.enableAnimations]);

  const getOptimizedDelay = useCallback((baseDelay: number) => {
    if (!settings.enableAnimations || settings.quality === 'disabled') return 0;

    switch (settings.quality) {
      case 'low':
        return baseDelay * 0.5; // Reduce stagger delays
      case 'medium':
        return baseDelay * 0.75;
      case 'high':
      default:
        return baseDelay;
    }
  }, [settings.quality, settings.enableAnimations]);

  // Performance monitoring
  const reportPerformance = useCallback((animationName: string, duration: number, fps: number) => {
    setPerformanceMetrics(prev => ({
      ...prev,
      [animationName]: {
        duration,
        fps,
        timestamp: Date.now(),
        quality: settings.quality
      }
    }));

    // Auto-adjust quality if performance is poor
    if (fps < 30 && settings.quality === 'high') {
      console.warn(`Animation performance warning: ${animationName} running at ${fps}fps`);
      setAnimationQuality('medium');
    }
  }, [settings.quality, setAnimationQuality]);

  const getPerformanceMetrics = useCallback(() => {
    return performanceMetrics;
  }, [performanceMetrics]);

  // Context value
  const contextValue: AnimationContextType = {
    device,
    settings,
    setAnimationQuality,
    toggleAnimations,
    setPerformanceMode,
    shouldAnimate,
    getOptimizedDuration,
    getOptimizedDelay,
    reportPerformance,
    getPerformanceMetrics
  };

  // Server-side rendering fallback
  if (!isInitialized) {
    return (
      <AnimationContext.Provider value={contextValue}>
        {children}
      </AnimationContext.Provider>
    );
  }

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
}

/**
 * Hook to use animation context
 */
export function useAnimation(): AnimationContextType {
  const context = useContext(AnimationContext);
  
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  
  return context;
}

/**
 * Hook for conditional animation rendering
 */
export function useConditionalAnimation(animationType?: 'hover' | 'scroll' | 'stagger' | 'entrance') {
  const { shouldAnimate, getOptimizedDuration, getOptimizedDelay, settings } = useAnimation();
  
  return {
    shouldAnimate: shouldAnimate(animationType),
    duration: getOptimizedDuration(ANIMATION_CONFIG.durations.normal),
    delay: getOptimizedDelay(ANIMATION_CONFIG.stagger.base),
    quality: settings.quality,
    isPerformanceMode: settings.performanceMode
  };
}

/**
 * Hook for responsive animation variants
 */
export function useResponsiveAnimation() {
  const { device, settings, getOptimizedDuration, getOptimizedDelay } = useAnimation();
  
  return {
    // Device-specific animation adjustments
    isMobile: device.isMobile,
    isDesktop: device.isDesktop,
    prefersReducedMotion: device.prefersReducedMotion,
    
    // Optimized timing functions
    getDuration: (base: number) => getOptimizedDuration(base),
    getDelay: (base: number) => getOptimizedDelay(base),
    
    // Quality-based feature flags
    enableStagger: settings.enableStagger && settings.quality !== 'low',
    enableHover: settings.enableHover && !device.isMobile,
    enableScrollAnimations: settings.enableScrollAnimations,
    
    // Performance mode adjustments
    isPerformanceMode: settings.performanceMode,
    quality: settings.quality
  };
}

/**
 * Higher-order component to wrap components with animation provider
 */
export function withAnimationProvider<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WrappedComponent(props: P) {
    return (
      <AnimationProvider>
        <Component {...props} />
      </AnimationProvider>
    );
  };
}

/**
 * Utility function to create animation-aware components
 */
export function createAnimationAwareComponent<P extends object>(
  Component: React.ComponentType<P & { animationProps?: any }>
) {
  return function AnimationAwareComponent(props: P) {
    const animationProps = useConditionalAnimation();
    
    return (
      <Component 
        {...props} 
        animationProps={animationProps}
      />
    );
  };
}

export default AnimationProvider;