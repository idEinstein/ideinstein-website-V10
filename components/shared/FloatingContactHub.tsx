'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, Mail, X, Send, Loader2, MessageSquare } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CONTACT_INFO } from '@/lib/constants'

const FloatingContactHub = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    service: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const whatsappNumber = CONTACT_INFO.whatsapp?.replace(/\s/g, '')
  const whatsappMessage = encodeURIComponent('Hello! I\'m interested in your engineering services. Could you please provide more information?')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Determine if this is a quote request or general contact
      const isQuoteRequest = formData.service && formData.service !== 'General Inquiry'
      
      // Use tracking data for proper form submission
      const { getTracking } = await import('@/lib/tracking')
      const tracking = getTracking(isQuoteRequest ? 'Quotation Request' : 'Contact Form')
      
      const apiEndpoint = '/api/contact'
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: isQuoteRequest ? `Quote Request: ${formData.service}` : 'General Inquiry',
          message: formData.message,
          consent: true, // User clicked submit, implies consent
          newsletter_opt_in: false,
          ...tracking
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '', service: '', phone: '' })
      setTimeout(() => {
        setShowContactForm(false)
        setIsExpanded(false)
      }, 2000)
    } catch {
    // Error handling without unused variable
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactOptions = [
    {
      id: 'quote',
      icon: MessageSquare,
      label: 'Get Quote',
      color: 'bg-primary hover:bg-primary/90',
      action: () => setShowContactForm(true),
      delay: 0.1
    },
    {
      id: 'whatsapp',
      icon: FaWhatsapp,
      label: 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => window.open(whatsappUrl, '_blank'),
      delay: 0.2
    },
    {
      id: 'phone',
      icon: Phone,
      label: 'Call Us',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => window.open(`tel:${CONTACT_INFO.phone}`, '_self'),
      delay: 0.3
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => window.open(`mailto:${CONTACT_INFO.email}`, '_self'),
      delay: 0.4
    }
  ]

  return (
    <>
      {/* Main Contact Hub Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-[60]"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 200 }}
      >
        {/* Contact Options - Appear when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <div className="absolute bottom-16 right-0 space-y-3">
              {contactOptions.map((option) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 20 }}
                  transition={{ 
                    delay: option.delay,
                    duration: 0.3,
                    type: 'spring',
                    stiffness: 300
                  }}
                  onClick={option.action}
                  className={`flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg transition-all duration-300 group ${option.color}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={option.label}
                >
                  <option.icon size={20} />
                  
                  {/* Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute right-full mr-3 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none"
                  >
                    {option.label}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 border-2 border-transparent border-l-gray-800"></div>
                  </motion.div>
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full text-white shadow-lg transition-all duration-300 flex items-center justify-center ${
            isExpanded 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-primary hover:bg-primary/90'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isExpanded ? 'Close contact options' : 'Open contact options'}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? <X size={24} /> : <MessageCircle size={24} />}
          </motion.div>
        </motion.button>

        {/* Pulse Animation (only when closed) */}
        {!isExpanded && (
          <motion.div
            className="absolute inset-0 bg-primary rounded-full -z-10"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Get Quote & Contact</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowContactForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="border-gray-300 focus:border-primary"
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="border-gray-300 focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border-gray-300 focus:border-primary"
                    />
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:border-primary focus:outline-none"
                      required
                      aria-label="Select Service Type"
                    >
                      <option value="">Select Service</option>
                      <option value="CAD Modeling">CAD Modeling</option>
                      <option value="Machine Design">Machine Design</option>
                      <option value="BIW Design">BIW Design</option>
                      <option value="FEA & CFD Analysis">FEA & CFD Analysis</option>
                      <option value="GD&T Analysis">GD&T Analysis</option>
                      <option value="3D Printing">3D Printing Services</option>
                      <option value="Technical Documentation">Technical Documentation</option>
                      <option value="Research & Development">Research & Development</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                  <Textarea
                    placeholder="Project Description / Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="min-h-[100px] border-gray-300 focus:border-primary resize-none"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>

                  {submitStatus === 'success' && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-600 text-sm text-center"
                    >
                      ✅ Message sent successfully! We&apos;ll get back to you soon.
                    </motion.p>
                  )}

                  {submitStatus === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm text-center"
                    >
                      ❌ Failed to send message. Please try again or use another contact method.
                    </motion.p>
                  )}
                </form>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Or contact us directly:</p>
                  <div className="space-y-2">
                    <a
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="flex items-center text-sm text-gray-700 hover:text-primary transition-colors"
                    >
                      <Phone className="w-4 h-4 mr-2 text-primary" />
                      {CONTACT_INFO.phone}
                    </a>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="flex items-center text-sm text-gray-700 hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2 text-primary" />
                      {CONTACT_INFO.email}
                    </a>
                    <div className="flex items-center text-sm text-gray-700">
                      <MessageCircle className="w-4 h-4 mr-2 text-primary" />
                      {CONTACT_INFO.businessHours}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingContactHub