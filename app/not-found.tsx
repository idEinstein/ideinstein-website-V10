/**
 * Custom 404 Not Found Page
 * Prevents information disclosure through error pages
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto text-center px-6">
        {/* 404 Error Display */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Return Home
          </Link>
          
          <div className="flex space-x-4">
            <Link 
              href="/services"
              className="flex-1 text-primary border border-primary px-4 py-2 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Our Services
            </Link>
            <Link 
              href="/contact"
              className="flex-1 text-primary border border-primary px-4 py-2 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-primary hover:underline">Contact our team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Metadata for the 404 page
export const metadata = {
  title: '404 - Page Not Found | IdEinstein',
  description: 'The page you are looking for could not be found.',
  robots: 'noindex, nofollow'
};