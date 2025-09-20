'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { HeroErrorBoundary, ErrorBoundary } from '@/components/shared/ErrorBoundary'

// Lazy load components to prevent blocking
import dynamic from 'next/dynamic'

const StaticHeroSection = dynamic(() => import('@/components/home/StaticHeroSection'), {
  loading: () => <div className="h-96 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 animate-pulse" />,
  ssr: true
})

const SoloFounderAdvantageSection = dynamic(() => import('@/components/home/SoloFounderAdvantageSection'), {
  loading: () => <div className="h-64 bg-gray-50 animate-pulse" />,
  ssr: true
})

const AudienceSegmentationSection = dynamic(() => import('@/components/home/AudienceSegmentationSection'), {
  loading: () => <div className="h-64 bg-white animate-pulse" />,
  ssr: true
})

const ConditionalContentRenderer = dynamic(() => import('@/components/home/ConditionalContentRenderer'), {
  loading: () => <div className="h-64 bg-gray-50 animate-pulse" />,
  ssr: true
})

const StartupPathContent = dynamic(() => import('@/components/home/StartupPathContent'), {
  loading: () => <div className="h-32 bg-blue-50 animate-pulse" />,
  ssr: true
})

const EnterprisePathContent = dynamic(() => import('@/components/home/EnterprisePathContent'), {
  loading: () => <div className="h-32 bg-green-50 animate-pulse" />,
  ssr: true
})

const DualCTASection = dynamic(() => import('@/components/home/DualCTASection'), {
  loading: () => <div className="h-32 bg-blue-600 animate-pulse" />,
  ssr: true
})

// Simplified HomePage component with better error handling
function HomePageContent() {
  const searchParams = useSearchParams()
  const [debugMode, setDebugMode] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let mounted = true
    
    try {
      // Check for debug parameters safely
      const isDebug = searchParams?.get('debug')
      if (mounted) setDebugMode(!!isDebug)

      // Simplified initialization with better error handling
      const initializePage = async () => {
        try {
          // Only initialize analytics if not disabled
          if (!isDebug || isDebug !== 'no-analytics') {
            // Dynamically import and initialize analytics
            try {
              const { initializeHomepageAnalytics } = await import('@/lib/utils/homepage-analytics')
              initializeHomepageAnalytics()
            } catch (e) {
              console.warn('Analytics init failed:', e)
            }
            
            try {
              const { initializePerformanceOptimizations } = await import('@/lib/utils/performance-optimization')
              initializePerformanceOptimizations()
            } catch (e) {
              console.warn('Performance init failed:', e)
            }
          }
        } catch (error) {
          console.warn('Initialization error:', error)
          if (mounted) setErrors(prev => [...prev, `Init error: ${error}`])
        } finally {
          if (mounted) setIsLoading(false)
        }
      }
      
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (mounted) setIsLoading(false)
      }, 2000) // Reduced timeout
      
      initializePage()

      return () => {
        mounted = false
        clearTimeout(timeoutId)
      }
    } catch (error) {
      console.error('HomePage initialization error:', error)
      if (mounted) {
        setHasError(true)
        setIsLoading(false)
      }
    }
  }, [searchParams])



  // Error fallback - show basic content if critical error
  if (hasError) {
    return <BasicFallbackPage />
  }

  // Loading state - simplified
  if (isLoading) {
    return <LoadingPage />
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
      <ErrorBoundary fallback={<div className="h-32 bg-gray-50" />}>
        <SoloFounderAdvantageSection />
      </ErrorBoundary>
      
      {/* 3. Audience Segmentation - Let users choose their path with enhanced benefits */}
      <ErrorBoundary fallback={<div className="h-32 bg-white" />}>
        <AudienceSegmentationSection />
      </ErrorBoundary>
      
      {/* 4. Conditional Content - Tailored to selected audience */}
      <ErrorBoundary fallback={<div className="h-32 bg-gray-50" />}>
        <ConditionalContentRenderer
          startupContent={<StartupPathContent />}
          enterpriseContent={<EnterprisePathContent />}
        />
      </ErrorBoundary>
      
      {/* 5. Final CTA - Audience-aware conversion actions */}
      <ErrorBoundary fallback={<div className="h-16 bg-blue-600" />}>
        <DualCTASection />
      </ErrorBoundary>
    </motion.div>
  );
}

// Basic fallback page that always works
function BasicFallbackPage() {
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
              <a href="/contact" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </a>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-green-900 mb-3">For Enterprise</h2>
              <p className="text-green-700 mb-4">Production-scale manufacturing solutions</p>
              <a href="/contact" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            <p>Having issues? Try <Link href="/?debug=no-csp" className="text-blue-600 underline">disabling security features</Link> or <Link href="/debug" className="text-blue-600 underline">visit our debug page</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading page component
function LoadingPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading IdEinstein Engineering...</p>
        <p className="text-sm text-gray-400 mt-2">If this takes too long, <Link href="/?debug=simple" className="text-blue-600 underline">try simple mode</Link></p>
      </div>
    </div>
  )
}

// Main export with Suspense wrapper
export default function HomePage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <HomePageContent />
    </Suspense>
  )
}