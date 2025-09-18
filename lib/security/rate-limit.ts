/**
 * Production-Grade Rate Limiting System
 * Implements sliding window rate limiting with Redis-like in-memory store
 */

import { NextRequest } from 'next/server';
import { securityLogger } from './logging';
import { recordRateLimitAttempt } from './rate-limit-monitor';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  keyGenerator?: (request: NextRequest) => string; // Custom key generator
  onLimitReached?: (key: string, request: NextRequest) => void; // Callback when limit reached
  whitelist?: string[]; // IPs to whitelist
  message?: string; // Custom error message
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number; // Seconds until next request allowed
}

export interface RateLimitStore {
  key: string;
  requests: number[];
  resetTime: number;
}

/**
 * In-memory rate limit store (Redis-like functionality)
 */
class RateLimitMemoryStore {
  private store = new Map<string, RateLimitStore>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Get current request count for a key
   */
  get(key: string, windowMs: number): RateLimitStore {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    let store = this.store.get(key);
    
    if (!store) {
      store = {
        key,
        requests: [],
        resetTime: now + windowMs
      };
      this.store.set(key, store);
    }

    // Remove requests outside the current window (sliding window)
    store.requests = store.requests.filter(timestamp => timestamp > windowStart);
    
    return store;
  }

  /**
   * Increment request count for a key
   */
  increment(key: string, windowMs: number): RateLimitStore {
    const store = this.get(key, windowMs);
    const now = Date.now();
    
    store.requests.push(now);
    store.resetTime = Math.max(store.resetTime, now + windowMs);
    
    this.store.set(key, store);
    return store;
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.store.forEach((store, key) => {
      if (store.resetTime < now && store.requests.length === 0) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.store.delete(key);
    });
  }

  /**
   * Get store statistics
   */
  getStats(): { totalKeys: number; totalRequests: number } {
    let totalRequests = 0;
    
    this.store.forEach((store) => {
      totalRequests += store.requests.length;
    });

    return {
      totalKeys: this.store.size,
      totalRequests
    };
  }

  /**
   * Reset all rate limits (admin function)
   */
  resetAll(): void {
    this.store.clear();
  }

  /**
   * Cleanup rate limit store (for testing or shutdown)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

/**
 * Global rate limit store instance with singleton pattern
 * This ensures the same instance is used across middleware and API routes
 */
const getRateLimitStore = (): RateLimitMemoryStore => {
  const globalKey = '__rateLimitStore';
  
  if (!(globalThis as any)[globalKey]) {
    console.log('🔄 STORE: Creating new rate limit store instance');
    (globalThis as any)[globalKey] = new RateLimitMemoryStore();
  }
  
  return (globalThis as any)[globalKey];
};

const rateLimitStore = getRateLimitStore();

/**
 * Default rate limit configurations for different endpoints
 */
export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // API endpoints - strict limits
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    message: 'Too many API requests, please try again later.'
  },
  
  // Admin endpoints - very generous limits for development
  admin: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute (very generous for testing)
    message: 'Too many admin requests, please try again later.'
  },
  
  // NextAuth internal endpoints - more generous for legitimate auth flows
  nextauth: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 20, // 20 requests per 5 minutes (allows for auth flow complexity)
    message: 'Authentication service temporarily unavailable, please try again in a few minutes.'
  },
  
  // Authentication login attempts - strict for actual login attempts
  auth_login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts per 15 minutes
    message: 'Too many login attempts, please try again later.'
  },
  
  // Contact forms - moderate limits
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 submissions per hour
    message: 'Too many form submissions, please try again later.'
  },
  
  // General pages - generous limits
  general: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Too many requests, please slow down.'
  },
  
  // File uploads - strict limits
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 uploads per hour
    message: 'Too many file uploads, please try again later.'
  }
};

/**
 * Extract and normalize IP address from request
 */
function extractIP(request: NextRequest): string {
  // Extract IP address from various headers
  let ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
           request.headers.get('x-real-ip') ||
           request.headers.get('cf-connecting-ip') ||
           'unknown';
  
  // Normalize localhost IPs for development
  if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
    ip = 'localhost';
  }
  
  return ip;
}

/**
 * Generate rate limit key from request
 */
export function generateRateLimitKey(request: NextRequest, prefix: string = 'rl'): string {
  const ip = extractIP(request);
  
  // Include user agent hash for additional uniqueness
  const userAgent = request.headers.get('user-agent') || '';
  const userAgentHash = userAgent ? hashString(userAgent).substring(0, 8) : 'unknown';
  
  return `${prefix}:${ip}:${userAgentHash}`;
}

/**
 * Simple string hash function
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check if IP is whitelisted
 */
function isWhitelisted(ip: string, whitelist?: string[]): boolean {
  if (!whitelist || whitelist.length === 0) return false;
  
  return whitelist.some(whitelistedIP => {
    // Support CIDR notation and exact matches
    if (whitelistedIP.includes('/')) {
      // TODO: Implement CIDR matching if needed
      return false;
    }
    return ip === whitelistedIP;
  });
}

/**
 * Apply rate limiting to a request
 */
