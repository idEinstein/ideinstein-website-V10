'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO, TechStart GmbH',
      company: 'Berlin, Germany',
      content: 'IdEinstein helped us go from concept to market in just 16 weeks. Their Hub & Spoke model gave us German quality at a fraction of the cost. Our product is now selling in 5 countries.',
      rating: 5,
      image: '👩‍💼'
    },
    {
      name: 'Marcus Weber',
      role: 'Founder, InnovateMech',
      company: 'Munich, Germany',
      content: 'The team understood our vision immediately. Their 24/7 development cycle meant we never lost momentum. The quality of engineering documentation was exceptional.',
      rating: 5,
      image: '👨‍💼'
    },
    {
      name: 'Priya Sharma',
      role: 'Product Manager, GreenTech Solutions',
      company: 'Bangalore, India',
      content: 'Working with IdEinstein was seamless. They bridged the cultural gap perfectly and delivered exactly what we needed for our European market entry.',
      rating: 5,
      image: '👩‍🔬'
    }
  ]

  const stats = [
    { number: '100%', label: 'Client Satisfaction' },
    { number: '95%', label: 'On-Time Delivery' },
    { number: '4.9/5', label: 'Average Rating' }
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl md:text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what startups and enterprises 
            say about working with IdEinstein.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4 pt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl mr-4">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-xs text-blue-600">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Companies Worldwide
            </h3>
            <p className="text-gray-600">
              Our track record speaks for itself
            </p>
          </div>

          <div className="grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center">
            {stats.map((stat, index) => (
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

        {/* Additional Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 mb-6">Serving clients across</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-2xl">
            <span>🇩🇪 Germany</span>
            <span>🇮🇳 India</span>
            <span>🇺🇸 USA</span>
            <span>🇬🇧 UK</span>
            <span>🇫🇷 France</span>
            <span>🇯🇵 Japan</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}