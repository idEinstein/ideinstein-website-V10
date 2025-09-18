/**
 * Animation Performance Optimization Utilities
 * 
 * Comprehensive performance optimization functions for animations,
 * including hardware acceleration, scroll observers, throttling,
 * cleanup, and metrics collection.
 */

import { ANIMATION_CONFIG } from './config';

// Performance monitoring types
export interface AnimationPerformanceMetrics {
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  fps: number;
  frameCount: number;
  droppedFrames: number;
  memoryUsage?: number;
  cpuUsage?: number;
}

export interface PerformanceThresholds {
  minFPS: number;
  maxDuration: number;
  maxMemoryUsage: number;
  warningThreshold: number;
}

// Default performance thresholds
const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  minFPS: 30,
  maxDuration: 1000, // 1 second
  maxMemoryUsage: 50 * 1024 * 1024, // 50MB
  warningThreshold: 0.8 // 80% of threshold
};

// Global performance state (removed unused variables)

/**
 * Hardware Acceleration Optimization
 * 
 * Optimizes animations for hardware acceleration and GPU rendering
 */
export function optimizeAnimation(element: HTMLElement, animationName: string): () => void {
  if (!element) return () => {};

  // Force hardware acceleration
  element.style.willChange = 'transform, opacity';
  element.style.transform = 'translateZ(0)'; // Force GPU layer
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';

  // Optimize for specific animation types
  if (animationName.includes('scale') || animationName.includes('hover')) {
    element.style.willChange += ', scale';
  }

  if (animationName.includes('scroll') || animationName.includes('parallax')) {
    element.style.willChange += ', scroll-position';
  }

  // Clean up will-change after animation
  const cleanup = () => {
    element.style.willChange = 'auto';
  };

  // Auto-cleanup after reasonable time
  setTimeout(cleanup, 2000);

  return cleanup;
}

/**
 * Efficient Scroll-Triggered Animation Observer
 * 
 * Creates optimized intersection observer for scroll-triggered animations
 */
export function createAnimationObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px 0px', // Trigger slightly before element is visible
    threshold: [0, 0.1, 0.5, 1.0], // Multiple thresholds for smooth animations
    ...options
  };

  // Add performance monitoring
  const originalCallback = callback;
  const monitoredCallback = (entries: IntersectionObserverEntry[]) => {
    const startTime = performance.now();
    originalCallback(entries);
    const endTime = performance.now();
    
    // Log performance if callback takes too long
    if (endTime - startTime > 16) { // More than one frame
      console.warn(`Scroll animation callback took ${endTime - startTime}ms`);
    }
  };

  return new IntersectionObserver(monitoredCallback, defaultOptions);
}

/**
 * Animation Throttling Utility
 * 
 * Throttles animation functions for performance-conscious timing
 */
export function throttleAnimations<T extends (...args: any[]) => any>(
  func: T,
  limit: number = 16 // Default to ~60fps
): T {
  let inThrottle: boolean = false;
  let lastResult: ReturnType<T>;

  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    
    return lastResult;
  }) as T;
}

/**
 * Debounced Animation Utility
 * 
 * Debounces animation triggers to prevent excessive calls
 */
export function debounceAnimations<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 100
): T {
  let timeoutId: NodeJS.Timeout;

  return ((...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

/**
 * Animation Cleanup and Memory Management
 * 
 * Comprehensive cleanup system for animations and event listeners
 */
export class AnimationCleanupManager {
  private cleanupFunctions: Set<() => void> = new Set();
  private observers: Set<IntersectionObserver | ResizeObserver | MutationObserver> = new Set();
  private timeouts: Set<NodeJS.Timeout> = new Set();
  private intervals: Set<NodeJS.Timeout> = new Set();
  private eventListeners: Set<{ element: Element; event: string; handler: EventListener }> = new Set();

  // Register cleanup function
  addCleanup(cleanup: () => void): void {
    this.cleanupFunctions.add(cleanup);
  }

  // Register observer
  addObserver(observer: IntersectionObserver | ResizeObserver | MutationObserver): void {
    this.observers.add(observer);
  }

  // Register timeout
  addTimeout(timeout: NodeJS.Timeout): void {
    this.timeouts.add(timeout);
  }

  // Register interval
  addInterval(interval: NodeJS.Timeout): void {
    this.intervals.add(interval);
  }

  // Register event listener
  addEventListener(element: Element, event: string, handler: EventListener): void {
    element.addEventListener(event, handler);
    this.eventListeners.add({ element, event, handler });
  }

  // Clean up all registered resources
  cleanup(): void {
    // Execute cleanup functions
    this.cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Animation cleanup error:', error);
      }
    });

    // Disconnect observers
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Observer cleanup error:', error);
      }
    });

    // Clear timeouts
    this.timeouts.forEach(timeout => {
      clearTimeout(timeout);
    });

    // Clear intervals
    this.intervals.forEach(interval => {
      clearInterval(interval);
    });

    // Remove event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      try {
        element.removeEventListener(event, handler);
      } catch (error) {
        console.warn('Event listener cleanup error:', error);
      }
    });

    // Clear all sets
    this.cleanupFunctions.clear();
    this.observers.clear();
    this.timeouts.clear();
    this.intervals.clear();
    this.eventListeners.clear();
  }
}

