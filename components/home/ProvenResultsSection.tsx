'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Award, Globe, Users } from 'lucide-react'

export default function ProvenResultsSection() {
  const results = [
    {
      number: '100+',
      label: 'Projects Delivered',
      description: 'Successfully completed projects across automotive, manufacturing, and tech industries'
    },
    {
      number: '26+',
      label: 'Years Experience',
      description: 'Combined global engineering experience across German and Indian markets'
    },
    {
      number: '30-50%',
      label: 'Cost Reduction',
      description: 'Average savings compared to traditional engineering services'
    },
    {
      number: '12-20',
      label: 'Weeks Delivery',
      description: 'Average time from concept to market-ready product using our accelerator'
    }
  ]

  const industries = [
    {
      icon: '🚗',
      name: 'Automotive',
      description: 'BIW design, crash analysis, manufacturing optimization'
    },
    {
      icon: '🏭',
      name: 'Manufacturing',
      description: 'Machine design, process optimization, automation solutions'
    },
    {
      icon: '💡',
      name: 'Innovation',
      description: 'R&D projects, prototype development, technology validation'
    },
    {
      icon: '🔧',
      name: 'Engineering',
      description: 'CAD modeling, FEA/CFD analysis, technical documentation'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4 mr-2" />
            Proven Track Record
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Results That Speak for Themselves
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Over two decades of delivering world-class engineering solutions. 
            Here's what we've achieved for startups and enterprises worldwide.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {results.map((result, index) => (
            <motion.div
              key={result.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center border border-gray-100"
            >
              <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                {result.number}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {result.label}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {result.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Industries Served */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industries We Serve
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From automotive giants to innovative startups, we've delivered engineering excellence across diverse industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group hover:bg-blue-50 rounded-xl p-6 transition-colors"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {industry.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {industry.name}
                </h4>
                <p className="text-gray-600 text-sm">
                  {industry.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: TrendingUp,
              title: '95% Success Rate',
              description: 'Projects delivered on time and within budget'
            },
            {
              icon: Users,
              title: '100% Client Satisfaction',
              description: 'All clients would recommend our services'
            },
            {
              icon: Globe,
              title: 'Global Reach',
              description: 'Serving clients across Europe, Asia, and Americas'
            }
          ].map((metric, index) => (
            <div key={metric.title} className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
              <metric.icon className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h4 className="text-2xl font-bold mb-3">{metric.title}</h4>
              <p className="text-blue-100">{metric.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}