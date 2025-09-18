/**
 * Touch Optimization Utilities
 * Mobile touch interactions with desktop preservation
 */

export interface TouchOptimizationConfig {
  minTouchTarget: number;
  touchFeedback: boolean;
  preserveHover: boolean;
}

/**
 * Optimize element for touch interactions
 */
export function optimizeForTouch(
  baseClasses: string,
  config: TouchOptimizationConfig = {
    minTouchTarget: 44,
    touchFeedback: true,
    preserveHover: true
  }
): string {
  let touchClasses = baseClasses;
  
  // Add minimum touch target size
  if (config.minTouchTarget >= 44) {
    touchClasses += ' min-h-[44px] min-w-[44px]';
  }
  
  // Add touch feedback
  if (config.touchFeedback) {
    touchClasses += ' active:scale-95 transition-transform duration-150';
  }
  
  // Add touch manipulation for better performance
  touchClasses += ' touch-manipulation';
  
  // Preserve hover states for desktop
  if (config.preserveHover) {
    touchClasses += ' hover:opacity-90';
  }
  
  return touchClasses;
}

/**
 * Add visual touch feedback
 */
export function addTouchFeedback(
  baseClasses: string,
  feedbackType: 'scale' | 'opacity' | 'both' = 'both'
): string {
  let feedbackClasses = baseClasses;
  
  switch (feedbackType) {
    case 'scale':
      feedbackClasses += ' active:scale-95 transition-transform duration-150';
      break;
    case 'opacity':
      feedbackClasses += ' active:opacity-75 transition-opacity duration-150';
      break;
    case 'both':
      feedbackClasses += ' active:scale-95 active:opacity-90 transition-all duration-150';
      break;
  }
  
  return feedbackClasses;
}

/**
 * Validate touch targets meet WCAG requirements
 */
export function validateTouchTargets(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // WCAG AA requirement
  
  return rect.width >= minSize && rect.height >= minSize;
}

/**
 * Touch-friendly button classes
 */
export function touchFriendlyButton(
  size: 'sm' | 'md' | 'lg' = 'md'
): string {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[48px]'
  };
  
  return `${sizeClasses[size]} touch-manipulation active:scale-95 transition-transform duration-150`;
}

/**
 * Touch-friendly card classes
 */
export function touchFriendlyCard(): string {
  return optimizeForTouch(
    'cursor-pointer select-none',
    {
      minTouchTarget: 44,
      touchFeedback: true,
      preserveHover: true
    }
  );
}

/**
 * Touch-friendly link classes
 */
export function touchFriendlyLink(): string {
  return 'touch-manipulation active:opacity-75 transition-opacity duration-150 min-h-[44px] flex items-center';
}

/**
 * Touch-friendly input classes
 */
export function touchFriendlyInput(): string {
  return 'touch-manipulation min-h-[44px] text-base'; // Prevents zoom on iOS
}

/**
 * Generate touch-optimized spacing
 */
export function touchOptimizedSpacing(
  element: 'button' | 'link' | 'card' | 'input'
): string {
  const spacingMap = {
    button: 'px-4 py-3 m-1',
    link: 'px-2 py-3 m-1',
    card: 'p-4 m-2',
    input: 'px-3 py-3 m-1'
  };
  
  return spacingMap[element];
}

/**
 * Touch gesture prevention for specific elements
 */
export function preventTouchGestures(): string {
  return 'touch-none select-none';
}

/**
 * Enable smooth scrolling for touch devices
 */
export function smoothTouchScroll(): string {
  return 'overflow-auto scroll-smooth -webkit-overflow-scrolling-touch';
}

/**
 * Touch-friendly hover states that work on both mobile and desktop
 */
export function universalHover(hoverClasses: string): string {
  return `${hoverClasses} active:scale-95 touch-manipulation transition-all duration-200`;
}

/**
 * Responsive touch target sizing
 */
export function responsiveTouchTarget(
  mobile: string = 'min-h-[44px]',
  desktop: string = 'lg:min-h-[40px]'
): string {
  return `${mobile} ${desktop}`;
}

/**
 * Touch-optimized text selection
 */
export function touchTextSelection(selectable: boolean = true): string {
  return selectable ? 'select-text' : 'select-none touch-manipulation';
}

/**
 * Touch-friendly modal/overlay classes
 */
export function touchFriendlyOverlay(): string {
  return 'touch-manipulation overscroll-contain';
}

/**
 * Prevent accidental touches on sensitive elements
 */
export function preventAccidentalTouch(): string {
  return 'touch-manipulation select-none pointer-events-auto';
}

/**
 * Touch-optimized animation classes
 */
export function touchOptimizedAnimation(): string {
  return 'will-change-transform backface-visibility-hidden';
}