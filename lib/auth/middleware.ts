import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production';

export interface AuthUser {
  role: string;
  iat: number;
  exp: number;
}

export function verifyAdminToken(request: NextRequest): AuthUser | null {
  // This function is not used since we're not protecting admin routes in middleware
  // AdminAuth component handles all authentication
  return null;
}

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
}

export function requiresAdminAuth(pathname: string): boolean {
  // Most admin API routes don't need middleware protection since AdminAuth handles it
  // Only protect sensitive admin routes that need server-side validation
  const unprotectedEndpoints = [
    '/api/admin/diagnose',
    '/api/admin/validate',
    '/api/admin/verify-token'
  ];
  
  // For now, don't protect any admin API routes in middleware
  // Let AdminAuth component handle authentication
  return false;
}