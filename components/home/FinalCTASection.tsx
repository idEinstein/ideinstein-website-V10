'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Rocket, MessageCircle, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { UnifiedConsultationCard } from '@/components/shared/UnifiedConsultationCard'

export default function FinalCTASection() {
  const [showConsultation, setShowConsultation] = useState(false)
  const [showQuotation, setShowQuotation] = useState(false)

  const handleConsultationSuccess = () => {
    // Keep modal open to show success message - user can close manually
  }

  const handleQuotationSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Quote request submitted successfully! Reference: ${result.quoteReference}`)
        setShowQuotation(false)
      } else {
        alert(`Failed to submit quote: ${result.error}`)
      }
    } catch (error) {
      console.error('Quote submission error:', error)
      alert('Failed to submit quote request. Please try again.')
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl md:text-3xl sm:text-2xl sm:text-3xl lg:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
                Idea
              </span>{' '}
              into Reality?
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Work directly with an experienced mechanical engineer who understands your challenges. 
              Your next breakthrough is just 12-20 weeks away.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/services/product-development-accelerator">
                <Button variant="accelerator" size="hero" className="rounded-lg">
                  <Rocket className="mr-3 w-6 h-6" />
                  Start Your Project
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              
              <Button 
                variant="secondary-light" 
                size="hero" 
                className="rounded-lg"
                onClick={() => setShowQuotation(true)}
              >
                <Calendar className="mr-3 w-5 h-5" />
                Get Quote
              </Button>
            </div>
          </motion.div>

          {/* Three Options */}
          <div className="grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-16">
            {[
              {
                icon: Rocket,
                title: 'Start Your Project',
                description: 'Ready to begin? Let\'s turn your idea into reality with our proven process',
                action: 'Get Started',
                onClick: () => window.location.href = '/services/product-development-accelerator',
                iconColor: 'from-blue-500 to-blue-600'
              },
              {
                icon: MessageCircle,
                title: 'Learn My Process',
                description: 'Understand how I help companies succeed with engineering excellence',
                action: 'About Me',
                onClick: () => window.location.href = '/about',
                iconColor: 'from-purple-500 to-purple-600'
              },
              {
                icon: Calendar,
                title: 'Free Consultation',
                description: 'Discuss your project and get expert advice at no cost',
                action: 'Book Call',
                onClick: () => setShowConsultation(true),
                iconColor: 'from-yellow-500 to-orange-500'
              }
            ].map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 h-full flex flex-col">
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
                      size="default"
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
            <div className="grid md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
              {[
                { icon: '⚡', text: 'Fast 12-20 Week Delivery' },
                { icon: '💰', text: 'Cost-Effective Solutions' },
                { icon: '🏆', text: '26+ Years Experience' },
                { icon: '🤝', text: 'Personal Attention' }
              ].map((feature, index) => (
                <div key={index} className="text-white/80">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <div className="text-sm font-medium">{feature.text}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-blue-300 text-sm">
                🔒 Transparent process • 💯 Personal commitment • 🌍 Based in Germany
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Consultation Modal */}
      <Dialog open={showConsultation} onOpenChange={setShowConsultation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Book a Consultation</DialogTitle>
          <UnifiedConsultationCard
            type="consultation"
            onSuccess={handleConsultationSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Quotation Modal */}
      <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Request a Quotation</DialogTitle>
          <UnifiedConsultationCard
            type="quotation"
            onSubmit={handleQuotationSubmit}
          />
        </DialogContent>
      </Dialog>
    </section>
  )
}