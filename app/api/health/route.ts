import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || 'unknown',
      checks: {
        database: 'ok', // Add actual database check if needed
        zoho: process.env.ZOHO_CLIENT_ID ? 'configured' : 'not-configured',
        auth: process.env.NEXTAUTH_SECRET ? 'configured' : 'not-configured',
        hmac: process.env.FORM_HMAC_SECRET ? 'configured' : 'not-configured'
      }
    }

    return NextResponse.json(health, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}

export async function HEAD(request: NextRequest) {
  // Simple HEAD request for connectivity testing
  return new NextResponse(null, { status: 200 })
}