'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Globe, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

export default function HubSpokeSection() {
  return (
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl md:text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-6">
            My Approach: The Hub & Spoke Model
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            As a solo consultant, I leverage the best of both worlds: German quality standards 
            with carefully selected Indian partners for cost-effective execution.
          </p>
        </motion.div>

        {/* Visual Model */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-center">
            {/* German Hub */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-yellow-500 mx-auto flex items-center justify-center shadow-2xl rounded-full">
                  <span className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">🇩🇪</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 flex items-center justify-center rounded-full">
                  <Shield className="w-4 h-4 text-yellow-900" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">German Hub (Me)</h3>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <ul className="text-blue-200 space-y-2 text-sm">
                  <li>• Quality Standards</li>
                  <li>• Client Relations</li>
                  <li>• Project Management</li>
                  <li>• Final Review</li>
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
              <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-blue-400 to-green-400"></div>
              
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
              <h3 className="text-2xl font-bold text-white mb-4">My Coordination</h3>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <ul className="text-blue-200 space-y-2 text-sm">
                  <li>• Vendor Selection</li>
                  <li>• Quality Assurance</li>
                  <li>• Cultural Bridge</li>
                  <li>• Project Coordination</li>
                </ul>
              </div>
            </motion.div>

            {/* Indian Spoke */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-green-500 mx-auto flex items-center justify-center shadow-2xl rounded-full">
                  <span className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">🇮🇳</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 flex items-center justify-center rounded-full">
                  <Globe className="w-4 h-4 text-green-900" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Selected Partners</h3>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <ul className="text-blue-200 space-y-2 text-sm">
                  <li>• Technical Execution</li>
                  <li>• Manufacturing</li>
                  <li>• Cost Optimization</li>
                  <li>• Specialized Services</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Key Benefits Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
        >
          {[
            {
              icon: '🌍',
              title: 'German Quality + Global Efficiency',
              highlight: '30-50% Cost Savings'
            },
            {
              icon: '⚡',
              title: 'Personal Coordination',
              highlight: '24h Response Time'
            },
            {
              icon: '🤝',
              title: 'Direct Communication',
              highlight: 'No Middlemen'
            }
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl mb-3">{benefit.icon}</div>
              <h4 className="text-base sm:text-lg font-bold text-white mb-2">{benefit.title}</h4>
              <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 text-sm font-medium rounded-lg">
                {benefit.highlight}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <Link href="/about/hub-spoke-model">
            <Button variant="primary-light" size="lg" className="rounded-lg">
              Learn More About My Hub & Spoke Model
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}