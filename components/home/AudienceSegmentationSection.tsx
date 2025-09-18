'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Rocket, Building2, Users, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { UnifiedConsultationCard } from '@/components/shared/UnifiedConsultationCard'
import { useAudience } from '@/lib/contexts/AudienceContext'
import { AudienceSegmentationProps, AudienceType } from '@/lib/types/audience'
import { ResponsiveWrapper } from '@/components/layout/ResponsiveWrapper'
import { ResponsiveCard, ResponsiveCardGrid } from '@/components/shared/ResponsiveCard'

export default function AudienceSegmentationSection() {
  const [showConsultation, setShowConsultation] = useState(false)
  const { selectAudience, audienceState } = useAudience()
  const selectedAudience = audienceState.selectedAudience

  const handleConsultationSuccess = () => {
    // Keep modal open to show success message - user can close manually
  }

  const handleAudienceSelect = (audience: AudienceType) => {
    if (audience) {
      selectAudience(audience, 'explicit')
      // Smooth scroll to conditional content section
      setTimeout(() => {
        const element = document.getElementById('conditional-content')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }

  const audienceDefinitions = [
    {
      type: 'startup' as AudienceType,
      title: 'For Startups',
      definition: 'Early-stage companies (0-50 employees) building innovative products',
      characteristics: [
        'Limited budget and resources',
        'Need rapid product development',
        'Focus on MVP and market validation',
        'Require cost-efficient solutions'
      ],
      benefits: [
        'Product Development Accelerator (12-20 weeks)',
        'Direct engineer access & rapid prototyping',
        'Flexible scope & cost-efficient approach',
        'Startup-focused methodology'
      ],

      primaryCTA: 'Choose Startup Path',
      icon: Rocket,
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-400/50',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900'
    },
    {
      type: 'enterprise' as AudienceType,
      title: 'For Enterprises',
      definition: 'Established organizations (50+ employees) with complex engineering needs',
      characteristics: [
        'Complex regulatory requirements',
        'Multi-stakeholder coordination',
        'Global manufacturing needs',
        'Quality and compliance focus'
      ],
      benefits: [
        'Hub & Spoke model & regulatory compliance',
        'Global manufacturing & quality oversight',
        'Enterprise partnerships & dedicated support',
        'German quality standards'
      ],

      primaryCTA: 'Choose Enterprise Path',
      icon: Building2,
      color: 'from-slate-600 to-slate-700',
      borderColor: 'border-slate-400/50',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-900'
    }
  ]

  return (
    <>
    <section id="audience-segmentation" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 text-sm font-medium mb-6 rounded-lg">
            <Users className="w-4 h-4 mr-2" />
            Choose Your Engineering Partnership
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Which Path Is Right for You?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            I serve both startups and enterprises with tailored approaches. Choose the path that best fits your organization's size, needs, and goals.
          </p>
        </motion.div>

        {/* Audience Selection Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {audienceDefinitions.map((audience, index) => (
            <motion.div
              key={audience.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`relative bg-white rounded-3xl p-6 shadow-lg group cursor-pointer border-2 ${
                selectedAudience === audience.type 
                  ? `${audience.borderColor} border-2` 
                  : 'border-gray-100 hover:border-gray-200'
              } hover:shadow-xl hover:scale-105 active:scale-[0.98] sm:active:scale-100 transition-all duration-300`}
              onClick={() => handleAudienceSelect(audience.type)}
            >
              {/* Selection Indicator */}
              {selectedAudience === audience.type && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm">✓</span>
                </motion.div>
              )}

              {/* Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${audience.color} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <audience.icon className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Title and Definition */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {audience.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {audience.definition}
                </p>
              </div>

              {/* Characteristics */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Typical Characteristics:
                </h4>
                <div className="space-y-2">
                  {audience.characteristics.map((characteristic, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="text-gray-600 text-sm">{characteristic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  What You Get:
                </h4>
                <div className="space-y-2">
                  {audience.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className={`w-2 h-2 rounded-full mr-3 mt-2 flex-shrink-0 ${
                        audience.type === 'startup' ? 'bg-blue-500' : 'bg-slate-500'
                      }`}></span>
                      <span className="text-gray-700 text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                variant={audience.type === 'startup' ? 'primary' : 'primary'}
                size="lg"
                className="w-full hover:shadow-xl transition-all duration-300"
              >
                {audience.primaryCTA}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          ))}
        </div>



        {/* Consultation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Choosing the Right Path?
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            <strong>No problem!</strong> Many successful projects start with a simple conversation. 
            Let's discuss your specific needs, timeline, and goals in a free 30-minute consultation 
            to determine the perfect approach for your project.
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-6 border border-yellow-300">
            <p className="text-sm text-gray-700 mb-2"><strong>In our consultation, we'll cover:</strong></p>
            <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div>• Your project scope and timeline</div>
              <div>• Budget and resource considerations</div>
              <div>• Technical requirements and challenges</div>
              <div>• Best approach recommendation</div>
            </div>
          </div>
          
          <Button 
            variant="accelerator"
            size="lg"
            className="rounded-lg px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setShowConsultation(true)}
          >
            🎯 Get Personalized Guidance
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>

    {/* Consultation Modal */}
    <Dialog open={showConsultation} onOpenChange={setShowConsultation}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Schedule a Free Consultation</DialogTitle>
        <UnifiedConsultationCard
          type="consultation"
          onSuccess={handleConsultationSuccess}
        />
      </DialogContent>
    </Dialog>
    </>
  )
}