import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent)
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    isMobile,
    userAgent,
    headers: Object.fromEntries(request.headers.entries()),
    url: request.url,
    environment: process.env.NODE_ENV,
    vercel: {
      region: process.env.VERCEL_REGION,
      url: process.env.VERCEL_URL
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log mobile errors to console (visible in Vercel logs)
    console.error('🚨 Mobile Error Report:', {
      timestamp: new Date().toISOString(),
      ...body
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to process mobile debug report:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}