import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateQueryParams } from '@/lib/middleware/validation'

// Cache for 1 hour
export const revalidate = 3600

const CachedExampleQuerySchema = z.object({
  format: z.enum(['json', 'xml']).default('json'),
  include_meta: z.string().transform(val => val === 'true').pipe(z.boolean()).default('false')
});

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const queryValidation = CachedExampleQuerySchema.safeParse(params);
    
    if (!queryValidation.success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid query parameters',
          details: queryValidation.error.flatten()
        },
        { status: 400 }
      );
    }
    
    const { format, include_meta } = queryValidation.data;
    
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
const CachedExampleBodySchema = z.object({
  data: z.any(),
  cache_duration: z.number().min(0).max(86400).optional().default(3600)
});

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const { validateRequestBody } = await import('@/lib/middleware/validation');
    const bodyValidation = await validateRequestBody(request, CachedExampleBodySchema);
    if (!bodyValidation.success) {
      return bodyValidation.response;
    }
    
    const body = bodyValidation.data;
    
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