'use client'

import { motion } from 'framer-motion'
import { 
  LucideIcon,
  Lightbulb,
  Printer,
  Boxes,
  Cog,
  Zap,
  Shield,
  Target,
  Clock,
  Globe,
  Users
} from 'lucide-react'
import { ReactNode } from 'react'

// Icon mapping helper
const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  Printer,
  Boxes,
  Cog,
  Zap,
  Shield,
  Target,
  Clock,
  Globe,
  Users
}

interface UnifiedCardProps {
  icon?: LucideIcon | string
  iconColor?: string
  title: string
  description: string
  children?: ReactNode
  delay?: number
  className?: string
  hover?: boolean
}

export default function UnifiedCard({
  icon,
  iconColor = 'from-blue-500 to-blue-600',
  title,
  description,
  children,
  delay = 0,
  className = '',
  hover = true
}: UnifiedCardProps) {
  // Handle both string and component icons
  const Icon = typeof icon === 'string' ? iconMap[icon] : icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`group ${className}`}
    >
      <div className={`bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-100 h-full min-h-[180px] md:min-h-[200px] transition-all duration-300 ease-out flex flex-col active:scale-[0.98] active:bg-gray-50 motion-reduce:hover:scale-100 motion-reduce:transition-none ${
        hover ? 'hover:shadow-2xl hover:border-gray-200 hover:scale-[1.02]' : ''
      }`}>
        {Icon && (
          <motion.div
            whileHover={hover ? { scale: 1.05, rotate: 2 } : {}}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${iconColor} flex items-center justify-center mb-6 motion-reduce:hover:scale-100 motion-reduce:hover:rotate-0`}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
        )}
        
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex-grow">
          {children}
        </div>
      </div>
    </motion.div>
  )
}