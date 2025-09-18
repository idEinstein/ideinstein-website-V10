'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface UnifiedSectionProps {
  id?: string
  title: string
  subtitle?: string
  description?: string
  children: ReactNode
  background?: 'white' | 'gray' | 'gradient'
  className?: string
}

export default function UnifiedSection({
  id,
  title,
  subtitle,
  description,
  children,
  background = 'white',
  className = ''
}: UnifiedSectionProps) {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
    gradient: 'bg-gradient-to-r from-primary via-blue-800 to-blue-900 text-white'
  }

  return (
    <section id={id} className={`py-8 sm:py-12 lg:py-16 ${backgroundClasses[background]} ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          {subtitle && (
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium mb-6 ${
              background === 'gradient' 
                ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white/90'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {subtitle}
            </div>
          )}
          
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            background === 'gradient' ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h2>
          
          {description && (
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
              background === 'gradient' ? 'text-blue-200' : 'text-gray-600'
            }`}>
              {description}
            </p>
          )}
        </motion.div>

        {children}
      </div>
    </section>
  )
}