'use client'

// Mobile-first optimization utilities for homepage

// Check if device is mobile
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

// Check if content is above the fold on mobile
export const isAboveFoldMobile = (element: HTMLElement): boolean => {
  if (!isMobileDevice()) return true
  
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  
  // Consider content above the fold if it's in the top 70% of viewport
  return rect.top < viewportHeight * 0.7
}

// Optimize touch interactions for mobile
export const optimizeTouchInteraction = (element: HTMLElement) => {
  if (!isMobileDevice()) return
  
  // Add touch-friendly styles
  element.style.minHeight = '44px' // iOS recommended minimum
  element.style.minWidth = '44px'
  element.style.cursor = 'pointer'
  
  // Add touch feedback
  element.addEventListener('touchstart', () => {
    element.style.opacity = '0.8'
  }, { passive: true })
  
  element.addEventListener('touchend', () => {
    element.style.opacity = '1'
  }, { passive: true })
}

// Check 3-second rule compliance on mobile
export const checkMobile3SecondRule = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!isMobileDevice()) {
      resolve(true)
      return
    }
    
    const startTime = performance.now()
    
    const checkValueVisibility = () => {
      const heroSection = document.querySelector('main section:first-child, .hero-section, [data-testid="hero"]')
      const mainContent = document.querySelector('main')
      
      if (heroSection && mainContent) {
        const heroVisible = isAboveFoldMobile(heroSection as HTMLElement)
        const timeElapsed = performance.now() - startTime
        
        const compliant = heroVisible && timeElapsed <= 3000
        resolve(compliant)
      } else {
        resolve(false)
      }
    }
    
    // Check after content loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkValueVisibility)
    } else {
      setTimeout(checkValueVisibility, 100)
    }
  })
}

// Progressive enhancement for mobile interactions
export const enhanceMobileInteractions = () => {
  if (!isMobileDevice()) return
  
  // Add swipe gestures for audience selection
  let touchStartX = 0
  let touchStartY = 0
  
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }, { passive: true })
  
  document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY
    
    // Horizontal swipe detection
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      const audienceSection = document.getElementById('audience-segmentation')
      if (audienceSection && isElementInViewport(audienceSection)) {
        // Trigger audience selection based on swipe direction
        const event = new CustomEvent('audienceSwipe', {
          detail: { direction: deltaX > 0 ? 'right' : 'left' }
        })
        document.dispatchEvent(event)
      }
    }
  }, { passive: true })
}

// Check if element is in viewport
const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  )
}

// Optimize images for mobile
export const optimizeImagesForMobile = () => {
  if (!isMobileDevice()) return
  
  const images = document.querySelectorAll('img')
  images.forEach((img) => {
    // Add loading="lazy" for performance
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy')
    }
    
    // Optimize image sizes for mobile
    if (img.hasAttribute('data-mobile-src')) {
      img.src = img.getAttribute('data-mobile-src') || img.src
    }
  })
}

// Mobile-specific viewport meta optimization
export const optimizeViewportForMobile = () => {
  if (typeof document === 'undefined') return
  
  let viewport = document.querySelector('meta[name="viewport"]')
  if (!viewport) {
    viewport = document.createElement('meta')
    viewport.setAttribute('name', 'viewport')
    document.head.appendChild(viewport)
  }
  
  // Optimize for mobile with proper scaling
  viewport.setAttribute(
    'content',
    'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
  )
}

// Initialize all mobile optimizations
export const initializeMobileOptimizations = () => {
  if (typeof window === 'undefined') return
  
  optimizeViewportForMobile()
  enhanceMobileInteractions()
  optimizeImagesForMobile()
  
  // Check 3-second rule compliance
  checkMobile3SecondRule().then((compliant) => {
    console.log('Mobile 3-second rule compliance:', compliant)
  })
}