'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Enhanced mobile error logging for production
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
    const errorDetails = {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      isMobile,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    }
    
    // Log to console for debugging
    console.error('🚨 Mobile Error Details:', errorDetails)
    
    // Send to API for production logging
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      fetch('/api/mobile-debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'error', ...errorDetails })
      }).catch(e => console.warn('Failed to log error:', e))
    }
    
    // Log to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        event_category: 'Error',
        event_label: `${isMobile ? 'Mobile' : 'Desktop'}: ${error.message}`,
        value: 0,
      })
    }
    
    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4 max-w-md">
            We're sorry, but this section couldn't load properly. Please try refreshing or contact support if the problem persists.
          </p>
          <Button
            onClick={this.handleRetry}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

// Specialized error boundaries for different sections
export const HeroErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="relative pt-24 pb-6 md:pt-28 md:pb-8 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            IdEinstein Engineering
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-80">
            Professional Engineering Services
          </p>
          <Button variant="accelerator" size="hero" asChild>
            <a href="/contact">Get Started</a>
          </Button>
        </div>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
)

export const MetricsErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600 mb-1">26+</div>
          <div className="text-sm text-gray-600">Years Experience</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600 mb-1">24h</div>
          <div className="text-sm text-gray-600">Response Time</div>
        </div>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
)

export const ComparisonErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Why Choose IdEinstein?
        </h3>
        <p className="text-gray-600 mb-4">
          26+ years of engineering excellence delivering production-ready designs
        </p>
        <Button variant="outline" asChild>
          <a href="/about">Learn More About Our Approach</a>
        </Button>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
)