/**
 * Performance Monitoring and Metrics Collection
 * 
 * Comprehensive performance monitoring for animations
 */
export class AnimationPerformanceMonitor {
  private metrics: Map<string, AnimationPerformanceMetrics> = new Map();
  private thresholds: PerformanceThresholds;
  private isMonitoring: boolean = false;

  constructor(thresholds: Partial<PerformanceThresholds> = {}) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
  }

  // Start monitoring an animation
  startMonitoring(animationName: string): void {
    const startTime = performance.now();
    
    this.metrics.set(animationName, {
      name: animationName,
      startTime,
      endTime: 0,
      duration: 0,
      fps: 0,
      frameCount: 0,
      droppedFrames: 0,
      memoryUsage: this.getMemoryUsage()
    });

    // Start frame rate monitoring
    this.startFrameRateMonitoring(animationName);
  }

  // Stop monitoring an animation
  stopMonitoring(animationName: string): AnimationPerformanceMetrics | null {
    const metric = this.metrics.get(animationName);
    if (!metric) return null;

    const endTime = performance.now();
    metric.endTime = endTime;
    metric.duration = endTime - metric.startTime;
    metric.memoryUsage = this.getMemoryUsage();

    // Stop frame rate monitoring
    this.stopFrameRateMonitoring();

    // Check performance thresholds
    this.checkPerformanceThresholds(metric);

    return metric;
  }

  // Start frame rate monitoring
  private startFrameRateMonitoring(animationName: string): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    let frameCount = 0;
    let lastTime = performance.now();
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const monitorFrame = () => {
      if (!this.isMonitoring) return;

      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameInterval) {
        frameCount++;
        lastTime = currentTime;

        const metric = this.metrics.get(animationName);
        if (metric) {
          metric.frameCount = frameCount;
          metric.fps = Math.round(1000 / deltaTime);
          
          // Calculate dropped frames
          const expectedFrames = Math.floor(metric.duration / frameInterval);
          metric.droppedFrames = Math.max(0, expectedFrames - frameCount);
        }
      }

      requestAnimationFrame(monitorFrame);
    };

    requestAnimationFrame(monitorFrame);
  }

  // Stop frame rate monitoring
  private stopFrameRateMonitoring(): void {
    this.isMonitoring = false;
  }

  // Get memory usage (if available)
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  // Check performance thresholds and warn if exceeded
  private checkPerformanceThresholds(metric: AnimationPerformanceMetrics): void {
    const warnings: string[] = [];

    if (metric.fps < this.thresholds.minFPS) {
      warnings.push(`Low FPS: ${metric.fps} (minimum: ${this.thresholds.minFPS})`);
    }

    if (metric.duration > this.thresholds.maxDuration) {
      warnings.push(`Long duration: ${metric.duration}ms (maximum: ${this.thresholds.maxDuration}ms)`);
    }

    if (metric.memoryUsage && metric.memoryUsage > this.thresholds.maxMemoryUsage) {
      warnings.push(`High memory usage: ${Math.round(metric.memoryUsage / 1024 / 1024)}MB`);
    }

    if (warnings.length > 0) {
      console.warn(`Animation performance issues for "${metric.name}":`, warnings);
    }
  }

  // Get all metrics
  getMetrics(): Map<string, AnimationPerformanceMetrics> {
    return new Map(this.metrics);
  }

  // Get metrics for specific animation
  getMetric(animationName: string): AnimationPerformanceMetrics | undefined {
    return this.metrics.get(animationName);
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics.clear();
  }

  // Generate performance report
  generateReport(): string {
    const metrics = Array.from(this.metrics.values());
    
    if (metrics.length === 0) {
      return 'No animation performance data available.';
    }

    const avgFPS = metrics.reduce((sum, m) => sum + m.fps, 0) / metrics.length;
    const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
    const totalDroppedFrames = metrics.reduce((sum, m) => sum + m.droppedFrames, 0);

    return `
Animation Performance Report:
- Total animations monitored: ${metrics.length}
- Average FPS: ${Math.round(avgFPS)}
- Average duration: ${Math.round(avgDuration)}ms
- Total dropped frames: ${totalDroppedFrames}
- Performance issues: ${metrics.filter(m => 
  m.fps < this.thresholds.minFPS || 
  m.duration > this.thresholds.maxDuration
).length}
    `.trim();
  }
}

