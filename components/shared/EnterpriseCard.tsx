'use client'

import { motion } from 'framer-motion'
import { LucideIcon, ArrowRight, CheckCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface EnterpriseCardProps {
  icon: LucideIcon
  title: string
  description: string
  keyFeatures: string[] // Reduced to 3-4 key features
  enterpriseFeatures: string[] // 2-3 enterprise-specific features
  href: string
  delay?: number
  isPremium?: boolean
  onQuoteClick?: () => void
}

export default function EnterpriseCard({
  icon: Icon,
  title,
  description,
  keyFeatures,
  enterpriseFeatures,
  href,
  delay = 0,
  isPremium = false,
  onQuoteClick
}: EnterpriseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="group h-full"
    >
      <div className={`relative bg-white rounded-2xl p-4 sm:p-6 md:p-8 h-full min-h-[200px] transition-all duration-500 border-2 flex flex-col active:scale-[0.98] active:bg-gray-50
        ${isPremium 
          ? 'border-gradient-to-r from-yellow-400 to-orange-500 shadow-2xl hover:shadow-yellow-500/20' 
          : 'border-gray-200 shadow-lg hover:shadow-2xl'
        } 
        hover:border-blue-300 hover:scale-[1.02] group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-blue-50/30`}
      >
        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <Star className="w-3 h-3 mr-1" />
            ENTERPRISE
          </div>
        )}

        {/* Icon with Enterprise Styling */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center
            ${isPremium 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'
            }`}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Title & Description */}
        <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed mb-6 text-sm">
          {description}
        </p>

        {/* Key Features - Streamlined */}
        <div className="space-y-2 mb-4 flex-grow">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Core Capabilities:</h4>
          {keyFeatures.slice(0, 4).map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + (i * 0.05) }}
              className="flex items-start space-x-2"
            >
              <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 text-sm">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Features - Highlighted */}
        {enterpriseFeatures.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-r-xl mb-6">
            <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Enterprise Features:
            </h4>
            <div className="space-y-1">
              {enterpriseFeatures.slice(0, 3).map((feature, i) => (
                <div key={feature} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-blue-700 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs - Premium Styling */}
        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1 group-hover:border-blue-400 transition-colors"
            asChild
          >
            <a href={href}>
              <span>Learn More</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <Button 
            variant={isPremium ? "accelerator" : "primary"}
            size="sm"
            onClick={onQuoteClick}
            className="font-semibold"
          >
            Get Quote
          </Button>
        </div>
      </div>
    </motion.div>
  )
}