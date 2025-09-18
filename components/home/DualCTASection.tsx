'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Rocket, MessageCircle, Calendar, Building2, Users, Target, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { UnifiedConsultationCard } from '@/components/shared/UnifiedConsultationCard'
import { useAudience } from '@/lib/contexts/AudienceContext'
import { useContentEngagement } from './ConditionalContentRenderer'

export default function DualCTASection() {
  const { audienceState } = useAudience()
  const { trackEngagement, trackCTAClick } = useContentEngagement()
  const selectedAudience = audienceState.selectedAudience
  
  const [showConsultation, setShowConsultation] = useState(false)
  const [showQuotation, setShowQuotation] = useState(false)

  const handleCTAClick = (ctaType: string, destination: string) => {
    trackCTAClick(ctaType, destination)
  }

  const handleConsultationSuccess = () => {
    // Keep modal open to show success message - user can close manually
    trackCTAClick('consultation_success', 'modal')
  }

  const handleQuotationSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          audience: selectedAudience || 'general'
        })
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Quote request submitted successfully! Reference: ${result.quoteReference}`)
        setShowQuotation(false)
        trackCTAClick('quotation_success', 'modal')
      } else {
        alert(`Failed to submit quote: ${result.error}`)
      }
    } catch (error) {
      console.error('Quote submission error:', error)
      alert('Failed to submit quote request. Please try again.')
    }
  }

  // Audience-specific content
  const getAudienceContent = () => {
    if (selectedAudience === 'startup') {
      return {
        title: 'Ready to Accelerate Your Startup?',
        subtitle: 'Transform your idea into a market-ready product in 12-20 weeks',
        description: 'Work directly with an experienced mechanical engineer who understands startup constraints and timelines.',
        primaryCTA: {
          text: 'Start Product Accelerator',
          href: '/services/product-development-accelerator',
          icon: Rocket
        },
        secondaryCTA: {
          text: 'Get Startup Quote',
          action: () => setShowQuotation(true),
          icon: Calendar
        },
        options: [
          {
            icon: Rocket,
            title: 'Start Accelerator',
            description: 'Ready to begin your 12-20 week product development journey?',
            action: 'Begin Accelerator',
            onClick: () => {
              handleCTAClick('startup_accelerator', '/services/product-development-accelerator')
              window.location.href = '/services/product-development-accelerator'
            },
            iconColor: 'from-blue-500 to-blue-600'
          },
          {
            icon: Target,
            title: 'Validate Your Idea',
            description: 'Need help refining your concept before full development?',
            action: 'Book Validation Call',
            onClick: () => {
              handleCTAClick('startup_validation', 'consultation')
              setShowConsultation(true)
            },
            iconColor: 'from-green-500 to-emerald-600'
          },
          {
            icon: MessageCircle,
            title: 'Learn My Process',
            description: 'Understand how I help startups overcome engineering challenges',
            action: 'Explore Process',
            onClick: () => {
              handleCTAClick('startup_process', '/about')
              window.location.href = '/about'
            },
            iconColor: 'from-purple-500 to-pink-600'
          }
        ],
        trustElements: [
          { icon: '🚀', text: '12-20 Week Delivery' },
          { icon: '💰', text: 'Startup-Friendly Pricing' },
          { icon: '🔄', text: 'Rapid Iteration' },
          { icon: '🎯', text: 'Market-Ready Results' }
        ]
      }
    } else if (selectedAudience === 'enterprise') {
      return {
        title: 'Ready for Enterprise Partnership?',
        subtitle: 'Scale your engineering capabilities with German quality and global efficiency',
        description: 'Partner with an experienced engineer who understands enterprise complexity and compliance requirements.',
        primaryCTA: {
          text: 'Explore Partnership',
          href: '/solutions/for-enterprises',
          icon: Building2
        },
        secondaryCTA: {
          text: 'Schedule Discussion',
          action: () => setShowConsultation(true),
          icon: Users
        },
        options: [
          {
            icon: Building2,
            title: 'Enterprise Solutions',
            description: 'Explore comprehensive engineering solutions for complex projects',
            action: 'View Solutions',
            onClick: () => {
              handleCTAClick('enterprise_solutions', '/solutions/for-enterprises')
              window.location.href = '/solutions/for-enterprises'
            },
            iconColor: 'from-slate-500 to-slate-600'
          },
          {
            icon: Users,
            title: 'Partnership Discussion',
            description: 'Discuss long-term strategic engineering partnerships',
            action: 'Schedule Meeting',
            onClick: () => {
              handleCTAClick('enterprise_partnership', 'consultation')
              setShowConsultation(true)
            },
            iconColor: 'from-blue-500 to-cyan-600'
          },
          {
            icon: Zap,
            title: 'Hub & Spoke Model',
            description: 'Learn about German quality with global manufacturing efficiency',
            action: 'Learn Model',
            onClick: () => {
              handleCTAClick('enterprise_hub_spoke', '/about/hub-spoke-model')
              window.location.href = '/about/hub-spoke-model'
            },
            iconColor: 'from-orange-500 to-red-600'
          }
        ],
        trustElements: [
          { icon: '🏆', text: 'German Quality Standards' },
          { icon: '🌍', text: 'Global Manufacturing' },
          { icon: '📋', text: 'Regulatory Compliance' },
          { icon: '🤝', text: 'Enterprise Partnership' }
        ]
      }
    } else {
      // General audience (no selection made)
      return {
        title: 'Ready to Transform Your Idea into Reality?',
        subtitle: 'Work with an experienced mechanical engineer who understands your unique challenges',
        description: 'Whether you\'re a startup or enterprise, I provide tailored engineering solutions that deliver results.',
        primaryCTA: {
          text: 'Get Started',
          href: '/contact',
          icon: ArrowRight
        },
        secondaryCTA: {
          text: 'Get Quote',
          action: () => setShowQuotation(true),
          icon: Calendar
        },
        options: [
          {
            icon: Rocket,
            title: 'For Startups',
            description: 'Rapid product development with startup-friendly approach',
            action: 'Explore Startup Path',
            onClick: () => {
              handleCTAClick('general_startup', '/solutions/for-startups')
              window.location.href = '/solutions/for-startups'
            },
            iconColor: 'from-blue-500 to-blue-600'
          },
          {
            icon: Building2,
            title: 'For Enterprises',
            description: 'Scalable engineering solutions with enterprise-grade quality',
            action: 'Explore Enterprise Path',
            onClick: () => {
              handleCTAClick('general_enterprise', '/solutions/for-enterprises')
              window.location.href = '/solutions/for-enterprises'
            },
            iconColor: 'from-slate-500 to-slate-600'
          },
          {
            icon: MessageCircle,
            title: 'Need Guidance?',
            description: 'Not sure which path is right for you? Let\'s discuss your needs',
            action: 'Get Guidance',
            onClick: () => {
              handleCTAClick('general_guidance', 'consultation')
              setShowConsultation(true)
            },
            iconColor: 'from-purple-500 to-pink-600'
          }
        ],
        trustElements: [
          { icon: '🔧', text: 'Mechanical Engineering' },
          { icon: '💯', text: 'Personal Commitment' },
          { icon: '🤝', text: 'Direct Communication' },
          { icon: '🏆', text: '26+ Years Experience' }
        ]
      }
    }
  }

  const content = getAudienceContent()

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20"
        />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 blur-xl rounded-lg"
      />
      <motion.div
        animate={{ y: [20, -20, 20], rotate: [360, 180, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 blur-xl rounded-lg"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {content.title.split(' ').map((word, index) => {
                const isHighlight = ['Accelerate', 'Partnership', 'Transform'].includes(word.replace('?', ''))
                return isHighlight ? (
                  <span key={index} className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
                    {word}{' '}
                  </span>
                ) : (
                  <span key={index}>{word} </span>
                )
              })}
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              {content.subtitle}
            </p>

            <p className="text-lg text-blue-300 mb-8 max-w-2xl mx-auto">
              {content.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href={content.primaryCTA.href}>
                <Button 
                  variant={selectedAudience === 'startup' ? 'accelerator' : selectedAudience === 'enterprise' ? 'primary' : 'primary'} 
                  size="hero" 
                  className="rounded-lg px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                  onClick={() => handleCTAClick('primary_cta', content.primaryCTA.href)}
                >
                  <content.primaryCTA.icon className="mr-3 w-6 h-6" />
                  {content.primaryCTA.text}
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              
              <Button 
                variant="secondary-light" 
                size="lg" 
                className="px-8 py-3 text-lg rounded-lg border-2 hover:bg-white/10 transition-all"
                onClick={() => {
                  handleCTAClick('secondary_cta', 'modal')
                  content.secondaryCTA.action()
                }}
              >
                <content.secondaryCTA.icon className="mr-3 w-5 h-5" />
                {content.secondaryCTA.text}
              </Button>
            </div>
          </motion.div>

          {/* Three Options */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {content.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 h-full flex flex-col">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${option.iconColor} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 text-center">
                    {option.title}
                  </h3>
                  
                  <p className="text-blue-200 leading-relaxed mb-6 text-center flex-grow">
                    {option.description}
                  </p>

                  <div className="mt-auto">
                    <Button
                      variant="primary-light"
                      size="sm"
                      className="w-full"
                      onClick={option.onClick}
                    >
                      {option.action}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final Trust Elements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="border-t border-white/20 pt-12"
          >
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {content.trustElements.map((feature, index) => (
                <div key={index} className="text-white/80">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <div className="text-sm font-medium">{feature.text}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-blue-300 text-sm">
                {selectedAudience === 'startup' && '🚀 Startup-focused • 💰 Cost-effective • ⚡ Rapid delivery'}
                {selectedAudience === 'enterprise' && '🏆 Enterprise-grade • 🌍 Global reach • 📋 Compliance-ready'}
                {!selectedAudience && '🔒 Transparent process • 💯 Personal commitment • 🤝 Direct communication'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Consultation Modal */}
      <Dialog open={showConsultation} onOpenChange={setShowConsultation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            {selectedAudience === 'startup' ? 'Book Startup Consultation' : 
             selectedAudience === 'enterprise' ? 'Schedule Partnership Discussion' : 
             'Book a Consultation'}
          </DialogTitle>
          <UnifiedConsultationCard
            type="consultation"
            onSuccess={handleConsultationSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Quotation Modal */}
      <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            {selectedAudience === 'startup' ? 'Request Startup Quote' : 
             selectedAudience === 'enterprise' ? 'Request Enterprise Quote' : 
             'Request a Quotation'}
          </DialogTitle>
          <UnifiedConsultationCard
            type="quotation"
            onSubmit={handleQuotationSubmit}
          />
        </DialogContent>
      </Dialog>
    </section>
  )
}