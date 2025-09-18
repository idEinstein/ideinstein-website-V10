'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Lightbulb, 
  Cog, 
  Target, 
  Globe, 
  FileText,
  Building2,
  Filter,
  Grid3X3
} from 'lucide-react'
import EnterpriseCard from '@/components/shared/EnterpriseCard'

interface EnterpriseServiceGridProps {
  onQuoteClick: () => void
}

export default function EnterpriseServiceGrid({ onQuoteClick }: EnterpriseServiceGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const enterpriseServices = [
    {
      icon: Lightbulb,
      title: 'Research & Development',
      description: 'Transform innovative concepts into market-ready products with comprehensive validation and regulatory compliance.',
      keyFeatures: [
        'End-to-end product development',
        'Technical feasibility analysis', 
        'Prototype development & testing',
        'Regulatory compliance assessment'
      ],
      enterpriseFeatures: [
        'Multi-year project planning',
        'Cross-functional team coordination',
        'IP management & protection'
      ],
      href: '/services/research-development',
      category: 'Engineering'
    },
    {
      icon: Cog,
      title: 'CAD Modeling',
      description: 'Professional 3D modeling and design services with precise documentation and comprehensive validation.',
      keyFeatures: [
        'Parametric 3D modeling',
        'Technical drawings & documentation',
        'Complex assembly design',
        'Design optimization'
      ],
      enterpriseFeatures: [
        'Large assembly management',
        'Multi-team collaboration',
        'Version control systems'
      ],
      href: '/services/cad-modeling',
      category: 'Engineering'
    },
    {
      icon: Cog,
      title: 'Machine Design',
      description: 'Custom machinery and automation systems from concept to production with safety compliance.',
      keyFeatures: [
        'Custom machine design',
        'Automation integration',
        'Safety compliance',
        'Performance optimization'
      ],
      enterpriseFeatures: [
        'Production line integration',
        'Safety system design',
        'Maintenance planning'
      ],
      href: '/services/machine-design',
      category: 'Engineering'
    },
    {
      icon: Building2,
      title: 'BIW Design',
      description: 'Body-in-White design and engineering for automotive and structural applications with advanced materials.',
      keyFeatures: [
        'Structural design optimization',
        'Material selection & analysis',
        'Crash safety compliance',
        'Weight optimization'
      ],
      enterpriseFeatures: [
        'Multi-material integration',
        'Global automotive standards',
        'Production scalability'
      ],
      href: '/services/biw-design',
      category: 'Engineering'
    },
    {
      icon: Target,
      title: 'FEA & CFD Analysis',
      description: 'Advanced simulation services for comprehensive engineering validation and optimization.',
      keyFeatures: [
        'Structural analysis',
        'Thermal analysis',
        'Fluid dynamics simulation',
        'Optimization studies'
      ],
      enterpriseFeatures: [
        'Large-scale simulations',
        'Multi-physics analysis',
        'Regulatory compliance validation'
      ],
      href: '/services/finite-element-cfd',
      category: 'Analysis'
    },
    {
      icon: Target,
      title: 'GD&T Analysis',
      description: 'Precision manufacturing and quality compliance through professional tolerance analysis.',
      keyFeatures: [
        'GD&T implementation',
        'Tolerance analysis',
        'Quality system design',
        'Manufacturing optimization'
      ],
      enterpriseFeatures: [
        'Statistical tolerance analysis',
        'Six Sigma integration',
        'Global standards compliance'
      ],
      href: '/services/gdt-tolerance',
      category: 'Analysis'
    },
    {
      icon: Building2,
      title: '3D Printing Services',
      description: 'High-precision prototypes and production parts with rapid turnaround and quality control.',
      keyFeatures: [
        'Rapid prototyping',
        'Multiple material options',
        'High precision output',
        'Quality control testing'
      ],
      enterpriseFeatures: [
        'Volume production capability',
        'Material certification',
        'Supply chain integration'
      ],
      href: '/services/3d-printing',
      category: 'Manufacturing'
    },
    {
      icon: Globe,
      title: 'Supplier Sourcing',
      description: 'Strategic supplier development leveraging global networks for optimal manufacturing partnerships.',
      keyFeatures: [
        'Global supplier network',
        'Quality assessment',
        'Cost optimization',
        'Risk management'
      ],
      enterpriseFeatures: [
        'Strategic partnerships',
        'Risk mitigation strategies',
        'Global coordination'
      ],
      href: '/services/supplier-sourcing',
      category: 'Manufacturing'
    },
    {
      icon: FileText,
      title: 'Technical Documentation',
      description: 'Comprehensive documentation services ensuring clear communication and regulatory compliance.',
      keyFeatures: [
        'Technical writing',
        'Engineering drawings',
        'User manuals',
        'Process documentation'
      ],
      enterpriseFeatures: [
        'Regulatory compliance docs',
        'Multi-language support',
        'Document management systems'
      ],
      href: '/services/technical-documentation',
      category: 'Documentation'
    }
  ]

  const categories = ['All', 'Engineering', 'Analysis', 'Manufacturing', 'Documentation']
  
  const filteredServices = enterpriseServices.filter(service => 
    categoryFilter === 'All' || service.category === categoryFilter
  )

  return (
    <div className="space-y-8">
      {/* Enhanced Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
      >
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={categoryFilter === category ? "primary" : "ghost"}
              size="sm"
              onClick={() => setCategoryFilter(category)}
              className="rounded-full"
            >
              {category === 'All' && <Filter className="w-4 h-4 mr-2" />}
              {category}
            </Button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? "primary" : "ghost"}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-md"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'compact' ? "primary" : "ghost"}
            size="sm"
            onClick={() => setViewMode('compact')}
            className="rounded-md"
          >
            <Building2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Service Grid */}
      <div className={`grid gap-8 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1 md:grid-cols-2'
      }`}>
        {filteredServices.map((service, index) => (
          <EnterpriseCard
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
            keyFeatures={service.keyFeatures}
            enterpriseFeatures={service.enterpriseFeatures}
            href={service.href}
            delay={index * 0.1}
            isPremium={false}
            onQuoteClick={onQuoteClick}
          />
        ))}
      </div>

      {/* Service Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Enterprise Engineering Portfolio
          </h3>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            All services backed by 26+ years of experience, German quality standards, 
            and global manufacturing efficiency through my proven Hub & Spoke model.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-blue-600 font-semibold">9 Core Services</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-green-600 font-semibold">German Quality Standards</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-orange-600 font-semibold">Global Network</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}