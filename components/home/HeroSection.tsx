'use client'

import * as React from "react"
import { motion } from 'framer-motion'
import { Calendar, Rocket, Building2, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { UnifiedConsultationCard } from "@/components/shared/UnifiedConsultationCard"
import { FloatingButtons } from "@/components/shared/FloatingButtons"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

function HeroSection() {
  const [showConsultation, setShowConsultation] = React.useState(false)
  const [showQuotation, setShowQuotation] = React.useState(false)
  
  return (
    <>
      {/* Hero Section with Dual Path Design */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Choose Your Path
            </h1>
          </motion.div>

          {/* Dual Path Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {/* Startup Path */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">For Startups</h2>
                  <p className="text-blue-200">Zero delays, predictable costs</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-green-400 font-semibold">0 delays</span>
                    <span className="text-white"> Zero manufacturing delays with production-ready designs</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-green-400 font-semibold">€2,000-€5,000</span>
                    <span className="text-white"> saved per iteration avoiding tooling revisions</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-green-400 font-semibold">2-4 weeks</span>
                    <span className="text-white"> faster market entry with first-time-right designs</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-green-400 font-semibold">100%</span>
                    <span className="text-white"> Predictable manufacturing costs with accurate upfront estimates</span>
                  </div>
                </motion.div>
              </div>

              <Button 
                variant="primary-light" 
                size="lg" 
                className="w-full group"
                onClick={() => window.location.href = '/solutions/for-startups'}
              >
                Choose Startup Path
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Enterprise Path */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">For Enterprises</h2>
                  <p className="text-blue-200">Scalable success, risk mitigation</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-green-400 font-semibold">Unlimited</span>
                    <span className="text-white"> Scalable manufacturing success across multiple product lines</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-green-400 font-semibold">1-2 weeks</span>
                    <span className="text-white"> saved per iteration with fewer design revisions</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-green-400 font-semibold">100%</span>
                    <span className="text-white"> Seamless supplier handoff with complete documentation</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-green-400 font-semibold">€5,000-€25,000</span>
                    <span className="text-white"> risk avoidance through early issue identification</span>
                  </div>
                </motion.div>
              </div>

              <Button 
                variant="primary-light" 
                size="lg" 
                className="w-full group"
                onClick={() => window.location.href = '/solutions/for-enterprises'}
              >
                Choose Enterprise Path
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>

          {/* Central CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-center mb-16"
          >
            <p className="text-xl text-blue-200 mb-6">Not sure which path is right for you?</p>
            <Button 
              variant="accelerator" 
              size="hero" 
              className="group hover:scale-105 transition-all duration-300"
              onClick={() => setShowConsultation(true)}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Free Consultation
            </Button>
          </motion.div>

          {/* Progress Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex justify-center items-center gap-2 mb-8"
          >
            <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
            <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
          </motion.div>

          {/* Bottom Metrics Line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mt-16 pt-8 border-t border-white/20"
          >
            <p className="text-blue-200 text-lg">
              <span className="font-semibold">26+ Years</span> • 
              <span className="font-semibold"> 100% Production Success Rate</span> • 
              <span className="font-semibold"> German Quality Standards</span> • 
              <span className="font-semibold"> Zero Manufacturing Surprises</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Desktop Modals */}
      <Dialog open={showConsultation} onOpenChange={setShowConsultation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Book a Free Consultation</DialogTitle>
          <UnifiedConsultationCard
            type="consultation"
            onSubmit={async (data) => {
              console.log('Consultation data:', data)
              setShowConsultation(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <UnifiedConsultationCard
            type="quotation"
            onSubmit={async (data) => {
              try {
                console.log('📝 Submitting quote request from homepage:', data);
                
                const response = await fetch('/api/quotes', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                  console.log('✅ Quote submitted successfully:', result);
                  alert(`Quote request submitted successfully! Reference: ${result.quoteReference}`);
                  setShowQuotation(false);
                } else {
                  console.error('❌ Quote submission failed:', result);
                  alert(`Failed to submit quote: ${result.error}`);
                }
              } catch (error) {
                console.error('❌ Quote submission error:', error);
                alert('Failed to submit quote request. Please try again.');
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Mobile Floating Buttons */}
      <FloatingButtons />
    </>
  )
}

export default HeroSection
