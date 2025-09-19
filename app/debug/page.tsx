'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [errors, setErrors] = useState<string[]>([])
  const [componentTests, setComponentTests] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Test each component individually
    const testComponent = async (name: string, testFn: () => Promise<boolean>) => {
      try {
        const result = await testFn()
        setComponentTests(prev => ({ ...prev, [name]: result }))
      } catch (error) {
        setErrors(prev => [...prev, `${name}: ${error}`])
        setComponentTests(prev => ({ ...prev, [name]: false }))
      }
    }

    // Test basic React rendering
    testComponent('React Rendering', async () => {
      return true
    })

    // Test Framer Motion
    testComponent('Framer Motion', async () => {
      const { motion } = await import('framer-motion')
      return !!motion
    })

    // Test Tailwind CSS
    testComponent('Tailwind CSS', async () => {
      const element = document.createElement('div')
      element.className = 'bg-blue-500'
      document.body.appendChild(element)
      const styles = window.getComputedStyle(element)
      document.body.removeChild(element)
      return styles.backgroundColor !== ''
    })

  }, [])

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mobile Debug Page</h1>
        
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Component Tests</h2>
          {Object.entries(componentTests).map(([name, passed]) => (
            <div key={name} className={`p-2 mb-2 rounded ${passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {passed ? '✅' : '❌'} {name}
            </div>
          ))}
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4 text-red-800">Errors Found</h2>
            {errors.map((error, index) => (
              <div key={index} className="text-red-700 mb-2 font-mono text-sm">
                {error}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Device Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Screen:</strong> {screen.width}x{screen.height}</p>
            <p><strong>Viewport:</strong> {window.innerWidth}x{window.innerHeight}</p>
            <p><strong>Touch:</strong> {'ontouchstart' in window ? 'Supported' : 'Not supported'}</p>
            <p><strong>Connection:</strong> {(navigator as any).connection?.effectiveType || 'Unknown'}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            Test Main Homepage
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600"
          >
            Reload Debug Page
          </button>
        </div>
      </div>
    </div>
  )
}