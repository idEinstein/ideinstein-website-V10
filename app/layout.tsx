import Script from 'next/script'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
// import { CartProvider } from '@/context/CartContext' // Not needed - store has no cart functionality
import { AudienceProvider } from '@/lib/contexts/AudienceContext'
import { AnimationProvider } from '@/lib/animations/AnimationProvider'
import FloatingContactHub from '@/components/shared/FloatingContactHub'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import StructuredData from '@/components/shared/StructuredData'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import SessionProvider from '@/components/providers/SessionProvider'
// Note: All cookie consent components permanently removed to prevent blocking issues
import { META } from '@/lib/constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = META;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Performance Optimization: Preload critical resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//analytics.google.com" />
        <StructuredData type="organization" />
        <StructuredData type="website" />
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <ErrorBoundary>
            <AnimationProvider>
              <AudienceProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                  <FloatingContactHub />
                  {/* <CookieConsent /> */} {/* Temporarily disabled to fix white page issue */}
                </div>
              </AudienceProvider>
            </AnimationProvider>
          </ErrorBoundary>
        </SessionProvider>
      </body>
    </html>
  )
}