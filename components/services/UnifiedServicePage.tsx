'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Users, 
  Target, 
  Zap,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Printer,
  Boxes,
  Cog,
  Globe,
  Info,
  Wrench,
  CheckSquare
} from 'lucide-react'
import { UnifiedConsultationCard } from '@/components/shared/UnifiedConsultationCard'
import { useRouter } from 'next/navigation'
import type { Service } from '@/library/types'

// Icon mapping helper
const iconMap: Record<string, any> = {
  Lightbulb,
  Printer,
  Boxes,
  Cog,
  Zap,
  Target,
  Clock,
  Globe,
  Users,
  Wrench,
  CheckSquare,
  Info
}

// Service hero image mapping
const getServiceHeroImage = (serviceSlug: string): string => {
  const serviceImageMap: Record<string, string> = {
    // Engineering Services
    'research-development': '/images/services/Engineering services/research-development/main/service-hero.jpg',
    'cad-modeling': '/images/services/Engineering services/cad-modeling/main/service-hero.jpg',
    'machine-design': '/images/services/Engineering services/machine-design/main/service-hero.jpg',
    'biw-design': '/images/services/Engineering services/biw-design/main/service-hero.jpg',
    'finite-element-cfd': '/images/services/Engineering services/finite-element-cfd/main/service-hero.jpg',
    'gdt-tolerance': '/images/services/Engineering services/gdt-tolerance/main/service-hero.jpg',
    
    // Manufacturing Solutions
    '3d-printing': '/images/services/Manufacturing solutions/3d printing/main/service-hero.jpg',
    'supplier-sourcing': '/images/services/Manufacturing solutions/supplier-sourcing/main/service-hero.jpg',
    'technical-documentation': '/images/services/Manufacturing solutions/technical-documentation/main/service-hero.jpg'
  }
  
  return serviceImageMap[serviceSlug] || '/images/services/default-service-hero.jpg'
}

interface UnifiedServicePageProps {
  service: Service;
}