export function applyRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  keyPrefix?: string
): RateLimitResult {
  const key = config.keyGenerator 
    ? config.keyGenerator(request)
    : generateRateLimitKey(request, keyPrefix);
  
  // Extract and normalize IP consistently
  const ip = extractIP(request);
  
  // Check whitelist
  if (isWhitelisted(ip, config.whitelist)) {
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      resetTime: new Date(Date.now() + config.windowMs)
    };
  }

  // Get current state
  const store = rateLimitStore.get(key, config.windowMs);
  const currentRequests = store.requests.length;
  
  // Check if limit exceeded
  if (currentRequests >= config.maxRequests) {
    // Log rate limit violation
    securityLogger.logRateLimitViolation(ip, request.url, config.maxRequests, request);
    
    // Record monitoring data for violation
    recordRateLimitAttempt(
      ip,
      request.url,
      true, // isViolation
      request.headers.get('user-agent') || undefined,
      config.maxRequests,
      currentRequests + 1
    );
    
    // Call callback if provided
    if (config.onLimitReached) {
      config.onLimitReached(key, request);
    }
    
    const resetTime = new Date(store.resetTime);
    const retryAfter = Math.ceil((store.resetTime - Date.now()) / 1000);
    
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime,
      retryAfter: Math.max(retryAfter, 1)
    };
  }

  // Increment counter
  const updatedStore = rateLimitStore.increment(key, config.windowMs);
  
  // Record monitoring data for successful request
  recordRateLimitAttempt(
    ip,
    request.url,
    false, // not a violation
    request.headers.get('user-agent') || undefined,
    config.maxRequests,
    updatedStore.requests.length
  );
  
  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - updatedStore.requests.length),
    resetTime: new Date(updatedStore.resetTime)
  };
}

/**
 * Get rate limit configuration for a specific endpoint
 */
export function getRateLimitConfig(request: NextRequest): { config: RateLimitConfig; type: string } {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  
  // Admin endpoints - more generous limits for legitimate admin use
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    return { config: DEFAULT_RATE_LIMITS.admin, type: 'admin' };
  }
  
  // Customer portal endpoints - generous limits for customer use
  if (pathname.startsWith('/portal') || pathname.startsWith('/api/portal')) {
    return { config: DEFAULT_RATE_LIMITS.api, type: 'portal' };
  }
  
  // NextAuth internal endpoints - more generous for auth flow
  if (pathname.startsWith('/api/auth/')) {
    // Distinguish between actual login attempts and NextAuth internal calls
    if (pathname.includes('/signin') || pathname.includes('/callback')) {
      // More generous for NextAuth internal operations
      return { config: DEFAULT_RATE_LIMITS.nextauth, type: 'nextauth' };
    } else if (method === 'POST' && pathname.includes('/credentials')) {
      // Strict for actual login attempts
      return { config: DEFAULT_RATE_LIMITS.auth_login, type: 'auth_login' };
    } else {
      // Default NextAuth operations (session checks, etc.)
      return { config: DEFAULT_RATE_LIMITS.nextauth, type: 'nextauth' };
    }
  }
  
  // Auth pages (sign-in forms, etc.)
  if (pathname.startsWith('/auth')) {
    return { config: DEFAULT_RATE_LIMITS.nextauth, type: 'auth_pages' };
  }
  
  // Contact/form endpoints
  if (pathname.includes('/contact') || pathname.includes('/consultation') || pathname.includes('/newsletter')) {
    return { config: DEFAULT_RATE_LIMITS.contact, type: 'contact' };
  }
  
  // File upload endpoints
  if (pathname.includes('/upload') || pathname.includes('/files')) {
    return { config: DEFAULT_RATE_LIMITS.upload, type: 'upload' };
  }
  
  // API endpoints
  if (pathname.startsWith('/api/')) {
    return { config: DEFAULT_RATE_LIMITS.api, type: 'api' };
  }
  
  // General pages
  return { config: DEFAULT_RATE_LIMITS.general, type: 'general' };
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime.getTime() / 1000).toString(),
  };

  if (!result.allowed && result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

/**
 * Reset rate limit for a specific key (admin function)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.reset(key);
}

/**
 * Reset rate limits for authentication-related keys (system recovery)
 */
export function resetAuthRateLimits(): void {
  const store = (rateLimitStore as any).store as Map<string, RateLimitStore>;
  const keysToReset: string[] = [];
  
  store.forEach((_, key) => {
    if (key.includes('nextauth') || key.includes('auth_login') || key.includes('auth_pages')) {
      keysToReset.push(key);
    }
  });
  
  keysToReset.forEach(key => {
    rateLimitStore.reset(key);
  });
  
  console.log(`🔄 Reset ${keysToReset.length} authentication rate limit keys for system recovery`);
}

/**
 * Check if rate limiting should be bypassed due to system errors
 */
export function shouldBypassRateLimit(request: NextRequest, errorContext?: string): boolean {
  // Bypass rate limiting for auth routes if there are known system issues
  const pathname = request.nextUrl.pathname;
  
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/auth')) {
    // Check for known system error indicators
    if (errorContext?.includes('CSP') || errorContext?.includes('CLIENT_FETCH_ERROR')) {
      console.log('🔄 Bypassing rate limit due to system error:', errorContext);
      return true;
    }
  }
  
  return false;
}

/**
 * Get rate limit store statistics
 */
export function getRateLimitStats(): { totalKeys: number; totalRequests: number } {
  return rateLimitStore.getStats();
}

/**
 * Reset all rate limits (admin function)
 */
export function resetAllRateLimits(): void {
  console.log('🔄 RESET: Calling resetAllRateLimits()');
  const statsBefore = rateLimitStore.getStats();
  console.log('🔄 RESET: Stats before reset:', statsBefore);
  
  (rateLimitStore as any).resetAll();
  
  const statsAfter = rateLimitStore.getStats();
  console.log('🔄 RESET: Stats after reset:', statsAfter);
}

/**
 * Cleanup rate limit store (for testing or shutdown)
 */
export function cleanupRateLimitStore(): void {
  rateLimitStore.destroy();
}
