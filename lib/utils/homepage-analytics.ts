'use client'

import { event, trackEvent } from '@/lib/analytics'

// Track 3-second rule compliance
export const track3SecondRule = () => {
  const startTime = performance.now()
  
  // Check if main hero section is visible without scrolling
  const checkValueVisibility = () => {
    const heroElement = document.querySelector('main section:first-child, .hero-section, [data-testid="hero"]')
    if (heroElement) {
      const rect = heroElement.getBoundingClientRect()
      const isVisible = rect.top >= 0 && rect.top <= window.innerHeight
      const timeToValue = performance.now() - startTime
      
      trackEvent.homepage.threeSecondRule(isVisible && timeToValue <= 3000, timeToValue)
    }
  }

  // Check after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkValueVisibility)
  } else {
    setTimeout(checkValueVisibility, 100)
  }
}

// Track section visibility and time spent
export const trackSectionView = (sectionName: string) => {
  let startTime: number
  let isVisible = false

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible) {
          isVisible = true
          startTime = performance.now()
          trackEvent.homepage.sectionView(sectionName)
        } else if (!entry.isIntersecting && isVisible) {
          isVisible = false
          const timeSpent = performance.now() - startTime
          trackEvent.homepage.sectionView(`${sectionName}_exit`, timeSpent)
        }
      })
    },
    { threshold: 0.5 }
  )

  return observer
}

// Track CTA clicks with context
export const trackCTAClick = (
  ctaType: 'primary' | 'secondary',
  location: string,
  text: string,
  additionalData?: Record<string, string>
) => {
  trackEvent.homepage.ctaClick(ctaType, location, text)
  
  // Track additional context if provided
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      event({
        action: 'cta_context',
        category: 'Homepage CTA Context',
        label: `${key}:${value}`,
      })
    })
  }
}

// Track audience path selection
export const trackAudienceSelection = (
  audienceType: 'startup' | 'enterprise',
  source: string,
  previousPath?: string
) => {
  trackEvent.homepage.pathSelection(audienceType, source)
  
  // Track path switching if applicable
  if (previousPath && previousPath !== audienceType) {
    event({
      action: 'audience_switch',
      category: 'Homepage Conversion',
      label: `${previousPath}_to_${audienceType}`,
    })
  }
}

// Track metrics interaction
export const trackMetricsInteraction = (
  metricType: string,
  action: 'view' | 'hover' | 'click',
  value?: string
) => {
  trackEvent.homepage.metricsEngagement(metricType, action)
  
  if (value) {
    event({
      action: 'metric_value_focus',
      category: 'Homepage Metrics Detail',
      label: `${metricType}:${value}`,
    })
  }
}

// Track comparison table interactions
export const trackComparisonInteraction = (
  action: 'view' | 'feature_focus' | 'cta_click',
  feature?: string,
  competitorType?: string
) => {
  trackEvent.homepage.comparisonInteraction(action, feature)
  
  if (competitorType) {
    event({
      action: 'competitor_focus',
      category: 'Homepage Comparison Detail',
      label: `${feature}:${competitorType}`,
    })
  }
}

// Track hero engagement with timing
export const trackHeroEngagement = (
  action: 'view' | 'cta_click' | 'path_select',
  details?: string,
  timeOnHero?: number
) => {
  trackEvent.homepage.heroEngagement(action, details)
  
  if (timeOnHero) {
    event({
      action: 'hero_time_spent',
      category: 'Homepage Hero Engagement',
      label: details || 'general',
      value: Math.round(timeOnHero),
    })
  }
}

// Initialize homepage analytics
export const initializeHomepageAnalytics = () => {
  // Track initial page load
  trackEvent.homepage.sectionView('page_load')
  
  // Start 3-second rule tracking
  track3SecondRule()
  
  // Track scroll depth
  let maxScrollDepth = 0
  const trackScrollDepth = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )
    
    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent
      
      // Track milestone scroll depths
      if ([25, 50, 75, 90].includes(scrollPercent)) {
        event({
          action: 'scroll_depth',
          category: 'Homepage Engagement',
          label: `${scrollPercent}%`,
          value: scrollPercent,
        })
      }
    }
  }
  
  window.addEventListener('scroll', trackScrollDepth, { passive: true })
  
  // Track page exit
  window.addEventListener('beforeunload', () => {
    event({
      action: 'page_exit',
      category: 'Homepage Engagement',
      label: 'final_scroll_depth',
      value: maxScrollDepth,
    })
  })
}