export default function UnifiedServicePage({
  service,
}: UnifiedServicePageProps) {
  const router = useRouter()
  const [showQuotation, setShowQuotation] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [processView, setProcessView] = useState<'interactive' | 'full'>('interactive')
  const ServiceIcon = typeof service.icon === 'string' ? iconMap[service.icon] || Boxes : service.icon
  


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen relative">
      {/* Floating Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-8 left-8 z-50"
      >
        <Button
          onClick={() => router.push('/solutions/for-enterprises#services')}
          variant="accelerator"
          className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 active:scale-[0.98] sm:active:scale-100 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-28">


        {/* Hero Section with Contact Page Magic */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-12 md:py-16 rounded-2xl mb-12 overflow-hidden">
          {/* Background Magic Elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]"></div>
            <motion.div
              animate={{
                background: [
                  'radial-gradient(circle at 20% 80%, rgba(249,158,11,0.2) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 20%, rgba(249,158,11,0.2) 0%, transparent 50%)',
                  'radial-gradient(circle at 40% 40%, rgba(249,158,11,0.2) 0%, transparent 50%)'
                ]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute inset-0"
            />
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [20, -20, 20] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                    <ServiceIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium">
                    Professional Engineering Service
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white leading-tight">{service.title}</h1>
                <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 leading-relaxed">{service.description}</p>
                
                {/* Metrics */}
                <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="flex items-center text-base text-white/90 font-medium">
                    <Clock className="w-5 h-5 mr-3 text-yellow-400" />
                    Professional Quality
                  </div>
                  <div className="flex items-center text-base text-white/90 font-medium">
                    <Users className="w-5 h-5 mr-3 text-yellow-400" />
                    26+ Years Experience
                  </div>
                  <div className="flex items-center text-base text-white/90 font-medium">
                    <Target className="w-5 h-5 mr-3 text-yellow-400" />
                    Precise Results
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/20">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-white font-medium text-sm">German Standards</span>
                    </div>
                    <p className="text-white/70 text-xs">Precision engineering approach</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center mb-2">
                      <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-white font-medium text-sm">Fast Delivery</span>
                    </div>
                    <p className="text-white/70 text-xs">Efficient project execution</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center mb-2">
                      <Users className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-white font-medium text-sm">Direct Access</span>
                    </div>
                    <p className="text-white/70 text-xs">No layers, just results</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button 
                    variant="accelerator"
                    size="lg"
                    onClick={() => setShowQuotation(true)}
                    className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full w-full sm:w-auto"
                  >
                    Get Service Quote
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    variant="secondary-light" 
                    size="lg"
                    asChild
                    className="px-8 py-4 text-lg font-semibold rounded-full"
                  >
                    <Link href="/solutions/for-enterprises#services">
                      View All Services
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative h-[250px] sm:h-[300px] lg:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-2xl"
              >
                {/* Service Hero Image */}
                <div className="absolute inset-0">
                  <Image
                    src={getServiceHeroImage(service.slug)}
                    alt={`${service.title} - Professional Engineering Service`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>



        {/* Dual-View Process Flow */}
        {service.details?.process && service.details.process.length > 0 && (
          <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl my-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  My Process
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
                  Step-by-step methodology for quality results
                </p>

                {/* View Toggle Buttons */}
                <div className="flex justify-center mb-8">
                  <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200 w-full sm:w-auto">
                    <Button
                      variant={processView === 'interactive' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setProcessView('interactive')}
                      className="rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 active:scale-[0.98] sm:active:scale-100 transition-transform"
                    >
                      Interactive View
                    </Button>
                    <Button
                      variant={processView === 'full' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setProcessView('full')}
                      className="rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 active:scale-[0.98] sm:active:scale-100 transition-transform"
                    >
                      Full Process View
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Interactive View */}
              {processView === 'interactive' && (
                <div>
                  {/* Process Navigation */}
                  <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-2 bg-white rounded-full p-2 shadow-lg w-full sm:w-auto justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="rounded-full"
                        title="Previous step"
                        aria-label="Go to previous step"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      <div className="flex space-x-2 px-4">
                        {service.details.process.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentStep(index)}
                            title={`Go to step ${index + 1}`}
                            aria-label={`Go to step ${index + 1}`}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index === currentStep ? "bg-primary" : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCurrentStep(
                            Math.min((service.details?.process?.length || 1) - 1, currentStep + 1)
                          )
                        }
                        disabled={currentStep === service.details.process.length - 1}
                        className="rounded-full"
                        title="Next step"
                        aria-label="Go to next step"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Current Step Display */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                          {/* Process Image */}
                          <div className="relative min-h-[200px] sm:min-h-[250px] md:min-h-[300px] bg-gradient-to-br from-blue-100 to-indigo-200 rounded-l-2xl">
                            {service.details.process[currentStep].visualization?.src ? (
                              <Image
                                src={service.details.process[currentStep].visualization!.src}
                                alt={service.details.process[currentStep].visualization?.alt || service.details.process[currentStep].title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center p-6">
                                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                      {currentStep + 1}
                                    </span>
                                  </div>
                                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    Step {currentStep + 1}
                                  </h4>
                                  <p className="text-gray-600">
                                    {service.details.process[currentStep].title}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Process Details */}
                          <div className="p-4 sm:p-6 md:p-8 overflow-y-auto">
                            <div className="flex items-center mb-4">
                              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                                Step {currentStep + 1} of {service.details.process.length}
                              </span>
                              {service.details.process[currentStep].timeline && (
                                <div className="flex items-center ml-4 text-sm text-gray-500">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {service.details.process[currentStep].timeline}
                                </div>
                              )}
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                              {service.details.process[currentStep].title}
                            </h3>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                              {service.details.process[currentStep].description}
                            </p>

                            {/* Key Points */}
                            {service.details.process[currentStep].keyPoints && service.details.process[currentStep].keyPoints!.length > 0 && (
                              <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">
                                  Key Points:
                                </h4>
                                <ul className="space-y-1 sm:space-y-2">
                                  {service.details.process[currentStep].keyPoints!
                                    .slice(0, 3)
                                    .map((point, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-start text-sm text-gray-600"
                                      >
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        {point}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )}

                            {/* Tools & Technologies */}
                            {service.details.process[currentStep].tools && service.details.process[currentStep].tools!.length > 0 && (
                              <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <Wrench className="w-4 h-4 mr-2 text-primary" />
                                  Tools & Technologies:
                                </h4>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                  {service.details.process[currentStep].tools!.map((tool, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm border"
                                    >
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Deliverables */}
                            {service.details.process[currentStep].deliverables && service.details.process[currentStep].deliverables!.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">
                                  Deliverables:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {service.details.process[currentStep].deliverables!.map(
                                    (deliverable, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm"
                                      >
                                        {deliverable}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* Full Process View */}
              {processView === 'full' && (
                <div className="space-y-8">
                  {service.details.process.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                      <div className="grid md:grid-cols-2 gap-0">
                        {/* Step Image */}
                        <div className="relative min-h-[300px] bg-gradient-to-br from-blue-100 to-indigo-200 rounded-l-2xl">
                          {step.visualization?.src ? (
                            <Image
                              src={step.visualization.src}
                              alt={step.visualization.alt || step.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center p-6">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center shadow-lg">
                                  <span className="text-white font-bold text-lg">
                                    {index + 1}
                                  </span>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                  Step {index + 1}
                                </h4>
                              </div>
                            </div>
                          )}
                          
                          {/* Step Number Overlay */}
                          <div className="absolute top-4 left-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center shadow-lg border-2 border-white">
                              <span className="text-white font-bold">{index + 1}</span>
                            </div>
                          </div>
                        </div>

                        {/* Step Content */}
                        <div className="p-8">
                          <div className="flex items-center mb-4">
                            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                              Step {index + 1} of {service.details?.process?.length || 0}
                            </span>
                            {step.timeline && (
                              <div className="flex items-center ml-4 text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                {step.timeline}
                              </div>
                            )}
                          </div>

                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            {step.title}
                          </h3>

                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {step.description}
                          </p>

                          {/* Key Points */}
                          {step.keyPoints && step.keyPoints.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Target className="w-4 h-4 mr-2 text-primary" />
                                Key Points:
                              </h4>
                              <ul className="space-y-1 sm:space-y-2">
                                {step.keyPoints.map((point, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start text-sm text-gray-600"
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Tools & Technologies */}
                          {step.tools && step.tools.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Wrench className="w-4 h-4 mr-2 text-primary" />
                                Tools & Technologies:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {step.tools.map((tool, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border"
                                  >
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Deliverables */}
                          {step.deliverables && step.deliverables.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <CheckSquare className="w-4 h-4 mr-2 text-primary" />
                                Deliverables:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {step.deliverables.map((deliverable, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                  >
                                    {deliverable}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}


            </div>
          </section>
        )}





        {/* Professional Experience Section */}
        <section className="py-8 sm:py-12 bg-gradient-to-br from-[#1E40AF] via-blue-800 to-[#1E40AF] rounded-2xl my-12 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.1),transparent_50%)]"></div>
            <motion.div
              animate={{
                background: [
                  'radial-gradient(circle at 30% 40%, rgba(245,158,11,0.05) 0%, transparent 50%)',
                  'radial-gradient(circle at 70% 60%, rgba(245,158,11,0.05) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.05) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0"
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 active:scale-[0.98] sm:active:scale-100 transition-transform">
                <Target className="w-4 h-4 text-[#F59E0B] mr-2" />
                <span className="text-white/90 font-medium text-sm">Professional Engineering Excellence</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Why Choose{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-yellow-300 to-[#F59E0B]">
                  Experience
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                26+ years of mechanical engineering expertise, now focused on helping your project succeed
              </p>
            </motion.div>

            {/* Experience Value Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Users,
                  title: "26+ Years Experience",
                  description: "Deep mechanical engineering expertise from automotive industry and global manufacturing",
                  metric: "Professional Engineering Background",
                  color: "from-[#1E40AF] to-blue-600"
                },
                {
                  icon: Target,
                  title: "German Precision",
                  description: "Combining engineering standards with practical, cost-effective solutions",
                  metric: "Quality-Focused Approach",
                  color: "from-[#F59E0B] to-orange-600"
                },
                {
                  icon: Zap,
                  title: "Personal Partnership",
                  description: "Direct access to experienced engineer - no layers, no bureaucracy, just results",
                  metric: "Solo Entrepreneur Advantage",
                  color: "from-green-500 to-emerald-600"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group"
                >
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-500 h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-white/80 text-base leading-relaxed mb-4">{item.description}</p>
                    <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-[#F59E0B] font-medium text-sm">{item.metric}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Professional Standards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-4xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-4">Professional Standards & Approach</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                  {[
                    "Engineering Excellence",
                    "Industry Standards",
                    "Quality Focus",
                    "Direct Partnership"
                  ].map((standard, index) => (
                    <div key={standard} className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F59E0B] to-orange-600 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white/90 font-medium text-sm">{standard}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>



        {/* Project Value & Approach Section */}
        <section className="py-12 bg-white rounded-2xl my-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center bg-[#1E40AF]/5 border border-[#1E40AF]/20 rounded-full px-4 py-2 mb-6 active:scale-[0.98] sm:active:scale-100 transition-transform">
                <Target className="w-4 h-4 text-[#1E40AF] mr-2" />
                <span className="text-[#1E40AF] font-semibold text-sm">Project Value</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Expected{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-yellow-500 to-[#F59E0B]">
                  Outcomes
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-normal">
                Based on 26+ years of experience, here's what you can typically expect from this service
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Expected Results */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-[#1E40AF]/5 to-blue-50 rounded-2xl shadow-lg border border-[#1E40AF]/10 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#F59E0B] to-orange-600 flex items-center justify-center mr-3">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  Typical Project Results
                </h3>
                
                <div className="space-y-6">
                  {[
                    { metric: "30-50%", description: "Cost Reduction vs Traditional Approach", icon: Clock },
                    { metric: "12-20 Weeks", description: "Typical Project Timeline", icon: Target },
                    { metric: "Quality Focus", description: "Engineering Standards", icon: CheckCircle },
                    { metric: "Direct Access", description: "No Layers, Just Results", icon: Zap }
                  ].map((item, index) => (
                    <div key={item.description} className="flex items-center">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#1E40AF]/10 to-blue-100 flex items-center justify-center mr-4">
                        <item.icon className="w-5 h-5 text-[#1E40AF]" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{item.metric}</div>
                        <div className="text-sm text-gray-600 font-medium">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* My Approach */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-[#F59E0B]/5 to-orange-50 rounded-2xl shadow-lg border border-[#F59E0B]/10 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1E40AF] to-blue-600 flex items-center justify-center mr-3">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  My Approach
                </h3>
                
                <div className="space-y-4">
                  {[
                    "Direct partnership with experienced engineer",
                    "German precision meets practical solutions",
                    "Focus on manufacturability and cost-effectiveness",
                    "Clear communication throughout the project",
                    "Realistic timelines based on actual experience",
                    "Quality deliverables you can build upon"
                  ].map((benefit, index) => (
                    <div key={benefit} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#F59E0B] to-orange-600 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-600 font-medium leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Professional CTA Section */}
        <section className="py-12 bg-gradient-to-br from-[#1E40AF] via-blue-800 to-[#1E40AF] rounded-2xl mt-12 mb-8 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                background: [
                  'radial-gradient(circle at 20% 80%, rgba(245,158,11,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 20%, rgba(245,158,11,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 40% 40%, rgba(245,158,11,0.1) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0"
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 active:scale-[0.98] sm:active:scale-100 transition-transform">
                <Zap className="w-4 h-4 text-[#F59E0B] mr-2" />
                <span className="text-white/90 font-medium text-sm">Ready to Start Your Project?</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Let's Discuss Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-yellow-300 to-[#F59E0B]">
                  Engineering Needs
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                Get a detailed consultation based on 26+ years of mechanical engineering experience. 
                Let's explore how I can help bring your project to life.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  variant="accelerator"
                  size="lg"
                  onClick={() => setShowQuotation(true)}
                  className="px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-[#F59E0B]/25 transition-all duration-300"
                >
                  Get Service Quote
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                <Button 
                  variant="secondary-light" 
                  size="lg"
                  asChild
                  className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300"
                >
                  <Link href="/solutions/for-enterprises#services">
                    View All Services
                  </Link>
                </Button>
              </div>

              {/* Professional Indicators */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                {[
                  { label: "Quick Response", icon: Clock },
                  { label: "Free Consultation", icon: Users },
                  { label: "No Obligation", icon: CheckCircle },
                  { label: "26+ Years Experience", icon: Target }
                ].map((item, index) => (
                  <div key={item.label} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
                      <item.icon className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <span className="text-white/90 font-medium text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>


      </div>

      {/* Quotation Dialog */}
      <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Request a Quotation</DialogTitle>
          <UnifiedConsultationCard
            type="quotation"
            defaultService={service.title}
            onSubmit={async (data) => {
              try {
                console.log('📝 Submitting quote request from service page:', data)
                
                const response = await fetch('/api/quotes', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                })

                const result = await response.json()

                if (response.ok) {
                  console.log('✅ Quote submitted successfully:', result)
                  alert(`Quote request submitted successfully! Reference: ${result.quoteReference}`)
                  setShowQuotation(false)
                } else {
                  console.error('❌ Quote submission failed:', result)
                  alert(`Failed to submit quote: ${result.error}`)
                }
              } catch (error) {
                console.error('❌ Quote submission error:', error)
                alert('Failed to submit quote request. Please try again.')
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
