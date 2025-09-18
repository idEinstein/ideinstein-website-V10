'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { UnifiedConsultationCard } from '@/components/shared/UnifiedConsultationCard';
import OptimizedMobileMenu from './OptimizedMobileMenu';
import { useMobileMenu } from '@/hooks/useMobileMenu';
import { throttle } from 'lodash';

const menuItems = [
  { title: 'Home', href: '/' },
  { 
    title: 'For Startups', 
    href: '/services/product-development-accelerator',
    description: 'Complete product development in 12-20 weeks'
  },
  {
    title: 'For Enterprises',
    href: '#',
    submenu: [
      {
        category: 'Enterprise Solutions',
        items: [
          { title: 'Enterprise Overview', href: '/solutions/for-enterprises', featured: true, description: 'Complete enterprise benefits & service portfolio' }
        ]
      },
      {
        category: 'Engineering Services',
        items: [
          { title: 'Research & Development', href: '/services/research-development' },
          { title: 'CAD Modeling & Design', href: '/services/cad-modeling' },
          { title: 'Machine Design', href: '/services/machine-design' },
          { title: 'BIW Design', href: '/services/biw-design' },
          { title: 'FEA & CFD Analysis', href: '/services/finite-element-cfd' },
          { title: 'GD&T & Tolerance Analysis', href: '/services/gdt-tolerance' }
        ]
      },
      {
        category: 'Manufacturing Solutions',
        items: [
          { title: '3D Printing Services', href: '/services/3d-printing' },
          { title: 'Supplier Sourcing', href: '/services/supplier-sourcing' },
          { title: 'Technical Documentation', href: '/services/technical-documentation' }
        ]
      }
    ]
  },
  { 
    title: 'Our Approach', 
    href: '#',
    submenu: [
      {
        category: 'Why Choose IdEinstein',
        items: [
          { title: 'Hub & Spoke Model', href: '/about/hub-spoke-model' },
          { title: 'About Me', href: '/about' }
        ]
      }
    ]
  },
  { title: 'Resources', href: '/blog' },
  { title: 'Contact Us', href: '/contact' }
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showQuotation, setShowQuotation] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [forceShowMenu, setForceShowMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { isOpen, openMenu, closeMenu } = useMobileMenu();

  useEffect(() => {
    // Set loaded state after component mounts
    setIsLoaded(true);
    
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 20);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as Element).closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  useEffect(() => {
    // Listen for footer menu trigger events
    const handleFooterMenuTrigger = (event: CustomEvent) => {
      const { menuTitle } = event.detail;
      setForceShowMenu(menuTitle);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setForceShowMenu(null);
      }, 5000);
    };

    window.addEventListener('footerMenuTrigger', handleFooterMenuTrigger as EventListener);
    return () => window.removeEventListener('footerMenuTrigger', handleFooterMenuTrigger as EventListener);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'blur(10px) saturate(120%)'
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 20,
        opacity: { duration: 0.3 }
      }}
      className={`
        fixed top-0 w-full z-50
        backdrop-blur-xl
        transition-all duration-700 ease-out
        border-b border-white/10
        ${isScrolled
          ? 'bg-primary/95 shadow-2xl shadow-primary/20 py-1.5' 
          : 'bg-primary/85 py-2.5'}
      `}
      style={{
        background: isScrolled 
          ? 'linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(59, 130, 246, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(30, 64, 175, 0.85) 0%, rgba(59, 130, 246, 0.8) 100%)'
      }}
      role="banner"
    >
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16 relative">
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
            aria-label="IdEinstein Home"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 15,
                delay: 0.2 
              }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)'
              }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Image 
                src="/logo.png" 
                alt="IdEinstein Logo" 
                width={48} 
                height={48} 
                priority 
                className="h-12 w-12 object-contain rounded-lg"
              />
              {/* Pulse ring animation */}
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-yellow-400/50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ 
                scale: 1.02,
                textShadow: '0 0 8px rgba(251, 191, 36, 0.8)'
              }}
              className="text-2xl font-bold"
            >
              <motion.span 
                className="text-yellow-400"
                whileHover={{ 
                  scale: 1.1,
                  filter: 'brightness(1.2)'
                }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                Id
              </motion.span>
              <motion.span 
                className="text-white"
                whileHover={{ 
                  scale: 1.05,
                  color: '#f8fafc'
                }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                Einstein
              </motion.span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden lg:flex items-center space-x-8 relative" 
            role="navigation"
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.4
                }
              }
            }}
          >
            {menuItems.map((item) => (
              <motion.div 
                key={item.title} 
                className="relative group"
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { type: 'spring', stiffness: 300, damping: 20 }
                  }
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Link
                    href={item.href}
                    className={`
                      relative py-2 px-3 text-white/90 hover:text-yellow-400
                      transition-all duration-300 ease-in-out
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50
                      ${isActive(item.href) ? 'text-yellow-400' : ''}
                    `}
                    aria-expanded={item.submenu ? "true" : undefined}
                    role={item.submenu ? "button" : undefined}
                    onClick={item.submenu ? (e) => e.preventDefault() : undefined}
                  >
                    <span className="flex items-center relative">
                      <motion.span
                        whileHover={{ x: 2 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                        className="relative"
                      >
                        {item.title}
                        {!item.submenu && isActive(item.href) && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 right-0 top-full mt-1 h-0.5 bg-gradient-to-r from-yellow-400/90 via-yellow-300 to-yellow-400/90 rounded-full"
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            exit={{ scaleX: 0, opacity: 0 }}
                            transition={{ 
                              type: 'spring', 
                              stiffness: 400, 
                              damping: 30,
                              opacity: { duration: 0.2 }
                            }}
                            style={{
                              transformOrigin: 'center',
                              boxShadow: '0 0 8px rgba(251, 191, 36, 0.4)'
                            }}
                          />
                        )}
                      </motion.span>
                      {item.submenu && (
                        <motion.span
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.3, type: 'spring' }}
                          className="ml-1"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                      )}
                    </span>
                  </Link>
                </motion.div>

                {item.submenu && (
                  <div
                    className={`absolute top-full left-0 mt-2 w-80 transition-all duration-300 ease-in-out transform z-50 ${
                      forceShowMenu === item.title 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2'
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="bg-white backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-primary/10"
                    >
                      {item.submenu.map((category) => (
                        <div key={category.category} className="py-2">
                          <div className="px-6 py-3 text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-primary/10 to-transparent">
                            {category.category}
                          </div>
                          <div className="space-y-1">
                            {category.items.map((subItem) => (
                              <motion.div
                                key={subItem.title}
                                whileHover={{ scale: 1.02, x: 5 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                              >
                                <Link
                                  href={subItem.href}
                                  className={`
                                    group block px-6 py-4 text-gray-700 hover:text-primary 
                                    transition-all duration-300 ease-out relative
                                    ${isActive(subItem.href) ? 'text-primary font-semibold bg-primary/5' : 'hover:translate-x-1'}
                                    ${(subItem as any).featured ? 'bg-blue-50 border-l-4 border-blue-500 font-semibold' : ''}
                                  `}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <span className="text-base font-medium">
                                        {subItem.title}
                                      </span>
                                      {(subItem as any).description && (
                                        <p className="text-sm text-gray-500 mt-1">
                                          {(subItem as any).description}
                                        </p>
                                      )}
                                    </div>
                                    {(subItem as any).featured && (
                                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full flex-shrink-0">
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.nav>

          {/* Desktop Actions */}
          <motion.div 
            className="hidden lg:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >

            {/* Client Portal temporarily removed - to be implemented later */}

            {/* Get Quote Button */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Button 
                variant="header"
                onClick={() => setShowQuotation(true)}
                className="relative overflow-hidden group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
              >
                <motion.span
                  className="relative z-10"
                  whileHover={{ x: 2 }}
                >
                  Get Quote
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>
            

          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={openMenu}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg
              transition-colors duration-200"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Optimized Mobile Menu */}
      <OptimizedMobileMenu
        isOpen={isOpen}
        onClose={closeMenu}
        onShowQuotation={() => setShowQuotation(true)}
        pathname={pathname}
      />

      {/* Quotation Dialog */}
      <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Request a Quotation</DialogTitle>
          <UnifiedConsultationCard
            type="quotation"
            onSubmit={async (data) => {
              try {
                console.log('📝 Submitting quote request from header:', data);
                
                const response = await fetch('/api/quotes', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                  console.log('✅ Quote submitted successfully:', result);
                  alert(`Quote request submitted successfully! Reference: ${result.quoteReference}`);
                  setShowQuotation(false);
                } else {
                  console.error('❌ Quote submission failed:', result);
                  alert(`Failed to submit quote: ${result.error}`);
                }
              } catch (error) {
                console.error('❌ Quote submission error:', error);
                alert('Failed to submit quote request. Please try again.');
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </motion.header>
  );
};

export default Header;
