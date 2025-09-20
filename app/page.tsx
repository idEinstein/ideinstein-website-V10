'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
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
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    try {
      // Check for debug parameters
      const isDebug = searchParams?.get('debug')
      setDebugMode(!!isDebug)

      // Enhanced error tracking for production debugging
      const originalError = console.error
      console.error = (...args) => {
        const errorMsg = args.join(' ')
        setErrors(prev => [...prev, errorMsg])
        originalError(...args)
        
        // If critical error, show fallback
        if (errorMsg.includes('ChunkLoadError') || errorMsg.includes('Loading chunk')) {
          setHasError(true)
        }
      }

      // Safer initialization with timeout
      const initializeFunctions = async () => {
        try {
          if (!isDebug || isDebug !== 'no-analytics') {
            // Wrap in try-catch to prevent blocking
            try {
              initializeHomepageAnalytics()
            } catch (e) {
              console.warn('Analytics init failed:', e)
            }
            
            try {
              initializePerformanceOptimizations()
            } catch (e) {
              console.warn('Performance init failed:', e)
            }
          }
        } catch (error) {
          console.warn('Initialization error:', error)
          setErrors(prev => [...prev, `Init error: ${error}`])
        } finally {
          setIsLoading(false)
        }
      }
      
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setIsLoading(false)
      }, 3000)
      
      initializeFunctions()

      return () => {
        console.error = originalError
        clearTimeout(timeoutId)
      }
    } catch (error) {
      console.error('HomePage initialization error:', error)
      setHasError(true)
      setIsLoading(false)
    }
  }, [searchParams])



  // Error fallback - show basic content if critical error
  if (hasError) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">IdEinstein Engineering</h1>
            <p className="text-xl text-gray-600 mb-8">Professional 3D Printing & CAD Design Services</p>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">For Startups</h2>
                <p className="text-blue-700 mb-4">Rapid prototyping and design services</p>
                <a href="/contact" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Get Started
                </a>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-green-900 mb-3">For Enterprise</h2>
                <p className="text-green-700 mb-4">Production-scale manufacturing solutions</p>
                <a href="/contact" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

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

  // Production debug info
  if (searchParams?.get('debug') === 'prod') {
    return (
      <div className="min-h-screen p-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-blue-100 border border-blue-400 p-4 rounded-lg mb-6">
            <h2 className="font-bold text-blue-800">Production Debug Mode</h2>
            <p className="text-blue-700">Environment: {process.env.NODE_ENV}</p>
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
              <Link href="/" className="block w-full bg-blue-500 text-white p-3 rounded-lg text-center">
                Try Normal Site
              </Link>
              <Link href="/?debug=no-csp" className="block w-full bg-yellow-500 text-white p-3 rounded-lg text-center">
                Try Without CSP
              </Link>
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