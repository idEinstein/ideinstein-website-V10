'use client'

// Performance optimization utilities for homepage

// Lazy loading utility for non-critical sections
export const createLazyLoader = (threshold = 0.1) => {
  if (typeof window === 'undefined') return null

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement
          
          // Trigger lazy loading
          if (element.dataset.lazyLoad) {
            const componentName = element.dataset.lazyLoad
            loadComponent(componentName, element)
          }
          
          // Load lazy images
          const lazyImages = element.querySelectorAll('img[data-lazy-src]')
          lazyImages.forEach((img) => {
            const imgElement = img as HTMLImageElement
            if (imgElement.dataset.lazySrc) {
              imgElement.src = imgElement.dataset.lazySrc
              imgElement.removeAttribute('data-lazy-src')
            }
          })
        }
      })
    },
    { threshold }
  )
}

// Dynamic component loading
const loadComponent = async (componentName: string, element: HTMLElement) => {
  try {
    // Component map for future lazy loading (currently no components configured)
    const componentMap: Record<string, () => Promise<any>> = {
      // Add dynamic imports here when lazy loading is implemented
    }

    if (componentMap[componentName]) {
      const Component = await componentMap[componentName]()
      // Component would be rendered here in actual implementation
      element.setAttribute('data-loaded', 'true')
    }
  } catch (error) {
    console.error(`Failed to load component: ${componentName}`, error)
    // Fallback content
    element.innerHTML = '<div class="text-center p-8 text-gray-500">Content temporarily unavailable</div>'
  }
}

// Image optimization
export const optimizeImages = () => {
  const images = document.querySelectorAll('img')
  
  images.forEach((img) => {
    // Add loading="lazy" if not present
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy')
    }
    
    // Add error handling
    img.addEventListener('error', () => {
      img.src = '/images/placeholder.svg' // Fallback image
      img.alt = 'Image temporarily unavailable'
    })
    
    // Optimize for different screen sizes
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset
    }
  })
}

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/images/hero-bg.webp',
    '/fonts/inter-var.woff2',
  ]
  
  criticalResources.forEach((resource) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource
    
    if (resource.includes('.woff2')) {
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
    } else if (resource.includes('.webp') || resource.includes('.jpg') || resource.includes('.png')) {
      link.as = 'image'
    }
    
    document.head.appendChild(link)
  })
}

// Performance monitoring
export const monitorPerformance = () => {
  if (typeof window === 'undefined') return

  // Monitor Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime)
      }
      
      if (entry.entryType === 'first-input') {
        console.log('FID:', (entry as any).processingStart - entry.startTime)
      }
      
      if (entry.entryType === 'layout-shift') {
        console.log('CLS:', (entry as any).value)
      }
    })
  })
  
  try {
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
  } catch (error) {
    console.warn('Performance observer not supported:', error)
  }
}

// Resource cleanup
export const cleanupResources = () => {
  // Clean up event listeners
  const elements = document.querySelectorAll('[data-cleanup]')
  elements.forEach((element) => {
    const events = element.getAttribute('data-cleanup')?.split(',') || []
    events.forEach((event) => {
      element.removeEventListener(event.trim(), () => {})
    })
  })
  
  // Clean up observers
  if (window.performanceObserver) {
    window.performanceObserver.disconnect()
  }
}

// Error boundary utility
export const createErrorBoundary = (fallbackContent: string) => {
  return (error: Error, errorInfo: any) => {
    console.error('Component error:', error, errorInfo)
    
    // Log to analytics
    if (window.gtag) {
      window.gtag('event', 'exception', {
        event_label: error.message,
        value: 0,
      })
    }
    
    return fallbackContent
  }
}

// Fallback content generators
export const generateFallbackContent = {
  hero: () => `
    <div class="text-center py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
      <h1 class="text-4xl font-bold mb-4">IdEinstein Engineering</h1>
      <p class="text-xl mb-8">Professional Engineering Services</p>
      <a href="/contact" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
        Get Started
      </a>
    </div>
  `,
  
  metrics: () => `
    <div class="grid grid-cols-3 gap-4 text-center">
      <div class="p-4 bg-gray-100 rounded-lg">
        <div class="text-2xl font-bold text-blue-600">26+</div>
        <div class="text-sm text-gray-600">Years Experience</div>
      </div>
      <div class="p-4 bg-gray-100 rounded-lg">
        <div class="text-2xl font-bold text-green-600">100%</div>
        <div class="text-sm text-gray-600">Success Rate</div>
      </div>
      <div class="p-4 bg-gray-100 rounded-lg">
        <div class="text-2xl font-bold text-purple-600">24h</div>
        <div class="text-sm text-gray-600">Response Time</div>
      </div>
    </div>
  `,
  
  comparison: () => `
    <div class="text-center p-8 bg-gray-50 rounded-lg">
      <h3 class="text-xl font-bold mb-4">Why Choose IdEinstein?</h3>
      <p class="text-gray-600 mb-4">26+ years of engineering excellence</p>
      <a href="/about" class="text-blue-600 hover:underline">Learn More</a>
    </div>
  `,
}

// Initialize all performance optimizations
export const initializePerformanceOptimizations = () => {
  if (typeof window === 'undefined') return

  // Preload critical resources
  preloadCriticalResources()
  
  // Optimize images
  optimizeImages()
  
  // Start performance monitoring
  monitorPerformance()
  
  // Set up lazy loading
  const lazyLoader = createLazyLoader()
  if (lazyLoader) {
    const lazyElements = document.querySelectorAll('[data-lazy-load]')
    lazyElements.forEach((element) => lazyLoader.observe(element))
  }
  
  // Clean up on page unload
  window.addEventListener('beforeunload', cleanupResources)
}

// Declare global performance observer
declare global {
  interface Window {
    performanceObserver?: PerformanceObserver
  }
}