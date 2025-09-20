'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function DebugPage() {
  const [diagnostics, setDiagnostics] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const runDiagnostics = async () => {
      const results: any = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href,
        cookies: document.cookie ? 'Present' : 'None',
        localStorage: (() => {
          try {
            localStorage.setItem('test', 'test')
            localStorage.removeItem('test')
            return 'Working'
          } catch {
            return 'Blocked'
          }
        })(),
        console: {
          errors: [],
          warnings: []
        }
      }

      // Test CSP
      try {
        eval('1+1') // This will fail if CSP blocks eval
        results.csp = 'Allows eval'
      } catch {
        results.csp = 'Blocks eval (strict CSP)'
      }

      // Test fetch
      try {
        await fetch('/api/health', { method: 'HEAD' })
        results.api = 'Accessible'
      } catch (e) {
        results.api = `Error: ${e}`
      }

      // Test component loading
      try {
        const { ErrorBoundary } = await import('@/components/shared/ErrorBoundary')
        results.components = 'Loading OK'
      } catch (e) {
        results.components = `Error: ${e}`
      }

      setDiagnostics(results)
      setIsLoading(false)
    }

    runDiagnostics()
  }, [])

  const testUrls = [
    { name: 'Normal Site', url: '/' },
    { name: 'No CSP', url: '/?debug=no-csp' },
    { name: 'CSP Report Only', url: '/?debug=csp-report-only' },
    { name: 'Simple Mode', url: '/?debug=simple' },
    { name: 'Production Debug', url: '/?debug=prod' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Running diagnostics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Debug Dashboard</h1>
          <p className="text-gray-600 mb-6">
            This page helps diagnose issues with the IdEinstein website.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Diagnostics */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">System Diagnostics</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span className="font-mono text-xs">{diagnostics.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Viewport:</span>
                  <span className="font-mono">{diagnostics.viewport}</span>
                </div>
                <div className="flex justify-between">
                  <span>Local Storage:</span>
                  <span className={`font-mono ${diagnostics.localStorage === 'Working' ? 'text-green-600' : 'text-red-600'}`}>
                    {diagnostics.localStorage}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>CSP Status:</span>
                  <span className="font-mono text-xs">{diagnostics.csp}</span>
                </div>
                <div className="flex justify-between">
                  <span>API Access:</span>
                  <span className={`font-mono text-xs ${diagnostics.api === 'Accessible' ? 'text-green-600' : 'text-red-600'}`}>
                    {diagnostics.api}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Components:</span>
                  <span className={`font-mono text-xs ${diagnostics.components === 'Loading OK' ? 'text-green-600' : 'text-red-600'}`}>
                    {diagnostics.components}
                  </span>
                </div>
              </div>
            </div>

            {/* Test URLs */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Test Different Modes</h2>
              <div className="space-y-2">
                {testUrls.map((test) => (
                  <Button
                    key={test.name}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.location.href = test.url}
                  >
                    {test.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* User Agent */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">User Agent</h3>
            <p className="text-xs font-mono text-gray-600 break-all">
              {diagnostics.userAgent}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Refresh Diagnostics
            </Button>
            <Button
              onClick={() => {
                const data = JSON.stringify(diagnostics, null, 2)
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'debug-report.json'
                a.click()
                URL.revokeObjectURL(url)
              }}
              variant="outline"
            >
              Download Report
            </Button>
          </div>
        </div>

        {/* Quick Fixes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-3">Quick Fixes</h2>
          <div className="space-y-2 text-sm text-yellow-700">
            <p>• If you see a white screen, try the "No CSP" mode above</p>
            <p>• If components won't load, try "Simple Mode"</p>
            <p>• If you're on mobile, try refreshing the page</p>
            <p>• Clear your browser cache and cookies if issues persist</p>
          </div>
        </div>
      </div>
    </div>
  )
}