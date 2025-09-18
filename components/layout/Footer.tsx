'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaXing, FaWhatsapp } from 'react-icons/fa'
import { ArrowRight, Mail, Phone, Send, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { getTracking } from "@/lib/tracking"
import { sign } from "@/lib/helpers/sign";

import { CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants'

const Footer = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      setSubscribeStatus('error');
      return;
    }
    
    setSubscribeStatus('loading');
    
    try {
      // Get UTM tracking data
      const tracking = getTracking('Newsletter Subscription');
      
      // Build the body once
      const body = { 
        name: name.trim() || undefined, // Optional name
        email,
        ...tracking
      };
      
      const bodyString = JSON.stringify(body);
      
      // Generate HMAC signature
      const secret = process.env.NEXT_PUBLIC_HMAC_SECRET || 'fallback-secret';
      const signature = await sign(bodyString, secret);
      
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-signature': signature,
        },
        body: bodyString,
      });

      if (!response.ok) throw new Error('Failed to subscribe');
      
      setSubscribeStatus('success');
      setName('');
      setEmail('');
      setConsent(false);
    } catch {
      // Error handling without unused variable
      setSubscribeStatus('error');
    }
  };



  return (
    <footer 
      className="bg-white border-t border-gray-200"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <Link 
              href="/" 
              className="flex items-center space-x-3 group"
              aria-label="IdEinstein Home"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Image 
                  src="/logo.png" 
                  alt="IdEinstein Logo" 
                  width={40} 
                  height={40} 
                  className="h-10 w-10 object-contain rounded-lg"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="text-xl font-bold"
              >
                <span className="text-yellow-500">Id</span>
                <span className="text-gray-900">Einstein</span>
              </motion.div>
            </Link>
            <motion.p 
              className="text-gray-600 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Where Ideas Take Shape - Your partner in innovative engineering solutions.
            </motion.p>
            <div className="space-y-3">
              {[
                { icon: Mail, text: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}`, label: 'Email us' },
                { icon: Phone, text: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone}`, label: 'Call us' },
                { icon: FaWhatsapp, text: 'WhatsApp', href: `https://wa.me/${CONTACT_INFO.whatsapp?.replace(/\s/g, '')}`, label: 'WhatsApp us' },
                { icon: Clock, text: CONTACT_INFO.businessHours }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ 
                    delay: index * 0.1 + 0.3,
                    type: 'spring',
                    stiffness: 300
                  }}
                  className="flex items-center space-x-3 text-gray-600 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-blue-600"
                  >
                    <item.icon className="w-4 h-4" />
                  </motion.div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-blue-600 transition-colors duration-300 text-sm"
                      aria-label={item.label}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm">{item.text}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h3 
              className="text-lg font-semibold mb-6 text-gray-900"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              Quick Links
            </motion.h3>
            <div className="space-y-3">
              {[
                { title: 'For Startups', href: '/services/product-development-accelerator' },
                { title: 'For Enterprises', href: '/services', triggerMenu: true },
                { title: 'Our Approach', href: '/about/hub-spoke-model', triggerMenu: true },
                { title: 'Resources', href: '/blog' },
                { title: 'About', href: '/about' },
                { title: 'Contact', href: '/contact' }
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ 
                    delay: index * 0.1 + 0.4,
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 20 
                  }}
                >
                  {link.triggerMenu ? (
                    <button
                      type="button"
                      onClick={() => {
                        // Scroll to top smoothly
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        
                        // Wait for scroll to complete, then trigger header menu
                        setTimeout(() => {
                          // Create a custom event to communicate with header
                          const event = new CustomEvent('footerMenuTrigger', {
                            detail: { menuTitle: link.title }
                          });
                          window.dispatchEvent(event);
                        }, 800);
                      }}
                      className="text-gray-600 hover:text-blue-600 transition-all duration-300 flex items-center group text-sm w-full text-left"
                    >
                      <motion.div
                        className="text-gray-400 group-hover:text-blue-600"
                        whileHover={{ x: 3 }}
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      </motion.div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.title}
                      </span>
                    </button>
                  ) : (
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 transition-all duration-300 flex items-center group text-sm"
                    >
                      <motion.div
                        className="text-gray-400 group-hover:text-blue-600"
                        whileHover={{ x: 3 }}
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      </motion.div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.title}
                      </span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Legal & Policy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h3 
              className="text-lg font-semibold mb-6 text-gray-900"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              Legal
            </motion.h3>
            <div className="space-y-3">
              {[
                { title: 'Impressum', href: '/impressum' },
                { title: 'Privacy Policy', href: '/privacy' },
                { title: 'Terms and Conditions (AGB)', href: '/terms' }
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ 
                    delay: index * 0.1 + 0.6,
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 20 
                  }}
                >
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-all duration-300 flex items-center group text-sm"
                  >
                    <motion.div
                      className="text-gray-400 group-hover:text-blue-600"
                      whileHover={{ x: 3 }}
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    </motion.div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.title}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.h3 
              className="text-lg font-semibold mb-6 text-gray-900"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              Stay Connected
            </motion.h3>
            <motion.p 
              className="text-gray-600 mb-6 leading-relaxed text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Subscribe to our newsletter for the latest updates, innovations, and engineering insights.
            </motion.p>
            
            <form onSubmit={handleSubscribe} className="space-y-4">
              {/* Optional Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg"
                  aria-label="Your name (optional)"
                />
              </motion.div>
              
              {/* Email Field */}
              <motion.div 
                className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200"
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-r-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  required
                  aria-label="Email address for newsletter"
                />
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit"
                    disabled={subscribeStatus === 'loading' || !consent}
                    variant="primary"
                    size="sm"
                    className="rounded-l-none h-10"
                    aria-label="Subscribe to newsletter"
                  >
                    <AnimatePresence mode="wait">
                      {subscribeStatus === 'loading' ? (
                        <motion.div
                          key="loading"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Send className="w-3 h-3" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="send"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Send className="w-3 h-3" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Consent Checkbox */}
              <motion.div 
                className="flex items-start space-x-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <Checkbox
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  className="mt-0.5"
                />
                <label className="text-xs text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <Link 
                    href="/privacy" 
                    className="text-blue-600 hover:text-blue-700 underline"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>{' '}
                  and consent to receiving newsletter updates. *
                </label>
              </motion.div>
              
              <AnimatePresence mode="wait">
                {subscribeStatus === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-green-600 text-xs font-medium"
                  >
                    ✅ Thank you for subscribing!
                  </motion.p>
                )}
                {subscribeStatus === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-600 text-xs font-medium"
                  >
                    ❌ {!consent ? 'Please agree to the privacy policy.' : 'Failed to subscribe. Please try again.'}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>


          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div 
              className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4"
              whileHover={{ scale: 1.01 }}
            >
              <div className="text-center md:text-left">
                <p className="text-gray-500 text-sm">
                  © {new Date().getFullYear()} IdEinstein. All rights reserved.
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Solo practice, fully compliant with German/EU data privacy law—see our{' '}
                  <Link 
                    href="/privacy" 
                    className="text-blue-500 hover:text-blue-600 underline transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <span className="text-gray-500 text-xs font-medium">Follow Us:</span>
              <div className="flex space-x-3">
                {Object.entries(SOCIAL_LINKS).map(([key, url], index) => {
                  const Icon = key === 'twitter' ? FaTwitter :
                             key === 'linkedin' ? FaLinkedin :
                             key === 'facebook' ? FaFacebook :
                             key === 'instagram' ? FaInstagram :
                             key === 'youtube' ? FaYoutube :
                             key === 'xing' ? FaXing :
                             FaInstagram;

                  return (
                    <motion.a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition-all duration-300 p-1.5 rounded-full hover:bg-blue-50"
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 5
                      }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 1.6 + index * 0.1,
                        type: 'spring',
                        stiffness: 400
                      }}
                      aria-label={`Follow us on ${key}`}
                    >
                      <Icon size={16} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
          
          {/* Made in Germany Badge */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200"
              whileHover={{ 
                scale: 1.02,
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                borderColor: 'rgba(59, 130, 246, 0.2)'
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="text-gray-600 text-xs font-medium">🇩🇪 Engineered in Germany</span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-600 text-xs font-medium">🇮🇳 Powered by Innovation</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>


    </footer>
  );
};

export default Footer;