/**
 * Global Performance Utilities
 */

// Global performance monitor instance
export const globalPerformanceMonitor = new AnimationPerformanceMonitor();

// Global cleanup manager instance
export const globalCleanupManager = new AnimationCleanupManager();

/**
 * Utility function to optimize element for animations
 */
export function prepareElementForAnimation(
  element: HTMLElement,
  animationType: 'transform' | 'opacity' | 'scale' | 'scroll' = 'transform'
): () => void {
  if (!element) return () => {};

  // Apply optimization based on animation type
  switch (animationType) {
    case 'transform':
      element.style.willChange = 'transform';
      element.style.transform = 'translateZ(0)';
      break;
    case 'opacity':
      element.style.willChange = 'opacity';
      break;
    case 'scale':
      element.style.willChange = 'transform';
      element.style.transform = 'translateZ(0)';
      break;
    case 'scroll':
      element.style.willChange = 'scroll-position, transform';
      break;
  }

  // Force hardware acceleration
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';

  // Return cleanup function
  return () => {
    element.style.willChange = 'auto';
    element.style.transform = '';
    element.style.backfaceVisibility = '';
    element.style.perspective = '';
  };
}

/**
 * Batch animation updates for better performance
 */
export function batchAnimationUpdates(updates: (() => void)[]): void {
  requestAnimationFrame(() => {
    updates.forEach(update => {
      try {
        update();
      } catch (error) {
        console.warn('Batch animation update error:', error);
      }
    });
  });
}

/**
 * Check if device supports smooth animations
 */
export function supportsHardwareAcceleration(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for WebGL support (indicates GPU availability)
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return false;

  // Check for CSS transform3d support
  const testElement = document.createElement('div');
  testElement.style.transform = 'translate3d(0,0,0)';
  
  return testElement.style.transform !== '';
}

/**
 * Get optimal animation settings for current device
 */
export function getOptimalAnimationSettings(): {
  enableStagger: boolean;
  enableHover: boolean;
  enableScrollAnimations: boolean;
  maxConcurrentAnimations: number;
  preferredDuration: number;
} {
  const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);
  const hasHardwareAcceleration = supportsHardwareAcceleration();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return {
      enableStagger: false,
      enableHover: false,
      enableScrollAnimations: false,
      maxConcurrentAnimations: 1,
      preferredDuration: 0.1
    };
  }

  if (isMobile && !hasHardwareAcceleration) {
    return {
      enableStagger: false,
      enableHover: false,
      enableScrollAnimations: true,
      maxConcurrentAnimations: 2,
      preferredDuration: ANIMATION_CONFIG.durations.fast
    };
  }

  return {
    enableStagger: true,
    enableHover: !isMobile,
    enableScrollAnimations: true,
    maxConcurrentAnimations: 5,
    preferredDuration: ANIMATION_CONFIG.durations.normal
  };
}

/**
 * Export all utilities
 */
export const animationPerformanceUtils = {
  optimizeAnimation,
  createAnimationObserver,
  throttleAnimations,
  debounceAnimations,
  AnimationCleanupManager,
  AnimationPerformanceMonitor,
  globalPerformanceMonitor,
  globalCleanupManager,
  prepareElementForAnimation,
  batchAnimationUpdates,
  supportsHardwareAcceleration,
  getOptimalAnimationSettings
};

export default animationPerformanceUtils;