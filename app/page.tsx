'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import StaticHeroSection from '@/components/home/StaticHeroSection'
import SoloFounderAdvantageSection from '@/components/home/SoloFounderAdvantageSection'
import AudienceSegmentationSection from '@/components/home/AudienceSegmentationSection'
import ConditionalContentRenderer from '@/components/home/ConditionalContentRenderer'
import StartupPathContent from '@/components/home/StartupPathContent'
import EnterprisePathContent from '@/components/home/EnterprisePathContent'
import DualCTASection from '@/components/home/DualCTASection'
import { initializeHomepageAnalytics } from '@/lib/utils/homepage-analytics'
import { initializePerformanceOptimizations } from '@/lib/utils/performance-optimization'
// import { initializeIntegrationTesting } from '@/lib/utils/integration-testing' // Disabled - old A/B testing system
import { HeroErrorBoundary, ErrorBoundary } from '@/components/shared/ErrorBoundary'


export default function HomePage() {
  const searchParams = useSearchParams()
  const [debugMode, setDebugMode] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    // Check for debug parameters
    const isDebug = searchParams?.get('debug')
    setDebugMode(!!isDebug)

    // Enhanced error tracking for mobile debugging
    const originalError = console.error
    console.error = (...args) => {
      setErrors(prev => [...prev, args.join(' ')])
      originalError(...args)
    }

    // Remove all initialization timeouts to prevent blocking
    const initializeFunctions = async () => {
      try {
        if (!isDebug || isDebug !== 'no-analytics') {
          initializeHomepageAnalytics()
          initializePerformanceOptimizations()
        }
      } catch (error) {
        console.warn('Analytics initialization error:', error)
        setErrors(prev => [...prev, `Analytics error: ${error}`])
      }
    }
    
    initializeFunctions()

    return () => {
      console.error = originalError
    }
  }, [searchParams])



  // Debug mode - simplified version
  if (debugMode) {
    return (
      <div className="min-h-screen p-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg mb-6">
            <h2 className="font-bold text-yellow-800">Debug Mode Active</h2>
            <p className="text-yellow-700">Simplified version for mobile debugging</p>
          </div>
          
          {errors.length > 0 && (
            <div className="bg-red-100 border border-red-400 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-red-800">Errors Detected:</h3>
              {errors.map((error, i) => (
                <p key={i} className="text-red-700 text-sm font-mono">{error}</p>
              ))}
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">IdEinstein Engineering</h1>
            <p className="text-lg text-gray-600 mb-6">Professional 3D Printing & CAD Design Services</p>
            <div className="space-y-4">
              <button 
                type="button"
                onClick={() => window.location.href = '/?debug=full'}
                className="w-full bg-blue-500 text-white p-3 rounded-lg"
              >
                Test Full Site
              </button>
              <button 
                type="button"
                onClick={() => window.location.href = '/debug'}
                className="w-full bg-gray-500 text-white p-3 rounded-lg"
              >
                Component Debug Page
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* 1. Static Hero - Production-Ready Designs Focus */}
      <HeroErrorBoundary>
        <StaticHeroSection />
      </HeroErrorBoundary>
      
      {/* 2. Solo Founder Advantages with Competitive Comparison + Strong CTA - Universal appeal */}
      <ErrorBoundary>
        <SoloFounderAdvantageSection />
      </ErrorBoundary>
      
      {/* 3. Audience Segmentation - Let users choose their path with enhanced benefits */}
      <ErrorBoundary>
        <div data-lazy-load="audience-segmentation">
          <AudienceSegmentationSection />
        </div>
      </ErrorBoundary>
      
      {/* 4. Conditional Content - Tailored to selected audience */}
      <ErrorBoundary>
        <div data-lazy-load="conditional-content">
          <ConditionalContentRenderer
            startupContent={<StartupPathContent />}
            enterpriseContent={<EnterprisePathContent />}
          />
        </div>
      </ErrorBoundary>
      
      {/* 5. Final CTA - Audience-aware conversion actions */}
      <ErrorBoundary>
        <div data-lazy-load="final-cta">
          <DualCTASection />
        </div>
      </ErrorBoundary>
    </motion.div>
  );
}