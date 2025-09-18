/**
 * Enhanced Admin Authentication System
 * Enterprise-grade authentication with session management and security features
 */

import { NextRequest } from 'next/server';
import { randomBytes, createHash } from 'crypto';

export interface AdminAuthResult {
  isAuthenticated: boolean;
  error?: string;
  sessionId?: string;
}

export interface AdminSession {
  sessionId: string;
  createdAt: number;
  lastActivity: number;
  isValid: boolean;
  ipAddress?: string;
  userAgent?: string;
}

// Security configuration
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKEN_EXPIRY = 4 * 60 * 60 * 1000; // 4 hours (reduced from 24 for better security)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes lockout

// In-memory session store (in production, use Redis or database)
const adminSessions = new Map<string, AdminSession>();
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();

/**
 * Generate cryptographically secure session ID
 */
function generateSecureSessionId(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Generate secure admin token with session management
 */
export function generateAdminToken(ipAddress?: string, userAgent?: string): { token: string; sessionId: string } {
  const sessionId = generateSecureSessionId();
  const timestamp = Date.now();
  
  // Create session
  const session: AdminSession = {
    sessionId,
    createdAt: timestamp,
    lastActivity: timestamp,
    isValid: true,
    ipAddress,
    userAgent
  };
  
  adminSessions.set(sessionId, session);
  
  // Create token with session ID and timestamp
  const tokenData = `${sessionId}:${timestamp}`;
  const token = Buffer.from(tokenData).toString('base64');
  
  return { token, sessionId };
}

/**
 * Validate admin session with timeout and activity tracking
 */
function validateAdminSession(sessionId: string, ipAddress?: string): AdminAuthResult {
  const session = adminSessions.get(sessionId);
  
  if (!session || !session.isValid) {
    return { isAuthenticated: false, error: 'Invalid session' };
  }
  
  const now = Date.now();
  
  // Check token expiry
  if (now - session.createdAt > TOKEN_EXPIRY) {
    adminSessions.delete(sessionId);
    return { isAuthenticated: false, error: 'Session expired' };
  }
  
  // Check session timeout (inactivity)
  if (now - session.lastActivity > SESSION_TIMEOUT) {
    adminSessions.delete(sessionId);
    return { isAuthenticated: false, error: 'Session timed out due to inactivity' };
  }
  
  // Optional: Check IP address consistency (can be disabled for mobile users)
  if (session.ipAddress && ipAddress && session.ipAddress !== ipAddress) {
    // Log security event but don't fail (IP can change legitimately)
    console.warn(`IP address changed for session ${sessionId}: ${session.ipAddress} -> ${ipAddress}`);
  }
  
  // Update last activity
  session.lastActivity = now;
  adminSessions.set(sessionId, session);
  
  return { isAuthenticated: true, sessionId };
}

/**
 * Check for brute force attacks and apply rate limiting
 */
function checkBruteForce(ipAddress: string): boolean {
  const attempts = failedAttempts.get(ipAddress);
  
  if (!attempts) return true; // No previous attempts
  
  const now = Date.now();
  
  // Reset attempts if lockout period has passed
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    failedAttempts.delete(ipAddress);
    return true;
  }
  
  // Check if max attempts exceeded
  return attempts.count < MAX_FAILED_ATTEMPTS;
}

/**
 * Record failed authentication attempt
 */
function recordFailedAttempt(ipAddress: string): void {
  const attempts = failedAttempts.get(ipAddress) || { count: 0, lastAttempt: 0 };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  failedAttempts.set(ipAddress, attempts);
}

/**
 * Clear failed attempts on successful authentication
 */
function clearFailedAttempts(ipAddress: string): void {
  failedAttempts.delete(ipAddress);
}

/**
 * Enhanced admin authentication with multiple validation methods
 */
