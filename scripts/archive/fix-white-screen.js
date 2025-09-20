#!/usr/bin/env node

/**
 * Quick fix script for white screen deployment issue
 * This script helps diagnose and fix the white screen problem
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing white screen deployment issue...\n');

// 1. Check if CSP is the issue by temporarily disabling it
console.log('1. Checking middleware CSP configuration...');
const middlewarePath = path.join(process.cwd(), 'middleware.ts');

if (fs.existsSync(middlewarePath)) {
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  
  if (middlewareContent.includes('IS_PRODUCTION')) {
    console.log('✅ CSP already disabled in production');
  } else {
    console.log('❌ CSP still active in production - needs manual fix');
  }
} else {
  console.log('❌ middleware.ts not found');
}

// 2. Check home page for error handling
console.log('\n2. Checking home page error handling...');
const homePagePath = path.join(process.cwd(), 'app', 'page.tsx');

if (fs.existsSync(homePagePath)) {
  const homePageContent = fs.readFileSync(homePagePath, 'utf8');
  
  if (homePageContent.includes('hasError') && homePageContent.includes('isLoading')) {
    console.log('✅ Error handling and loading states added');
  } else {
    console.log('❌ Missing error handling - needs manual fix');
  }
} else {
  console.log('❌ app/page.tsx not found');
}

// 3. Create a simple test page for debugging
console.log('\n3. Creating test page for debugging...');
const testPageDir = path.join(process.cwd(), 'app', 'test-deploy');
const testPagePath = path.join(testPageDir, 'page.tsx');

if (!fs.existsSync(testPageDir)) {
  fs.mkdirSync(testPageDir, { recursive: true });
}

const testPageContent = `export default function TestDeployPage() {
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
          <a href="/" className="block w-full bg-blue-500 text-white p-3 rounded-lg text-center hover:bg-blue-600">
            Test Main Homepage
          </a>
          <a href="/?debug=prod" className="block w-full bg-yellow-500 text-white p-3 rounded-lg text-center hover:bg-yellow-600">
            Debug Mode
          </a>
          <a href="/debug" className="block w-full bg-gray-500 text-white p-3 rounded-lg text-center hover:bg-gray-600">
            Component Debug
          </a>
        </div>
        
        <div className="mt-8 text-sm text-gray-600">
          <p>Environment: {process.env.NODE_ENV || 'unknown'}</p>
          <p>Timestamp: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  )
}`;

fs.writeFileSync(testPagePath, testPageContent);
console.log('✅ Test page created at /test-deploy');

console.log('\n🚀 Next steps:');
console.log('1. Deploy the changes');
console.log('2. Visit /test-deploy to verify basic functionality');
console.log('3. If test page works, try /?debug=prod for detailed error info');
console.log('4. If main page still white, CSP is likely the issue');
console.log('\n📝 Debug URLs:');
console.log('- /test-deploy - Basic functionality test');
console.log('- /?debug=prod - Production debug mode');
console.log('- /?debug=no-csp - Disable CSP specifically');
console.log('- /debug - Component testing');