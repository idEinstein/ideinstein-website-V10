import { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, number>();

export async function rateLimit(request: NextRequest, maxRequests = 100, windowMs = 15 * 60 * 1000) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
  const now = Date.now();
  const key = `${ip}:${Math.floor(now / windowMs)}`;
  
  const current = rateLimitMap.get(key) || 0;

  if (current >= maxRequests) {
    return { 
      success: false, 
      remaining: 0,
      resetTime: Math.ceil((Math.floor(now / windowMs) + 1) * windowMs)
    };
  }

  rateLimitMap.set(key, current + 1);
  
  // Cleanup old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    const keysToDelete: string[] = [];
    rateLimitMap.forEach((_, k) => {
      const keyTime = parseInt(k.split(':')[1]) * windowMs;
      if (now - keyTime > windowMs) {
        keysToDelete.push(k);
      }
    });
    keysToDelete.forEach(k => rateLimitMap.delete(k));
  }

  return { 
    success: true, 
    remaining: maxRequests - current - 1,
    resetTime: Math.ceil((Math.floor(now / windowMs) + 1) * windowMs)
  };
}

export function getRateLimitHeaders(result: any) {
  return {
    'X-RateLimit-Limit': '100',
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString()
  };
}