export function validateAdminAuth(request: NextRequest): AdminAuthResult {
  try {
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Check for brute force attacks
    if (!checkBruteForce(ipAddress)) {
      return { 
        isAuthenticated: false, 
        error: 'Too many failed attempts. Please try again later.' 
      };
    }
    
    // Method 1: Check for session token (preferred for authenticated sessions)
    const sessionToken = request.headers.get('x-admin-session');
    if (sessionToken) {
      try {
        const decoded = Buffer.from(sessionToken, 'base64').toString();
        const [sessionId] = decoded.split(':');
        
        if (sessionId) {
          const result = validateAdminSession(sessionId, ipAddress);
          if (result.isAuthenticated) {
            clearFailedAttempts(ipAddress);
            return result;
          }
        }
      } catch (error) {
        // Invalid session token format
      }
    }
    
    // Method 2: Check Authorization header for initial authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      
      // Validate password-based token
      const expectedToken = Buffer.from(`admin:${ADMIN_PASSWORD}`).toString('base64');
      if (token === expectedToken) {
        clearFailedAttempts(ipAddress);
        return { isAuthenticated: true };
      }
    }
    
    // Method 3: Check query parameter (fallback, less secure)
    const url = new URL(request.url);
    const queryPassword = url.searchParams.get('admin_password');
    if (queryPassword === ADMIN_PASSWORD) {
      clearFailedAttempts(ipAddress);
      return { isAuthenticated: true };
    }
    
    // Method 4: Legacy token support (for backward compatibility)
    const adminToken = request.headers.get('x-admin-token');
    if (adminToken) {
      try {
        const decoded = Buffer.from(adminToken, 'base64').toString();
        const [prefix, timestamp] = decoded.split(':');
        
        if (prefix === 'admin' && timestamp) {
          const tokenTime = parseInt(timestamp);
          const now = Date.now();
          
          // Token is valid if it's less than token expiry time
          if (now - tokenTime < TOKEN_EXPIRY) {
            clearFailedAttempts(ipAddress);
            return { isAuthenticated: true };
          }
        }
      } catch (error) {
        // Invalid token format
      }
    }
    
    // Record failed attempt
    recordFailedAttempt(ipAddress);
    
    return { 
      isAuthenticated: false, 
      error: 'Admin authentication required' 
    };
  } catch (error) {
    return { 
      isAuthenticated: false, 
      error: 'Authentication validation failed' 
    };
  }
}

/**
 * Enhanced middleware wrapper with session management
 */
export function withAdminAuth<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    const auth = validateAdminAuth(request);
    
    if (!auth.isAuthenticated) {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized', 
          message: auth.error || 'Admin authentication required',
          code: 'AUTH_REQUIRED'
        }),
        { 
          status: 401,
          headers: { 
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Bearer realm="Admin Area"'
          }
        }
      );
    }
    
    return handler(request, ...args);
  };
}

/**
 * Create new admin session (for login)
 */
export function createAdminSession(password: string, ipAddress?: string, userAgent?: string): AdminAuthResult & { token?: string } {
  if (password !== ADMIN_PASSWORD) {
    if (ipAddress) recordFailedAttempt(ipAddress);
    return { isAuthenticated: false, error: 'Invalid password' };
  }
  
  if (ipAddress && !checkBruteForce(ipAddress)) {
    return { 
      isAuthenticated: false, 
      error: 'Too many failed attempts. Please try again later.' 
    };
  }
  
  const { token, sessionId } = generateAdminToken(ipAddress, userAgent);
  
  if (ipAddress) clearFailedAttempts(ipAddress);
  
  return { 
    isAuthenticated: true, 
    sessionId, 
    token 
  };
}

/**
 * Invalidate admin session (for logout)
 */
export function invalidateAdminSession(sessionId: string): boolean {
  const session = adminSessions.get(sessionId);
  if (session) {
    session.isValid = false;
    adminSessions.delete(sessionId);
    return true;
  }
  return false;
}

/**
 * Get active session info
 */
export function getSessionInfo(sessionId: string): AdminSession | null {
  return adminSessions.get(sessionId) || null;
}

/**
 * Clean up expired sessions (should be called periodically)
 */
export function cleanupExpiredSessions(): number {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [sessionId, session] of Array.from(adminSessions.entries())) {
    if (now - session.createdAt > TOKEN_EXPIRY || 
        now - session.lastActivity > SESSION_TIMEOUT) {
      adminSessions.delete(sessionId);
      cleaned++;
    }
  }
  
  return cleaned;
}

/**
 * Get security statistics
 */
export function getSecurityStats(): {
  activeSessions: number;
  failedAttempts: number;
  lockedIPs: number;
} {
  const now = Date.now();
  let lockedIPs = 0;
  
  for (const [ip, attempts] of Array.from(failedAttempts.entries())) {
    if (attempts.count >= MAX_FAILED_ATTEMPTS && 
        now - attempts.lastAttempt < LOCKOUT_DURATION) {
      lockedIPs++;
    }
  }
  
  return {
    activeSessions: adminSessions.size,
    failedAttempts: failedAttempts.size,
    lockedIPs
  };
}