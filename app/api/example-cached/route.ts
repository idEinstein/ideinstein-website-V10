import { NextRequest, NextResponse } from 'next/server'

// Cache for 1 hour
export const revalidate = 3600

export async function GET(request: NextRequest) {
  try {
    // Simulate data fetching
    const data = {
      message: 'This response is cached for 1 hour',
      timestamp: new Date().toISOString(),
      cached: true
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'CDN-Cache-Control': 'public, max-age=86400',
        'Vercel-CDN-Cache-Control': 'public, max-age=86400'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    )
  }
}

// Example of conditional caching
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Process the request
    const result = {
      success: true,
      data: body,
      timestamp: new Date().toISOString()
    }

    // Don't cache POST requests by default
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Bad Request' },
      { 
        status: 400,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    )
  }
}