'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveWrapper } from "@/components/layout/ResponsiveWrapper"
import { ResponsiveCard, ResponsiveCardGrid } from "@/components/shared/ResponsiveCard"
import { 
  Rocket, 
  Clock, 
  DollarSign, 
  CheckCircle,
  ArrowRight,
  Target,
  Users
} from 'lucide-react'

const ForStartupsPage = () => {
  const challenges = [
    {
      icon: DollarSign,
      title: 'Limited Budget',
      description: 'Traditional engineering services are expensive and designed for large enterprises',
      solution: 'My startup approach offers 30-50% cost savings with flexible payment options'
    },
    {
      icon: Clock,
      title: 'Time Pressure',
      description: 'Investors and market demands require rapid product development',
      solution: 'Streamlined 12-20 week process from concept to production-ready'
    },
    {
      icon: Users,
      title: 'Expertise Gap',
      description: 'Lack of in-house engineering expertise for complex product development',
      solution: 'Experienced mechanical engineering expertise at your disposal'
    },
    {
      icon: Target,
      title: 'Manufacturing Complexity',
      description: 'Finding reliable, cost-effective manufacturing partners is challenging',
      solution: 'Carefully selected manufacturing partners with personal coordination support'
    }
  ]

  const successMetrics = [
    { metric: '1-on-1', description: 'Personal Attention', detail: 'Direct communication with engineer' },
    { metric: '12-20', description: 'Weeks', detail: 'Concept to production timeline' },
    { metric: '30-50%', description: 'Cost Savings', detail: 'vs. traditional methods' },
    { metric: '24h', description: 'Response Time', detail: 'Quick decision making' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <Rocket className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mb-2 sm:mb-0 sm:mr-4" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-yellow-200 bg-clip-text text-transparent text-center sm:text-left">
                Solutions for Startups
              </h1>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 text-gray-300 leading-relaxed">
              From Idea to Market in Record Time
            </p>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Specialized engineering solutions designed for startups. Fast, cost-effective, 
              and built to scale with your growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="cta-white" size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/services/product-development-accelerator">
                  Explore Our Startup Package
                  <Rocket className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Get Custom Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Startup Challenges & Solutions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-slate-800">Startup Challenges I Solve</h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              I understand the unique challenges startups face and have tailored solutions for each
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg active:scale-[0.98] sm:active:scale-100 transition-all duration-300">
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 flex-shrink-0">
                        <challenge.icon className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">{challenge.title}</h3>
                        <p className="text-sm sm:text-base text-slate-600 mb-4">{challenge.description}</p>
                      </div>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-400 p-2 sm:p-3 md:p-4 rounded">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mb-1 sm:mb-0 sm:mr-2 flex-shrink-0" />
                        <p className="text-green-800 font-medium text-sm sm:text-base">My Solution:</p>
                      </div>
                      <p className="text-green-700 mt-1 text-sm sm:text-base">{challenge.solution}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Solution: Product Development Accelerator */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-slate-800">
              Featured: Product Development Accelerator
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              My flagship startup solution - a complete 4-phase program designed specifically for early-stage companies
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <ResponsiveWrapper 
              mobileLayout="stack" 
              desktopLayout="grid"
              touchOptimized={true}
              className="gap-8 sm:gap-12 items-center"
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">The 4-Phase IdEinstein Path</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { phase: 'Phase 1', title: 'Concept & Feasibility', duration: '1-2 months' },
                        { phase: 'Phase 2', title: 'Design & Prototyping', duration: '2-4 months' },
                        { phase: 'Phase 3', title: 'Validation & Manufacturing Setup', duration: '3-6 months' },
                        { phase: 'Phase 4', title: 'Production & Ongoing Support', duration: 'Ongoing' }
                      ].map((phase, index) => (
                        <div key={phase.phase} className="flex items-start sm:items-center">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <span className="font-semibold text-sm sm:text-base">{phase.title}</span>
                              <span className="text-blue-200 text-xs sm:text-sm mt-1 sm:mt-0">{phase.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="text-base sm:text-lg font-bold">Personal Guidance:</span>
                        <span className="text-xl sm:text-2xl font-bold text-yellow-300 mt-1 sm:mt-0">Every Step</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
                  <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">What's Included:</h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      'Comprehensive feasibility study',
                      'Functional prototype development',
                      'Manufacturing-ready design files',
                      'Qualified supplier identification',
                      'Quality control planning',
                      'Ongoing support and guidance'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-bold text-yellow-800 mb-2">💡 Startup Special:</h4>
                  <p className="text-sm sm:text-base text-yellow-700">
                    Save 30-40% compared to hiring individual services. 
                    Plus, get access to my carefully selected manufacturing network.
                  </p>
                </div>

                <Button variant="cta" size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/services/product-development-accelerator">
                    Learn More About My Accelerator
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </Button>
              </motion.div>
            </ResponsiveWrapper>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">My Startup Approach</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Focused on delivering results for startups with personal attention and proven methodology
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {successMetrics.map((metric, index) => (
              <motion.div
                key={metric.description}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-yellow-400">{metric.metric}</div>
                <div className="text-lg font-semibold mb-2">{metric.description}</div>
                <div className="text-slate-300 text-xs sm:text-sm">{metric.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-slate-800">Need Individual Services?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              While my accelerator package offers the best value, I also provide individual services for specific needs
            </p>
          </motion.div>

          <ResponsiveCardGrid
            columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            gap={{ mobile: 'gap-4', tablet: 'gap-6', desktop: 'gap-8' }}
          >
            {[
              { title: 'Research & Development', href: '/services/research-development', description: 'Concept validation and feasibility studies' },
              { title: 'CAD Modeling', href: '/services/cad-modeling', description: 'Professional 3D modeling and design' },
              { title: '3D Printing Services', href: '/services/3d-printing', description: 'Rapid prototyping and manufacturing' },
              { title: 'FEA & CFD Analysis', href: '/services/finite-element-cfd', description: 'Advanced simulation and analysis' },
              { title: 'Supplier Sourcing', href: '/services/supplier-sourcing', description: 'Manufacturing partner identification' },
              { title: 'Technical Documentation', href: '/services/technical-documentation', description: 'Professional documentation services' }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ResponsiveCard
                  variant="service"
                  title={service.title}
                  description={service.description}
                  href={service.href}
                  enableHover={true}
                  enableTouch={true}
                  className="h-full active:scale-[0.98] sm:active:scale-100"
                >
                  <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                    <a href={service.href} className="flex items-center justify-center sm:justify-start">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </ResponsiveCard>
              </motion.div>
            ))}
          </ResponsiveCardGrid>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-slate-800">
              Ready to Launch Your Startup?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed">
              Work directly with an experienced engineer who understands startup challenges. 
              Get your custom timeline and quote today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="lg" className="w-full sm:w-auto">
                Book Free Startup Consultation
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Get Custom Quote
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ForStartupsPage