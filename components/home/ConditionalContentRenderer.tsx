'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useAudience } from '@/lib/contexts/AudienceContext'
import { ConditionalContentProps } from '@/lib/types/audience'

export default function ConditionalContentRenderer({
  selectedAudience,
  startupContent,
  enterpriseContent,
  defaultContent,
  className = ''
}: ConditionalContentProps) {
  const { audienceState } = useAudience()

  // Use the audience from context if not provided as prop
  const currentAudience = selectedAudience || audienceState.selectedAudience

  // Track content engagement for analytics
  useEffect(() => {
    if (currentAudience && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'content_view', {
        audience_type: currentAudience,
        content_section: 'conditional_content',
        timestamp: new Date().toISOString()
      })
    }
  }, [currentAudience])

  // Animation variants for smooth transitions
  const contentVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  }

  // Render content based on audience selection
  const renderContent = () => {
    switch (currentAudience) {
      case 'startup':
        return (
          <motion.div
            key="startup-content"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            {startupContent}
          </motion.div>
        )
      
      case 'enterprise':
        return (
          <motion.div
            key="enterprise-content"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            {enterpriseContent}
          </motion.div>
        )
      
      default:
        // Show default content if no audience selected or if defaultContent is provided
        if (defaultContent) {
          return (
            <motion.div
              key="default-content"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              {defaultContent}
            </motion.div>
          )
        }
        
        // Default to startup content when no audience is selected
        // This prevents showing both contents simultaneously and provides a cleaner UX
        return (
          <motion.div
            key="default-startup-content"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            {/* Subtle indicator that startup path is shown by default */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Showing startup-focused content by default
                <button 
                  onClick={() => {
                    const element = document.getElementById('audience-segmentation')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Choose your path
                </button>
              </div>
            </div>
            {startupContent}
          </motion.div>
        )
    }
  }

  return (
    <div id="conditional-content" className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  )
}

// Hook for tracking content engagement
export function useContentEngagement() {
  const { audienceState } = useAudience()

  const trackEngagement = (section: string, action: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'content_engagement', {
        audience_type: audienceState.selectedAudience,
        section: section,
        action: action,
        timestamp: new Date().toISOString()
      })
    }
  }

  const trackScrollDepth = (section: string, depth: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'scroll_depth', {
        audience_type: audienceState.selectedAudience,
        section: section,
        depth: depth,
        timestamp: new Date().toISOString()
      })
    }
  }

  const trackCTAClick = (ctaType: string, destination: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_click', {
        audience_type: audienceState.selectedAudience,
        cta_type: ctaType,
        destination: destination,
        timestamp: new Date().toISOString()
      })
    }
  }

  return {
    trackEngagement,
    trackScrollDepth,
    trackCTAClick,
    currentAudience: audienceState.selectedAudience
  }
}