import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({
        isAuthenticated: false,
        message: 'No token found'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.role !== 'admin') {
      return NextResponse.json({
        isAuthenticated: false,
        message: 'Invalid role'
      });
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: { role: 'admin' }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({
      isAuthenticated: false,
      message: 'Invalid token'
    });
  }
}