'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Rocket, Clock, DollarSign, Target, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useContentEngagement } from './ConditionalContentRenderer'

export default function StartupPathContent() {
  const { trackEngagement, trackCTAClick } = useContentEngagement()

  const handleCTAClick = (ctaType: string, destination: string) => {
    trackCTAClick(ctaType, destination)
  }

  const startupChallenges = [
    {
      icon: DollarSign,
      title: "High Development Costs",
      problem: "Traditional engineering services are expensive and designed for large enterprises",
      solution: "Budget-conscious approach with flexible solutions that fit your funding stage",
      color: "from-red-500 to-red-600",
      shadowColor: "shadow-red-500/25"
    },
    {
      icon: Clock,
      title: "Long Time-to-Market",
      problem: "Complex processes and multiple vendors slow down product development",
      solution: "Realistic timelines with personal guidance through each phase",
      color: "from-orange-500 to-orange-600",
      shadowColor: "shadow-orange-500/25"
    },
    {
      icon: Target,
      title: "Manufacturing Complexity",
      problem: "Finding reliable, cost-effective manufacturing partners is challenging",
      solution: "Cultural navigation and introductions to vetted Indian manufacturing partners",
      color: "from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/25"
    },
    {
      icon: Zap,
      title: "Expertise Gaps",
      problem: "Startups lack in-house engineering expertise for complex product development",
      solution: "Direct founder access to experienced engineering expertise with ongoing support",
      color: "from-purple-500 to-purple-600",
      shadowColor: "shadow-purple-500/25"
    }
  ]



  const startupBenefits = [
    "Direct founder access (no account managers)",
    "Budget-conscious solutions for all funding stages",
    "Cultural navigation for supplier discussions",
    "Realistic timeline planning and honest assessments",
    "Long-term \"phone-a-friend\" support",
    "EU-India manufacturing bridge advantage"
  ]

  return (
    <div className="space-y-16">
      {/* Startup Challenges Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="text-center mb-16"
        onViewportEnter={() => trackEngagement('startup_challenges', 'view')}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Startup Engineering Challenges
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          I understand the unique constraints startups face. Here's how I help you overcome common engineering challenges.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          {startupChallenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg ${challenge.shadowColor} hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 active:scale-[0.98] active:bg-gray-50 group`}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${challenge.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                  <challenge.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-left">{challenge.title}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Challenge:</h4>
                  <p className="text-gray-600 text-sm">{challenge.problem}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">My Solution:</h4>
                  <p className="text-gray-700 text-sm font-medium">{challenge.solution}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Product Development Accelerator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 md:p-8"
        onViewportEnter={() => trackEngagement('accelerator_program', 'view')}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 text-sm font-medium mb-6 rounded-lg">
            <Rocket className="w-4 h-4 mr-2" />
            The 4-Phase IdEinstein Path
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            From Idea to Manufacturing Readiness
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            I guide startups from first idea through manufacturing readiness, with you at every stage. Here's exactly what you get in each phase:
          </p>
        </div>

        {/* 4 Horizontal Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              phase: "01",
              title: "Concept & Feasibility",
              timeline: "1-2 months",
              icon: "💡",
              deliverables: [
                "Personal consultation to clarify your idea's technical/commercial viability",
                "Market/regulatory review to assess practical fit for EU/India",
                "Preliminary design sketches or flow diagrams",
                "Feasibility report: risks, recommendations, go/no-go factors"
              ]
            },
            {
              phase: "02",
              title: "Design & Prototyping",
              timeline: "2-4 months",
              icon: "🔧",
              deliverables: [
                "Coordination of CAD modeling and detailed drawings",
                "Sourcing prototype partners (budget-appropriate)",
                "Founder's review of prototype and test feedback",
                "Step-by-step management of design iterations"
              ]
            },
            {
              phase: "03",
              title: "Validation & Manufacturing Setup",
              timeline: "3-6 months",
              icon: "🏭",
              deliverables: [
                "GD&T/tolerance review for production readiness",
                "Identification of Indian manufacturing partners",
                "Cultural navigation for supplier discussions",
                "Documentation and SOPs for manufacturing transfer"
              ]
            },
            {
              phase: "04",
              title: "Production & Ongoing Support",
              timeline: "Ongoing",
              icon: "🚀",
              deliverables: [
                "Founder-led supplier communication and troubleshooting",
                "Coordination/review of first articles and pilot runs",
                "Quality processes and scaling coaching",
                "\"Phone-a-friend\" support as you grow"
              ]
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 h-full flex flex-col active:scale-[0.98] active:bg-gray-50 group"
            >
              <div className="flex-shrink-0">
                <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <div className="text-sm font-semibold text-blue-600 mb-2 text-center">{feature.timeline}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  Phase {feature.phase}: {feature.title}
                </h3>
              </div>
              
              <div className="flex-grow">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">What you get:</h4>
                <ul className="space-y-3">
                  {feature.deliverables.map((deliverable, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600 leading-relaxed">
                      <span className="text-green-500 mr-2 mt-1 flex-shrink-0">✓</span>
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/services/product-development-accelerator">
            <Button 
              variant="primary"
              size="hero"
              onClick={() => handleCTAClick('accelerator_program', '/services/product-development-accelerator')}
            >
              Explore The 4-Phase IdEinstein Path
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Startup Engineering Services */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="text-center"
        onViewportEnter={() => trackEngagement('startup_services', 'view')}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Startup Engineering Services
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          Focused engineering solutions designed specifically for startup speed, budget, and validation needs.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12 px-4 sm:px-6 md:px-8">
          {[
            {
              title: "Founder-Focused Consultation",
              description: "Personal guidance from concept through manufacturing readiness with realistic assessments",
              features: ["Honest feasibility assessments", "Budget-stage appropriate solutions", "Cultural navigation support", "Long-term partnership model"]
            },
            {
              title: "Manufacturing Bridge Services",
              description: "Leverage EU-India manufacturing advantages with personal coordination",
              features: ["Supplier identification and vetting", "Cultural communication support", "Quality process establishment", "Ongoing supplier support"]
            },
            {
              title: "Realistic Development Planning",
              description: "Transparent timelines and deliverables based on proven experience",
              features: ["Phase-by-phase deliverable clarity", "Go/no-go decision support", "Funding-stage flexibility", "Phone-a-friend ongoing support"]
            }
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 h-full flex flex-col active:scale-[0.98] active:bg-gray-50 group"
            >
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              </div>
              
              <div className="space-y-3 mt-auto">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start min-h-[1.5rem]">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Startup Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="text-center"
        onViewportEnter={() => trackEngagement('startup_benefits', 'view')}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Why Startups Choose My Approach
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          Unlike large consultancies, I understand startup constraints and work within your budget and timeline with personal attention and cultural navigation.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 px-4 sm:px-6 md:px-8">
          {startupBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-[0.98] active:bg-gray-50 group"
            >
              <CheckCircle className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-gray-700 font-medium text-sm">{benefit}</span>
            </motion.div>
          ))}
        </div>


      </motion.div>
    </div>
  )
}