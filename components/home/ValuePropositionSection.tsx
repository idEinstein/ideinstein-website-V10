'use client'

import { motion } from 'framer-motion'
import { DollarSign, Clock, Shield, Users, TrendingUp, Zap } from 'lucide-react'

export default function ValuePropositionSection() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'No hidden costs or corporate markup. You pay directly for engineering expertise and materials.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Clock,
      title: 'Focused Attention',
      description: 'Your project gets my full attention. No juggling between multiple large clients or bureaucratic delays.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Shield,
      title: 'Quality Standards',
      description: 'Every project follows rigorous engineering standards and best practices I\'ve learned from industry experience.',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Users,
      title: 'Direct Communication',
      description: 'Work directly with me - the engineer who understands your project. No account managers or middlemen.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: TrendingUp,
      title: 'Flexible Approach',
      description: 'Adapt quickly to your changing needs. Scale up with trusted partners or keep it lean - your choice.',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Efficient Process',
      description: 'Streamlined 4-phase methodology focused on rapid iteration and practical results for startups.',
      color: 'from-yellow-500 to-orange-600'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl md:text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Work with Me?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            As a solo engineering consultant, I offer what large firms can't: 
            personal attention, direct communication, and complete project ownership.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 hover:border-gray-200">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Value Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-5xl mx-auto"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What You Can Expect
            </h3>
            <p className="text-gray-600">
              Honest, professional engineering services tailored for startups
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            {[
              { number: '24h', label: 'Response Time' },
              { number: '1-on-1', label: 'Direct Access' },
              { number: 'No', label: 'Hidden Costs' },
              { number: 'Full', label: 'Transparency' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl md:text-2xl sm:text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}