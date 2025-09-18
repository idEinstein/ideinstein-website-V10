'use client'

import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Lightbulb, Cog, TestTube, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProcessOverviewSection() {
  const phases = [
    {
      number: '01',
      icon: Lightbulb,
      title: 'Concept Validation',
      duration: '2-4 weeks',
      description: 'I work with you to assess technical feasibility and commercial viability, ensuring your idea has solid foundations',
      personalNote: 'I personally review every aspect to identify potential challenges early',
      deliverables: [
        'Comprehensive feasibility report',
        'Initial design concepts',
        'Technology roadmap',
        'Risk assessment & mitigation plan'
      ],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      number: '02',
      icon: Cog,
      title: 'MVP Design & Prototyping',
      duration: '4-6 weeks',
      description: 'I create detailed designs and build functional prototypes to validate your core functionalities',
      personalNote: 'You get direct access to me throughout the design process',
      deliverables: [
        'Detailed 3D CAD models',
        'Functional prototype',
        'Performance testing results',
        'Design optimization recommendations'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '03',
      icon: TestTube,
      title: 'Production Optimization',
      duration: '3-5 weeks',
      description: 'I optimize your design for manufacturing efficiency and coordinate with my trusted partners',
      personalNote: 'I personally vet all manufacturing partners and oversee quality',
      deliverables: [
        'Manufacturing-ready drawings',
        'Production process plan',
        'Quality control systems',
        'Cost optimization analysis'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '04',
      icon: Rocket,
      title: 'Market Launch Support',
      duration: '3-5 weeks',
      description: 'I support your market entry with manufacturing setup and comprehensive documentation',
      personalNote: 'I remain available for ongoing support after launch',
      deliverables: [
        'Manufacturing setup coordination',
        'Complete technical documentation',
        'Compliance certification support',
        'Launch strategy guidance'
      ],
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 text-sm font-medium mb-6 rounded-lg">
            <Rocket className="w-4 h-4 mr-2" />
            My Personal Process
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl md:text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            How I Take Your Idea to Market
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            My proven 4-phase methodology that I personally guide you through. 
            <span className="text-blue-600 font-semibold"> I'm with you every step of the way</span> - from initial concept to market launch.
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="max-w-6xl mx-auto">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative mb-16 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8 lg:ml-auto'} lg:w-1/2`}
            >
              {/* Timeline Line */}
              {index < phases.length - 1 && (
                <div className="hidden lg:block absolute top-32 left-1/2 transform -translate-x-1/2 w-0.5 h-32 bg-gradient-to-b from-blue-300 to-purple-300 z-0"></div>
              )}

              {/* Phase Card */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow relative z-10">
                {/* Phase Number & Icon */}
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${phase.color} flex items-center justify-center mr-4`}>
                    <phase.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-400 mb-1">
                      {phase.number}
                    </div>
                    <div className="text-sm text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-lg">
                      {phase.duration}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {phase.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {phase.description}
                </p>

                {/* Personal Note */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
                  <p className="text-blue-800 text-sm font-medium italic">
                    💡 Personal Touch: {phase.personalNote}
                  </p>
                </div>

                {/* Deliverables */}
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Key Deliverables:</h4>
                  <div className="grid md:grid-cols-1 sm:grid-cols-2 gap-3">
                    {phase.deliverables.map((deliverable, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow for desktop */}
                {index < phases.length - 1 && (
                  <div className="hidden lg:block absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Personal Commitment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white max-w-5xl mx-auto"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-3xl md:text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Why My Process Works
            </h3>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              I personally oversee every phase, ensuring quality and keeping you informed throughout the journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
            {/* Left: Professional Standards */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h4 className="text-xl font-bold mb-4">My Professional Standards:</h4>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  <span>Regular progress updates and transparent communication</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  <span>Prompt responses to questions and concerns</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  <span>Thorough quality review at each milestone</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  <span>Direct engineering consultation throughout</span>
                </li>
              </ul>
            </div>

            {/* Right: Results */}
            <div className="text-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-1">12-20</div>
                  <div className="text-blue-200 text-sm">Weeks to Market</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-1">100%</div>
                  <div className="text-blue-200 text-sm">Personal Oversight</div>
                </div>
              </div>
              <Link href="/services/product-development-accelerator">
                <Button variant="accelerator" size="lg" className="rounded-lg">
                  Start My Process
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}