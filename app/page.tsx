'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
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
  useEffect(() => {
    // Remove all initialization timeouts to prevent blocking
    const initializeFunctions = async () => {
      try {
        initializeHomepageAnalytics()
        initializePerformanceOptimizations()
      } catch (error) {
        console.warn('Analytics initialization error:', error)
      }
    }
    
    initializeFunctions()
  }, [])

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