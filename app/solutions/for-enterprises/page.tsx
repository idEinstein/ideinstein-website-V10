'use client'

import { motion } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Shield, 
  Users, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Cog,
  FileText,
  Globe,
  Clock,
  Target,
  Lightbulb,
  Zap,
  Award,

} from 'lucide-react'
import UnifiedHero from '@/components/shared/UnifiedHero'
import UnifiedSection from '@/components/shared/UnifiedSection'
import UnifiedCard from '@/components/shared/UnifiedCard'
import EnterpriseServiceGrid from '@/components/services/EnterpriseServiceGrid'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { UnifiedConsultationCard } from '@/components/shared/UnifiedConsultationCard'
import Link from 'next/link'
import { 
  provenCardPadding, 
  provenTouchFeedback, 
  provenButtonWidth 
} from '@/lib/utils/responsive-utilities'

const ForEnterprisesPage = () => {
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

  const enterpriseNeeds = [
    {
      icon: Cog,
      title: 'Complex Engineering Projects',
      description: 'Multi-disciplinary projects requiring advanced technical expertise and specialized domain knowledge',
      iconColor: 'from-blue-500 to-blue-600'
    },
    {
      icon: Shield,
      title: 'Compliance & Standards',
      description: 'Strict regulatory requirements and industry standards with comprehensive compliance management',
      iconColor: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      title: 'Scale & Capacity',
      description: 'Large-scale projects requiring significant resources and scalable team allocation',
      iconColor: 'from-purple-500 to-purple-600'
    },
    {
      icon: Globe,
      title: 'Global Manufacturing',
      description: 'International supply chain coordination with cross-cultural expertise and global partner network',
      iconColor: 'from-orange-500 to-orange-600'
    }
  ]

  const enterpriseServices = [
    {
      title: 'Advanced R&D Projects',
      description: 'Complex research and development initiatives with multiple stakeholders',
      features: ['Multi-year project planning', 'Cross-functional team coordination', 'IP management', 'Regulatory pathway planning']
    },
    {
      title: 'Large-Scale Manufacturing',
      description: 'High-volume production planning and supply chain optimization',
      features: ['Production scaling strategies', 'Supply chain optimization', 'Quality system implementation', 'Cost reduction initiatives']
    },
    {
      title: 'Compliance & Documentation',
      description: 'Comprehensive regulatory compliance and technical documentation',
      features: ['Regulatory strategy development', 'Standards compliance', 'Technical documentation', 'Audit preparation']
    },
    {
      title: 'Strategic Partnerships',
      description: 'Long-term engineering partnerships and capability development',
      features: ['Dedicated project teams', 'Knowledge transfer programs', 'Capability development', 'Strategic consulting']
    }
  ]

  // Removed fake metrics - keeping only real experience data

  return (
    <div className="min-h-screen">
      {/* Unified Hero Section */}
      <UnifiedHero
        badge={{
          icon: Building2,
          text: "Enterprise Engineering Solutions"
        }}
        title="Enterprise"
        highlight="Solutions"
        subtitle="German Quality, Global Efficiency"
        description="26+ years of engineering excellence delivering enterprise-grade solutions. My Hub & Spoke model combines German quality standards with global cost efficiency for your most critical projects."
        primaryCTA={{
          text: "Schedule Enterprise Consultation",
          onClick: () => setShowConsultation(true),
          icon: Building2
        }}
        secondaryCTA={{
          text: "Get Project Quote",
          onClick: () => setShowQuotation(true)
        }}
        metrics={[
          { icon: Shield, text: 'German Quality Standards' },
          { icon: Globe, text: 'Global Manufacturing Network' },
          { icon: Users, text: '26+ Years Experience' }
        ]}
      />

      {/* MOVED UP: Services Overview - Quick Access */}
      <UnifiedSection
        id="services"
        title="Complete Engineering Services Portfolio"
        subtitle="What We Deliver"
        description="Access our complete range of engineering services, scaled and customized for enterprise requirements. Each service backed by 26+ years of experience."
        background="white"
      >
        <EnterpriseServiceGrid onQuoteClick={() => setShowQuotation(true)} />
      </UnifiedSection>

      {/* Enterprise Challenges & My Solutions */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 text-sm font-medium mb-6 rounded-lg">
              <Building2 className="w-4 h-4 mr-2" />
              Enterprise Engineering Challenges
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Complex Problems, Proven Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              After 26+ years working with enterprises, I understand your unique challenges. 
              Here's how my experience and Hub & Spoke model addresses the most common obstacles.
            </p>
          </motion.div>

          <div className={`grid md:grid-cols-2 gap-8 mb-16 ${provenCardPadding()}`}>
            {[
              {
                icon: Shield,
                title: 'Regulatory Compliance Complexity',
                description: 'Multiple regulatory requirements across different regions and industries create compliance nightmares',
                solution: 'My 26+ years of experience includes deep regulatory knowledge and established compliance processes',
                iconColor: 'from-red-500 to-red-600'
              },
              {
                icon: Users,
                title: 'Multi-Stakeholder Coordination',
                description: 'Large projects involve multiple departments, vendors, and decision-makers causing delays and miscommunication',
                solution: 'My Hub & Spoke model provides single-point coordination while leveraging specialized expertise',
                iconColor: 'from-orange-500 to-yellow-500'
              },
              {
                icon: TrendingUp,
                title: 'Cost vs. Quality Balance',
                description: 'Pressure to reduce costs while maintaining quality standards and meeting tight deadlines',
                solution: 'German quality standards with carefully selected global partners deliver 30-50% cost savings',
                iconColor: 'from-green-500 to-emerald-600'
              },
              {
                icon: Globe,
                title: 'Global Supply Chain Complexity',
                description: 'Managing international suppliers, quality standards, and cultural differences across multiple regions',
                solution: 'My global network of pre-qualified partners with personal relationship management and quality oversight',
                iconColor: 'from-blue-500 to-purple-600'
              }
            ].map((challenge, index) => (
              <UnifiedCard
                key={challenge.title}
                icon={challenge.icon}
                iconColor={challenge.iconColor}
                title={challenge.title}
                description={challenge.description}
                delay={index * 0.1}
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-sm">
                  <p className="text-blue-700 text-sm font-semibold mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                    My Proven Solution:
                  </p>
                  <p className="text-blue-600 text-sm leading-relaxed">{challenge.solution}</p>
                </div>
              </UnifiedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Hub & Spoke Model for Enterprises */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              My Hub & Spoke Model for Enterprises
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              How I deliver engineering standards with global efficiency for your complex enterprise projects.
            </p>
          </motion.div>

          {/* Visual Model */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className={`grid md:grid-cols-3 gap-8 items-center ${provenCardPadding()}`}>
              {/* German Hub */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-yellow-500 mx-auto flex items-center justify-center shadow-2xl rounded-full">
                    <span className="text-white text-4xl font-bold">🇩🇪</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 flex items-center justify-center rounded-full">
                    <Shield className="w-4 h-4 text-yellow-900" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">German Hub (Me)</h3>
                <div className={`bg-white/10 backdrop-blur-sm rounded-xl  border border-white/20 ${provenCardPadding()}`}>
                  <ul className="text-blue-200 space-y-2 text-sm">
                    <li>• Enterprise Client Relations</li>
                    <li>• Quality Standards Enforcement</li>
                    <li>• Regulatory Compliance</li>
                    <li>• Strategic Project Management</li>
                    <li>• Final Quality Review</li>
                  </ul>
                </div>
              </motion.div>

              {/* Connection Bridge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center relative"
              >
                {/* Connection Lines */}
                <div className={`hidden md:block absolute to left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-blue-400 to-green-400 ${provenCardPadding()}`}></div>
                
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 mx-auto flex items-center justify-center shadow-2xl rounded-full">
                    <Zap className="w-12 h-12 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-blue-400/50 rounded-full"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Enterprise Coordination</h3>
                <div className={`bg-white/10 backdrop-blur-sm rounded-xl  border border-white/20 ${provenCardPadding()}`}>
                  <ul className="text-blue-200 space-y-2 text-sm">
                    <li>• Multi-Vendor Management</li>
                    <li>• Cross-Cultural Bridge</li>
                    <li>• Quality Assurance Systems</li>
                    <li>• Risk Management</li>
                    <li>• Stakeholder Communication</li>
                  </ul>
                </div>
              </motion.div>

              {/* Global Spoke */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-green-500 mx-auto flex items-center justify-center shadow-2xl rounded-full">
                    <span className="text-white text-4xl font-bold">🌍</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 flex items-center justify-center rounded-full">
                    <Globe className="w-4 h-4 text-green-900" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Global Network</h3>
                <div className={`bg-white/10 backdrop-blur-sm rounded-xl  border border-white/20 ${provenCardPadding()}`}>
                  <ul className="text-blue-200 space-y-2 text-sm">
                    <li>• Pre-Qualified Partners</li>
                    <li>• Specialized Capabilities</li>
                    <li>• Cost-Effective Execution</li>
                    <li>• Scalable Resources</li>
                    <li>• Global Partner Network</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Enterprise Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto ${provenCardPadding()}`}
          >
            {[
              {
                icon: '🏆',
                title: 'Enterprise-Grade Quality',
                description: 'Engineering standards applied to every aspect of your project, from planning to delivery.',
                highlight: 'ISO 9001 Compliant'
              },
              {
                icon: '💰',
                title: 'Cost Optimization',
                description: 'Strategic use of global resources while maintaining quality delivers significant cost savings.',
                highlight: '30-50% Cost Reduction'
              },
              {
                icon: '🤝',
                title: 'Single Point of Contact',
                description: 'Direct access to an experienced engineer who understands enterprise requirements and constraints.',
                highlight: 'Executive-Level Access'
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                className={`bg-white/10 backdrop-blur-sm rounded-xl  border border-white/20 hover:bg-white/15 transition-all group h-full flex flex-col ${provenCardPadding()}`}
              >
                <div className={`text-4xl mb-4 group-hover:scale-110 transition-transform ${provenTouchFeedback()}`}>{benefit.icon}</div>
                <h4 className="text-xl font-bold text-white mb-3">{benefit.title}</h4>
                <p className="text-blue-200 mb-4 flex-grow">{benefit.description}</p>
                <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-medium rounded-lg mt-auto">
                  {benefit.highlight}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center mt-8"
          >
            <Button variant="accelerator" size="lg" className={`rounded-xl px-8 py-4 ${provenButtonWidth()}`} asChild>
              <Link href="/about/hub-spoke-model">
                Learn More About Hub & Spoke Model
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Enterprise Solution */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-slate-800">
              Featured: Enterprise Partnership Program
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              My comprehensive solution for complex enterprise projects - dedicated engineering partnership with German quality standards and global efficiency.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch ${provenCardPadding()}`}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex"
              >
                <div className={`bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl  flex flex-col w-full ${provenCardPadding()}`}>
                  <h3 className="text-2xl font-bold mb-6">Enterprise Partnership Framework</h3>
                  <div className="space-y-4 flex-grow">
                    {[
                      { phase: 'Phase 1', title: 'Strategic Assessment', duration: '3-4 weeks', description: 'Comprehensive project analysis, stakeholder alignment, and strategic planning' },
                      { phase: 'Phase 2', title: 'Solution Architecture', duration: '3-5 months', description: 'Detailed engineering design, validation, regulatory compliance review, and prototyping' },
                      { phase: 'Phase 3', title: 'Implementation', duration: '4-8 months', description: 'Coordinated execution, manufacturing, testing, and quality oversight' },
                      { phase: 'Phase 4', title: 'Optimization & Maintenance', duration: 'Ongoing', description: 'Continuous improvement, maintenance, and performance optimization' }
                    ].map((phase, index) => (
                      <div key={phase.phase} className="bg-white/10 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4">
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">{phase.title}</span>
                              <span className="text-blue-200 text-sm">{phase.duration}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-blue-200 text-sm ml-12">{phase.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Typical Timeline:</span>
                      <span className="text-2xl font-bold text-yellow-300">8-18 months</span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-blue-200 text-sm">(project dependent)</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex flex-col space-y-6 h-full"
              >
                <div className={`bg-white rounded-lg  shadow-lg flex-grow ${provenCardPadding()}`}>
                  <h4 className="text-xl font-bold text-slate-800 mb-4">Enterprise Partnership Includes:</h4>
                  <ul className="space-y-3">
                    {[
                      'Dedicated project management and coordination',
                      'German quality standards and compliance oversight',
                      'Multi-vendor management and integration',
                      'Risk assessment and mitigation strategies',
                      'Regular executive reporting and communication',
                      'Ongoing optimization and maintenance services'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg ${provenCardPadding()} flex-grow`}>
                  <h4 className="text-lg font-bold text-yellow-800 mb-2">🏢 Enterprise Advantage:</h4>
                  <p className="text-yellow-700 mb-3">
                    Get the expertise of a senior engineering consultant with the efficiency of a streamlined process. 
                    Perfect for complex projects requiring both technical excellence and executive-level coordination.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/50 rounded p-3">
                      <div className="font-bold text-green-700">Cost Savings</div>
                      <div className="text-green-600">30-50% vs traditional consulting</div>
                    </div>
                    <div className="bg-white/50 rounded p-3">
                      <div className="font-bold text-blue-700">Quality Assurance</div>
                      <div className="text-blue-600">Engineering standards</div>
                    </div>
                  </div>
                </div>


              </motion.div>
            </div>
          </div>
        </div>
      </section>







      {/* CTA Section */}
      <UnifiedSection
        title="Ready to Scale Your Engineering Capabilities?"
        subtitle="Strategic Partnership"
        description="Let's discuss how my enterprise solutions can accelerate your next major project. From concept to production, I'm your strategic engineering partner."
        background="gradient"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${provenCardPadding()}`}>
            <Button 
              variant="accelerator" 
              size="lg"
              onClick={() => setShowConsultation(true)}
            >
              🏢 Schedule Enterprise Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="secondary-light" 
              size="lg"
              onClick={() => setShowQuotation(true)}
            >
              📋 Request Project Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          
          {/* Additional Contact Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 pt-6 border-t border-white/20"
          >
            <p className="text-blue-200 text-sm mb-4">
              Prefer direct contact? Reach out personally:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact" className={`text-white hover:text-yellow-300 transition-colors ${provenTouchFeedback()}`}>
                <Button variant="ghost" size="sm" className={`text-white hover:bg-white/10 ${provenTouchFeedback()}`}>
                  📧 Contact Form
                </Button>
              </Link>
              <Link href="mailto:contact@ideinstein.com" className={`text-white hover:text-yellow-300 transition-colors ${provenTouchFeedback()}`}>
                <Button variant="ghost" size="sm" className={`text-white hover:bg-white/10 ${provenTouchFeedback()}`}>
                  ✉️ Direct Email
                </Button>
              </Link>
              <Link href="/about/hub-spoke-model" className={`text-white hover:text-yellow-300 transition-colors ${provenTouchFeedback()}`}>
                <Button variant="ghost" size="sm" className={`text-white hover:bg-white/10 ${provenTouchFeedback()}`}>
                  🔗 Learn More About My Approach
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </UnifiedSection>

      {/* Consultation Modal */}
      <Dialog open={showConsultation} onOpenChange={setShowConsultation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Book Enterprise Consultation</DialogTitle>
          <UnifiedConsultationCard
            type="consultation"
            onSuccess={handleConsultationSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Quotation Modal */}
      <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Request Enterprise Quotation</DialogTitle>
          <UnifiedConsultationCard
            type="quotation"
            onSubmit={handleQuotationSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ForEnterprisesPage