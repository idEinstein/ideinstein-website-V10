'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ServiceNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg"
        >
          <Search className="w-12 h-12 text-white" />
        </motion.div>

        {/* Content */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Service Not Found
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8 leading-relaxed"
        >
          The service you're looking for doesn't exist or may have been moved. 
          Browse our complete engineering services portfolio instead.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Button
            asChild
            variant="accelerator"
            size="lg"
            className="w-full rounded-full px-6 py-3"
          >
            <Link href="/solutions/for-enterprises#services">
              <Wrench className="w-5 h-5 mr-2" />
              View All Services
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full rounded-full px-6 py-3"
          >
            <Link href="/">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </Button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500 mb-4">Popular Services:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { title: 'R&D', href: '/services/research-development' },
              { title: 'CAD Modeling', href: '/services/cad-modeling' },
              { title: '3D Printing', href: '/services/3d-printing' },
              { title: 'Machine Design', href: '/services/machine-design' }
            ].map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                {service.title}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}