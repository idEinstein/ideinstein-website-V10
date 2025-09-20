import Link from 'next/link'

export default function TestDeployPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Deployment Test Page</h1>
        <div className="bg-green-100 border border-green-400 p-4 rounded-lg mb-6">
          <h2 className="font-bold text-green-800">✅ Basic React Rendering Works</h2>
          <p className="text-green-700">If you can see this, React is working</p>
        </div>
        
        <div className="bg-blue-100 border border-blue-400 p-4 rounded-lg mb-6">
          <h2 className="font-bold text-blue-800">🎨 Tailwind CSS Test</h2>
          <div className="w-full h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
          <p className="text-blue-700 mt-2">If you see a gradient above, Tailwind is working</p>
        </div>
        
        <div className="space-y-4">
          <Link href="/" className="block w-full bg-blue-500 text-white p-3 rounded-lg text-center hover:bg-blue-600">
            Test Main Homepage
          </Link>
          <Link href="/?debug=prod" className="block w-full bg-yellow-500 text-white p-3 rounded-lg text-center hover:bg-yellow-600">
            Debug Mode
          </Link>
          <Link href="/debug" className="block w-full bg-gray-500 text-white p-3 rounded-lg text-center hover:bg-gray-600">
            Component Debug
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-600">
          <p>Environment: {process.env.NODE_ENV || 'unknown'}</p>
          <p>Timestamp: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  )
}