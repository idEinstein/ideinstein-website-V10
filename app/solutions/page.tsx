'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Rocket, 
  Building2, 
  ArrowRight,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react'
import { 
  provenCardPadding, 
  provenTouchFeedback, 
  provenButtonWidth 
} from '@/lib/utils/responsive-utilities'

const SolutionsOverviewPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-20">
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-yellow-200 bg-clip-text text-transparent">
              Solutions for Every Stage
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
              Whether you're a startup bringing your first product to market or an established enterprise 
              scaling operations, we have tailored solutions for your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto ${provenCardPadding()}`}>
            
            {/* For Startups */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="group"
            >
              <Card className={`h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 border-2 border-blue-100 hover:border-blue-300 ${provenTouchFeedback()}`}>
                <CardContent className={` ${provenCardPadding()}`}>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-4">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800">For Startups</h2>
                      <p className="text-blue-600 font-medium">Accelerate Your Innovation</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Fast-track your product development with our specialized startup package. 
                    From concept to production in 12-20 weeks with cost-effective solutions.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-slate-700">Product Development Accelerator</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-slate-700">MVP Design & Prototyping</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-slate-700">Manufacturing Partner Qualification</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-slate-700">Cost-Effective Indian Manufacturing</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-blue-800">Special Startup Benefits:</p>
                        <p className="text-blue-600 text-sm">30-50% cost savings vs. enterprise solutions</p>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">12-20 weeks</div>
                    </div>
                  </div>

                  <Button variant="cta" size="lg" className={`w-full ${provenButtonWidth()}`} asChild>
                    <Link href="/solutions/for-startups">
                      Explore Startup Solutions
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* For Enterprises */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="group"
            >
              <Card className={`h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 border-2 border-slate-100 hover:border-slate-300 ${provenTouchFeedback()}`}>
                <CardContent className={` ${provenCardPadding()}`}>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mr-4">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800">For Enterprises</h2>
                      <p className="text-slate-600 font-medium">Scale Your Operations</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Advanced engineering solutions for established companies. Complex projects, 
                    compliance requirements, and large-scale manufacturing support.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-slate-600 rounded-full mr-3"></div>
                      <span className="text-slate-700">Advanced R&D Projects</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-slate-600 rounded-full mr-3"></div>
                      <span className="text-slate-700">Complex Engineering Analysis</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-slate-600 rounded-full mr-3"></div>
                      <span className="text-slate-700">Large-Scale Manufacturing</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-slate-600 rounded-full mr-3"></div>
                      <span className="text-slate-700">Compliance & Documentation</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">Enterprise Benefits:</p>
                        <p className="text-slate-600 text-sm">Dedicated project management & support</p>
                      </div>
                      <div className="text-2xl font-bold text-slate-600">Custom Timeline</div>
                    </div>
                  </div>

                  <Button variant="outline" size="lg" className={`w-full ${provenButtonWidth()}`} asChild>
                    <Link href="/solutions/for-enterprises">
                      Explore Enterprise Solutions
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose IdEinstein */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-slate-800">Why Choose IdEinstein?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Unique advantages that set us apart in the global engineering landscape
            </p>
          </motion.div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${provenCardPadding()}`}>
            {[
              {
                icon: Users,
                title: 'Cross-Cultural Bridge',
                description: '26+ years bridging German precision with Indian manufacturing efficiency'
              },
              {
                icon: TrendingUp,
                title: 'Proven Track Record',
                description: '87% of our R&D projects successfully reach market with measurable ROI'
              },
              {
                icon: Shield,
                title: 'Single Point of Contact',
                description: 'Simplified project management with one expert overseeing your entire process'
              }
            ].map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <advantage.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{advantage.title}</h3>
                <p className="text-slate-600">{advantage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Whether you're a startup or enterprise, we have the right solution for your engineering needs. 
              Let's discuss your project today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta-white" size="lg">
                Book Free Consultation
              </Button>
              <Button variant="outline" size="lg">
                Get Custom Quote
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default SolutionsOverviewPage