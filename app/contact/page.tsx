'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send,
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Calendar,
  FileText,
  Users,
  Rocket,
  ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CONTACT_INFO } from '@/lib/constants';
import UnifiedSection from '@/components/shared/UnifiedSection';
import UnifiedCard from '@/components/shared/UnifiedCard';
import { ConsultationForm } from '@/components/shared/ConsultationForm';
import { getTracking } from '@/lib/tracking';
// Using existing modal components instead of separate forms

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
  newsletter_opt_in: boolean;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consent: false,
    newsletter_opt_in: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showConsultation, setShowConsultation] = useState(false);
  const [showQuotation, setShowQuotation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate consent
    if (!formData.consent) {
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Get UTM tracking data
      const tracking = getTracking('Contact Form');

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...tracking
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        consent: false,
        newsletter_opt_in: false
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsultationSuccess = () => {
    // Keep modal open to show success message - user can close manually
  }

  const handleQuotationSubmit = async (data: any) => {
    // For now, show success message without actually submitting
    // This prevents deployment errors from non-existent API endpoints
    alert(`Quote request received! We'll contact you at ${data.email} within 24 hours.`);
    setShowQuotation(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: CONTACT_INFO.phone,
      link: `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`
    },
    {
      icon: Mail,
      title: 'Email',
      content: CONTACT_INFO.email,
      link: `mailto:${CONTACT_INFO.email}`
    },
    {
      icon: MapPin,
      title: 'Address',
      content: CONTACT_INFO.address,
      link: 'https://maps.google.com'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Header with Magic */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 pt-20 pb-8 md:pt-24 md:pb-12">
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

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
            >
              <MessageCircle className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-white/90 text-sm font-medium">
                Let's Connect
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Talk Directly to the{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                Founder
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-white/80 mb-12"
            >
              Your message goes straight to Saravanakumar. No info@ inboxes. No call centers.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6"
            >
              {[
                { icon: Clock, text: "24h Response" },
                { icon: MessageCircle, text: "Personal Reply" },
                { icon: Users, text: "Direct Access" }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-3"
                >
                  <metric.icon className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-white font-medium">{metric.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Personal Introduction */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-blue-50 rounded-full px-6 py-3 mb-6">
                  <span className="text-blue-600 text-sm font-medium">Personal Message</span>
                </div>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  A Personal Note from Saravanakumar
                </h2>
              </div>
              
              <div className="max-w-none text-gray-700 leading-relaxed">
                <p className="text-lg mb-6">
                  "Have a question, want a sanity-check on your project, or just starting out? Every message, calendar invite, or call request is fielded personally by me."
                </p>
                <p className="text-lg mb-6">
                  Whether you're a startup with a breakthrough idea, an enterprise looking to optimize your processes, or just exploring what's possible—let's talk. No strings attached, no sales pressure, just honest engineering advice from 26+ years of global experience.
                </p>
                <p className="text-lg">
                  I believe in direct communication and personal relationships. When you reach out, you're not getting a support ticket or a generic response—you're getting me, personally invested in understanding your challenge and helping you succeed.
                </p>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Founder & Lead Engineer</p>
                    <p className="font-semibold text-gray-900">Saravanakumar</p>
                    <p className="text-sm text-blue-600 mb-4">26+ Years Global Engineering Experience</p>
                    
                    {/* Compliance Notice */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        IdEinstein is a solo practice, fully compliant with German/EU data privacy law—see our{' '}
                        <a 
                          href="/privacy" 
                          className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200"
                        >
                          Privacy Policy
                        </a>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <div className="inline-flex items-center bg-blue-50 rounded-full px-6 py-3 mb-6">
                <span className="text-blue-600 text-sm font-medium">Contact Methods</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How Can I Help You?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the option that works best for you
              </p>
            </motion.div>

            {/* Three Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Rocket,
                  title: 'Start Immediately',
                  description: 'Ready to begin? Jump straight into our Product Development Accelerator',
                  action: 'Start Project',
                  onClick: () => window.location.href = '/services/product-development-accelerator',
                  iconColor: 'from-green-500 to-emerald-600'
                },
                {
                  icon: MessageCircle,
                  title: 'Have Questions?',
                  description: 'Want to learn more about my engineering approach and process?',
                  action: 'Learn More',
                  onClick: () => {
                    const formSection = document.getElementById('contact-form');
                    formSection?.scrollIntoView({ behavior: 'smooth' });
                  },
                  iconColor: 'from-blue-500 to-cyan-600'
                },
                {
                  icon: Calendar,
                  title: 'Need Consultation?',
                  description: 'Discuss your specific requirements directly with me',
                  action: 'Book Call',
                  onClick: () => setShowConsultation(true),
                  iconColor: 'from-purple-500 to-pink-600'
                }
              ].map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 hover:scale-105 h-full flex flex-col">
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${option.iconColor} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                        <option.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                      {option.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6 text-center flex-grow">
                      {option.description}
                    </p>

                    <div className="mt-auto flex justify-center">
                      <button
                        type="button"
                        className="w-full sm:w-auto h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 rounded-lg text-sm font-semibold flex items-center justify-center transition-all duration-300"
                        onClick={option.onClick}
                      >
                        {option.action}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <UnifiedSection
        title="Send Me a Message"
        subtitle="Direct Contact"
        description="Fill out the form below and I'll get back to you within 24 hours"
        background="white"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16" id="contact-form">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 overflow-hidden"
          >
            {/* Form Magic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-blue-50/50"></div>
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r from-yellow-400/10 to-blue-400/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 25, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-yellow-400/10 rounded-full blur-xl"
            />
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mr-4">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Send Message</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4" role="form">
                <Input
                  placeholder="Your Name" autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-2 border-gray-200/60 bg-white/70 backdrop-blur-sm focus:border-primary focus:bg-white transition-all duration-300"
                  required
                />
                <Input
                  type="email" inputMode="email" autoComplete="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-xl border-2 border-gray-200/60 bg-white/70 backdrop-blur-sm focus:border-primary focus:bg-white transition-all duration-300"
                  required
                />
                <Input
                  type="tel" inputMode="tel" autoComplete="tel"
                  placeholder="Your Phone (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-xl border-2 border-gray-200/60 bg-white/70 backdrop-blur-sm focus:border-primary focus:bg-white transition-all duration-300"
                />
                <Input
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="rounded-xl border-2 border-gray-200/60 bg-white/70 backdrop-blur-sm focus:border-primary focus:bg-white transition-all duration-300"
                  required
                />
                <Textarea
                  placeholder="Your Message" autoComplete="off"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[120px] rounded-xl border-2 border-gray-200/60 bg-white/70 backdrop-blur-sm focus:border-primary focus:bg-white transition-all duration-300"
                  required
                />

                {/* Consent Checkboxes */}
                <div className="space-y-6 pt-6 border-t border-gray-200/60">
                  <div className="bg-blue-50/50 rounded-xl p-4 space-y-4">
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={formData.consent}
                        onCheckedChange={(checked) => setFormData({ ...formData, consent: checked === true })}
                        className="mt-1 h-5 w-5 rounded border-2 border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <div className="flex-1">
                        <label className="text-sm text-gray-800 leading-relaxed cursor-pointer">
                          <span className="font-medium">Required:</span> I agree to the{' '}
                          <a 
                            href="/privacy" 
                            className="text-blue-600 hover:text-blue-700 underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Privacy Policy
                          </a>{' '}
                          and consent to the processing of my personal data for this contact request. *
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={formData.newsletter_opt_in}
                        onCheckedChange={(checked) => setFormData({ ...formData, newsletter_opt_in: checked === true })}
                        className="mt-1 h-5 w-5 rounded border-2 border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <div className="flex-1">
                        <label className="text-sm text-gray-800 leading-relaxed cursor-pointer">
                          <span className="font-medium">Optional:</span> I would like to receive updates about IdEinstein services and industry insights via email.
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto rounded-xl"
                  disabled={isSubmitting || !formData.consent}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center text-green-600 bg-green-50 p-4 rounded-xl"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Message sent successfully! We'll get back to you within 24 hours.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center text-red-600 bg-red-50 p-4 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {!formData.consent ? 'Please agree to the privacy policy to continue.' : 'Failed to send message. Please try again.'}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 overflow-hidden">
              {/* Card Magic Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-blue-50/50"></div>
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-yellow-400/10 to-blue-400/10 rounded-full blur-lg"
              />
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mr-4">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Contact Information</h3>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                        <a
                          href={info.link}
                          target={info.title === 'Address' ? '_blank' : undefined}
                          rel={info.title === 'Address' ? 'noopener noreferrer' : undefined}
                          className="text-gray-600 hover:text-primary transition-colors duration-300"
                        >
                          {info.content}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 overflow-hidden">
              {/* Card Magic Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-white/50 to-orange-50/50"></div>
              <motion.div
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-lg"
              />
              
              <div className="relative z-10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Business Hours</h4>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex justify-between">
                        <span>Monday - Friday:</span>
                        <span className="font-medium">9:00 AM - 6:00 PM CET</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Saturday:</span>
                        <span className="font-medium">10:00 AM - 2:00 PM CET</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Sunday:</span>
                        <span className="font-medium">Closed</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </motion.div>
        </div>
      </UnifiedSection>

      {/* Consultation Modal */}
      <Dialog open={showConsultation} onOpenChange={setShowConsultation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Visible Modal Header */}
            <div className="text-center border-b border-gray-200 pb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Consultation</h2>
              <p className="text-gray-600">
                Schedule a direct call with Saravanakumar to discuss your project requirements
              </p>
            </div>
            
            {/* Hidden title for screen readers */}
            <DialogTitle className="sr-only">Book Consultation</DialogTitle>
            
            <ConsultationForm
              onSuccess={handleConsultationSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Quotation Modal */}
      <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="text-2xl font-bold mb-4">Request Quote</DialogTitle>
          <div className="space-y-4">
            <p className="text-gray-600">
              Get a detailed quote for your engineering project.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="primary" 
                onClick={() => {
                  alert('Quote request feature will be available soon!');
                  setShowQuotation(false);
                }}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Request Quote
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowQuotation(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactPage;
