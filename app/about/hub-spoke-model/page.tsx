'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Globe, Zap, Shield, Users, TrendingUp, DollarSign, Clock } from 'lucide-react'
import Link from 'next/link'
import UnifiedHero from '@/components/shared/UnifiedHero'
import UnifiedSection from '@/components/shared/UnifiedSection'
import UnifiedCard from '@/components/shared/UnifiedCard'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { UnifiedConsultationCard } from '@/components/shared/UnifiedConsultationCard'

export default function HubSpokeModelPage() {
  const [showConsultation, setShowConsultation] = useState(false)

  const handleConsultationSuccess = () => {
    // Keep modal open to show success message - user can close manually
  }

  return (
    <div className="min-h-screen">
      {/* Unified Hero Section */}
      <UnifiedHero
        badge={{
          icon: Globe,
          text: "My Hub & Spoke Business Model"
        }}
        title="Hub & Spoke"
        highlight="Model"
        subtitle="26+ Years of Experience Connecting Engineering Standards with Global Expertise"
        description="I personally manage your project while leveraging my vetted network of specialized partners to deliver quality engineering at competitive prices."
        primaryCTA={{
          text: "See My Startup Package",
          href: "/services/product-development-accelerator",
          icon: ArrowRight
        }}
        secondaryCTA={{
          text: "Schedule Consultation",
          onClick: () => setShowConsultation(true)
        }}
        metrics={[
          { icon: DollarSign, text: '30-50% Cost Savings' },
          { icon: Clock, text: '24/7 Development' },
          { icon: Shield, text: 'German Quality' }
        ]}
      />

      {/* Visual Model Section */}
      <UnifiedSection
        title="How My Hub & Spoke Model Works"
        subtitle="Strategic Coordination"
        description="I serve as the central hub, personally managing your project while coordinating with my vetted network of specialized partners (spokes) to deliver engineering standards at competitive prices"
        background="white"
      >
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8 items-center relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-red-400 via-blue-400 to-green-400 transform -translate-y-1/2 z-0"></div>
            
            {/* German Hub */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center relative z-10"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative mb-6"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full mx-auto flex items-center justify-center shadow-2xl">
                  <span className="text-white text-4xl font-bold">🇩🇪</span>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-red-300/50 rounded-full"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-yellow-900" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Hub (Me)</h3>
              <div className="bg-gradient-to-br from-red-50 to-yellow-50 rounded-xl p-6 border border-red-100">
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">•</span>
                    <span>26+ Years Experience</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">•</span>
                    <span>German Quality Standards</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Project Management</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Client Communication</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* IdEinstein Bridge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center relative z-10"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative mb-6"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-2xl">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-blue-400/50 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 rounded-lg"
                />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Hub Coordination</h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Central Coordination</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Quality Assurance</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Partner Management</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Seamless Integration</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Indian Spoke */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center relative z-10"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative mb-6"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-green-500 rounded-full mx-auto flex items-center justify-center shadow-2xl">
                  <span className="text-white text-4xl font-bold">🇮🇳</span>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-green-300/50 rounded-full"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-green-900" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Spokes (Partners)</h3>
              <div className="bg-gradient-to-br from-orange-50 to-green-50 rounded-xl p-6 border border-green-100">
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Manufacturing Specialists</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Testing Facilities</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Technical Experts</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Cost Optimization</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </UnifiedSection>

      {/* Key Benefits Section */}
      <UnifiedSection
        title="Why the Hub & Spoke Model Works"
        subtitle="Six Key Advantages"
        description="Six key advantages of my Hub & Spoke approach where I serve as your central hub coordinating with specialized partners"
        background="gray"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: DollarSign,
              title: "Cost Optimization",
              description: "30-50% cost savings compared to traditional engineering services while maintaining quality standards.",
              iconColor: "from-green-500 to-emerald-600"
            },
            {
              icon: Shield,
              title: "Quality Assurance",
              description: "German quality standards applied throughout the project lifecycle with rigorous review processes.",
              iconColor: "from-blue-500 to-cyan-600"
            },
            {
              icon: Zap,
              title: "Faster Delivery",
              description: "24/7 development cycle leveraging time zone differences for accelerated project completion.",
              iconColor: "from-purple-500 to-violet-600"
            },
            {
              icon: Users,
              title: "Specialized Expertise",
              description: "Access to my carefully vetted network of manufacturing specialists, testing facilities, and technical experts.",
              iconColor: "from-orange-500 to-red-600"
            },
            {
              icon: Globe,
              title: "Cross-Cultural Expertise",
              description: "26+ years bridging engineering standards with global manufacturing capabilities and business practices.",
              iconColor: "from-indigo-500 to-purple-600"
            },
            {
              icon: TrendingUp,
              title: "Scalability",
              description: "Ability to scale teams up or down based on project requirements without compromising quality.",
              iconColor: "from-yellow-500 to-orange-600"
            }
          ].map((benefit, index) => (
            <UnifiedCard
              key={benefit.title}
              icon={benefit.icon}
              iconColor={benefit.iconColor}
              title={benefit.title}
              description={benefit.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </UnifiedSection>

      {/* Startup vs Enterprise Benefits */}
      <UnifiedSection
        title="Perfect for Every Business Size"
        subtitle="Scalable Hub & Spoke Solutions"
        description="Whether you're a startup or enterprise, my Hub & Spoke model delivers value at every stage"
        background="gradient"
      >
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Startup Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Startup Advantages</h3>
            </div>
            
            <ul className="space-y-4">
              {[
                'Access to world-class engineering without German prices',
                'Faster time-to-market with 24/7 development',
                'Scalable team size based on funding stages',
                'German quality standards for global market readiness'
              ].map((advantage, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="flex items-start text-blue-200"
                >
                  <span className="text-yellow-400 mr-3 text-lg">•</span>
                  <span>{advantage}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Enterprise Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Enterprise Benefits</h3>
            </div>
            
            <ul className="space-y-4">
              {[
                'Significant cost reduction on large projects',
                'Access to specialized Indian engineering talent',
                'Maintain German compliance and standards',
                'Risk mitigation through proven delivery model'
              ].map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex items-start text-blue-200"
                >
                  <span className="text-yellow-400 mr-3 text-lg">•</span>
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </UnifiedSection>

      {/* Process Flow Section */}
      <UnifiedSection
        title="My Project Management Process"
        subtitle="Four Seamless Steps"
        description="How I personally manage your project from initial consultation to final delivery with engineering standards"
        background="white"
      >
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              step: "1",
              title: "Personal Consultation",
              description: "Direct consultation with me to understand your requirements and apply engineering standards",
              location: "🎯 Direct Access",
              iconColor: "from-red-500 to-yellow-500"
            },
            {
              step: "2",
              title: "Strategic Planning",
              description: "I create detailed project plans and select the right partners for your specific needs",
              location: "📋 My Management",
              iconColor: "from-blue-500 to-purple-500"
            },
            {
              step: "3",
              title: "Coordinated Execution",
              description: "I coordinate with selected partners while maintaining continuous quality oversight",
              location: "🔗 My Coordination",
              iconColor: "from-orange-500 to-green-500"
            },
            {
              step: "4",
              title: "Quality Assurance",
              description: "I personally review all deliverables to ensure they meet engineering standards",
              location: "✅ My Responsibility",
              iconColor: "from-purple-500 to-pink-500"
            }
          ].map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full transition-all duration-300 hover:shadow-2xl hover:border-gray-200 hover:scale-105 flex flex-col">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${phase.iconColor} text-white rounded-lg flex items-center justify-center text-2xl font-bold mx-auto`}>
                    {phase.step}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {phase.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6 text-center flex-grow">
                  {phase.description}
                </p>

                <div className="text-center mt-auto">
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded-lg">{phase.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </UnifiedSection>

      {/* Foundation & Credibility Section */}
      <UnifiedSection
        title="Built on Engineering Excellence"
        subtitle="26+ Years of Cross-Cultural Experience"
        description="My Hub & Spoke model is built on decades of experience managing complex engineering projects across cultures and industries"
        background="gray"
      >
        <div className="max-w-6xl mx-auto">
          {/* Main Experience Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">26+</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Years Experience</h3>
              <p className="text-gray-600">Global engineering project management with precision standards</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cross-Cultural Bridge</h3>
              <p className="text-gray-600">Connecting engineering standards with global manufacturing capabilities</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Network</h3>
              <p className="text-gray-600">Vetted manufacturing partners across multiple countries and industries</p>
            </motion.div>
          </div>

          {/* Additional Credentials */}
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rapid Prototyping</h3>
              <p className="text-gray-600">Fast iteration cycles with 3D printing and advanced manufacturing techniques</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">🔧</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manufacturing Ready</h3>
              <p className="text-gray-600">Designs optimized for production with DFM principles and cost efficiency</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Project Management</h3>
              <p className="text-gray-600">Proven track record managing complex engineering projects across cultures</p>
            </motion.div>
          </div>
        </div>
      </UnifiedSection>

      {/* My Vision & Commitment */}
      <UnifiedSection
        title="My Vision for the Hub & Spoke Model"
        subtitle="Building Something Meaningful"
        description="As a startup, I'm committed to creating authentic value through honest engineering partnerships and transparent business practices"
        background="gradient"
      >
        <div className="max-w-6xl mx-auto">
          {/* Core Values */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-xl font-bold mb-3 text-white">Authentic Approach</h4>
                <p className="text-blue-100">No false promises or inflated metrics - just honest engineering expertise and transparent communication</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-4xl mb-4">🤝</div>
                <h4 className="text-xl font-bold mb-3 text-white">Partnership Focus</h4>
                <p className="text-blue-100">Building long-term relationships based on trust, quality delivery, and mutual success</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-4xl mb-4">🚀</div>
                <h4 className="text-xl font-bold mb-3 text-white">Startup Mindset</h4>
                <p className="text-blue-100">Agile, cost-conscious, and focused on delivering real value without corporate overhead</p>
              </div>
            </motion.div>
          </div>

          {/* My Commitment */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              My Personal Commitment to You
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Direct Communication',
                  description: 'You work directly with me - no account managers, no middlemen, just clear engineering discussions'
                },
                {
                  title: 'Quality Standards',
                  description: 'Every project meets engineering standards through my personal oversight and experience'
                },
                {
                  title: 'Transparent Pricing',
                  description: 'Fair pricing with no hidden costs - you pay for expertise and results, not corporate overhead'
                }
              ].map((commitment, index) => (
                <div key={commitment.title} className="text-center">
                  <h4 className="text-lg font-bold mb-3 text-yellow-300">{commitment.title}</h4>
                  <p className="text-blue-200 text-sm">{commitment.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
              <p className="text-blue-200 italic">
                "As a startup, I believe in building trust through honest work and authentic relationships. 
                My Hub & Spoke model isn't about impressive statistics - it's about delivering real engineering value 
                through personal attention and carefully selected partnerships."
              </p>
              <div className="text-yellow-300 font-medium mt-4">
                - Saravanakumar, Founder
              </div>
            </div>
          </motion.div>
        </div>
      </UnifiedSection>

      {/* Final CTA Section */}
      <UnifiedSection
        title="Ready to Experience the Hub & Spoke Advantage?"
        subtitle="Get Started Today"
        description="Experience the benefits of working with an experienced engineer who coordinates specialized expertise when you need it"
        background="gradient"
        className="!pt-8 md:!pt-12"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/services/product-development-accelerator">
              <Button variant="accelerator" size="hero">
                🚀 See My Startup Package
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
            
            <Button 
              variant="secondary-light" 
              size="hero"
              onClick={() => setShowConsultation(true)}
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </UnifiedSection>

      {/* Consultation Modal */}
      <Dialog open={showConsultation} onOpenChange={setShowConsultation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Schedule a Consultation</DialogTitle>
          <UnifiedConsultationCard
            type="consultation"
            onSuccess={handleConsultationSuccess}
            defaultService="hub-spoke-model"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}