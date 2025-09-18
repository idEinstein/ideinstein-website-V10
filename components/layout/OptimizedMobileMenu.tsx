'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OptimizedMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShowQuotation: () => void;
  pathname: string;
}

interface SubMenuItem {
  title: string;
  href: string;
  featured?: boolean;
  description?: string;
}

interface MenuItem {
  title: string;
  href: string;
  icon: string;
  featured?: boolean;
  description?: string;
  hasSubmenu?: boolean;
  submenu?: {
    category: string;
    items: SubMenuItem[];
  }[];
}

// Mobile menu structure matching desktop menu exactly
const mobileMenuItems: MenuItem[] = [
  { title: 'Home', href: '/', icon: '🏠' },
  { 
    title: 'For Startups', 
    href: '/services/product-development-accelerator', 
    icon: '🚀', 
    featured: true,
    description: 'Complete product development in 12-20 weeks'
  },
  { 
    title: 'For Enterprises', 
    href: '#', 
    icon: '🏢', 
    hasSubmenu: true,
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
    icon: '💡', 
    hasSubmenu: true,
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
  { title: 'Resources', href: '/blog', icon: '📚' },
  { title: 'Contact Us', href: '/contact', icon: '📞' }
];

const OptimizedMobileMenu: React.FC<OptimizedMobileMenuProps> = ({
  isOpen,
  onClose,
  onShowQuotation,
  pathname
}) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.hasSubmenu) {
      setExpandedMenu(expandedMenu === item.title ? null : item.title);
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[9999] lg:hidden"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.98) 0%, rgba(59, 130, 246, 0.95) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)'
          }}
        >
          {/* Optimized Three-Tier Layout */}
          <div className="flex flex-col w-full h-full min-h-screen">
            
            {/* Tier 1: Compact Header (56px) */}
            <div className="flex-shrink-0 h-14 flex items-center justify-between px-4 border-b border-white/20 bg-black/10">
              <Link href="/" onClick={onClose} className="flex items-center space-x-2">
                <Image 
                  src="/logo.png" 
                  alt="IdEinstein" 
                  width={32} 
                  height={32} 
                  className="h-8 w-8 rounded-lg"
                />
                <span className="text-lg font-bold">
                  <span className="text-yellow-400">Id</span>
                  <span className="text-white">Einstein</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tier 2: Navigation (Flexible Height) */}
            <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
              <motion.div
                initial="closed"
                animate="open"
                variants={{
                  open: { transition: { staggerChildren: 0.05 } },
                  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                }}
                className="space-y-2"
              >
                {mobileMenuItems.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: 10 }
                    }}
                  >
                    {/* Main Menu Item */}
                    {item.hasSubmenu ? (
                      <button
                        type="button"
                        onClick={() => handleMenuItemClick(item)}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-xl
                          transition-all duration-200 text-left
                          ${isActive(item.href) 
                            ? 'bg-white/20 text-yellow-400 border border-yellow-400/30' 
                            : 'text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                          }
                          ${item.featured ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50' : ''}
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{item.icon}</span>
                          <div className="flex-1">
                            <span className="font-medium">{item.title}</span>
                            {item.description && (
                              <p className="text-sm text-white/70 mt-1">{item.description}</p>
                            )}
                          </div>
                          {item.featured && (
                            <span className="text-xs bg-yellow-400 text-primary px-2 py-1 rounded-full font-semibold">
                              Featured
                            </span>
                          )}
                        </div>
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform ${
                            expandedMenu === item.title ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-xl
                          transition-all duration-200 text-left block
                          ${isActive(item.href) 
                            ? 'bg-white/20 text-yellow-400 border border-yellow-400/30' 
                            : 'text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                          }
                          ${item.featured ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50' : ''}
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{item.icon}</span>
                          <div className="flex-1">
                            <span className="font-medium">{item.title}</span>
                            {item.description && (
                              <p className="text-sm text-white/70 mt-1">{item.description}</p>
                            )}
                          </div>
                          {item.featured && (
                            <span className="text-xs bg-yellow-400 text-primary px-2 py-1 rounded-full font-semibold">
                              Featured
                            </span>
                          )}
                        </div>
                      </Link>
                    )}

                    {/* Submenu */}
                    <AnimatePresence>
                      {item.hasSubmenu && expandedMenu === item.title && item.submenu && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-6 mt-2 space-y-2 overflow-hidden border-l-2 border-yellow-400/30 pl-4"
                        >
                          {item.submenu.map((category) => (
                            <div key={category.category} className="space-y-1">
                              <div className="text-sm font-bold text-yellow-400/90 uppercase tracking-wider px-2 py-1">
                                {category.category}
                              </div>
                              <div className="space-y-1">
                                {category.items.map((subItem) => (
                                  <Link
                                    key={subItem.title}
                                    href={subItem.href}
                                    onClick={onClose}
                                    className={`
                                      block py-2 px-3 text-sm font-medium text-white/90 hover:text-yellow-400 
                                      hover:bg-white/10 rounded-lg transition-all duration-200 min-h-[40px] flex items-center
                                      backdrop-blur-sm border border-transparent hover:border-yellow-400/20
                                      ${isActive(subItem.href) ? 'text-yellow-400 bg-white/10 border-yellow-400/30' : ''}
                                      ${subItem.featured ? 'bg-yellow-400/10 border-yellow-400/50 font-semibold' : ''}
                                    `}
                                  >
                                    <span className="text-yellow-400/80 mr-3 text-sm">•</span>
                                    <span className="flex-1">{subItem.title}</span>
                                    {subItem.featured && (
                                      <span className="ml-2 text-xs bg-yellow-400 text-primary px-2 py-1 rounded-full font-semibold">
                                        Featured
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Tier 3: Compact Action Bar (80px) */}
            <div className="flex-shrink-0 h-20 px-4 py-3 border-t border-white/20 bg-black/10">
              {/* Client Portal temporarily removed - to be implemented later */}
              <div className="flex space-x-2 h-full">
                <Button
                  variant="accelerator"
                  className="w-full h-full text-sm"
                  onClick={() => {
                    onClose();
                    onShowQuotation();
                  }}
                >
                  <Quote className="w-4 h-4 mr-2" />
                  Get Quote
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



export default OptimizedMobileMenu;