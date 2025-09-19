import { NextRequest, NextResponse } from "next/server";
import { zohoAccessToken } from "@/lib/zoho/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get('service') || 'crm';
  
  // Only allow in development or with admin auth
  if (process.env.NODE_ENV === 'production') {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  
  try {
    console.log(`🔍 Testing ${service} token refresh...`);
    
    // Check environment variables
    const envVars = {
      ZOHO_DC: process.env.ZOHO_DC,
      ZOHO_CLIENT_ID: process.env.ZOHO_CLIENT_ID ? 'SET' : 'MISSING',
      ZOHO_CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET ? 'SET' : 'MISSING',
      [`ZOHO_${service.toUpperCase()}_REFRESH_TOKEN`]: process.env[`ZOHO_${service.toUpperCase()}_REFRESH_TOKEN`] ? 'SET' : 'MISSING'
    };
    
    console.log('📋 Environment variables:', envVars);
    
    // Test token refresh
    const startTime = Date.now();
    const token = await zohoAccessToken(service as any);
    const duration = Date.now() - startTime;
    
    console.log(`✅ Token obtained successfully in ${duration}ms`);
    
    return NextResponse.json({
      success: true,
      service,
      tokenObtained: true,
      duration,
      tokenPreview: token.substring(0, 20) + '...',
      environment: envVars,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error(`❌ Token refresh failed:`, error);
    
    return NextResponse.json({
      success: false,
      service,
      error: error.message,
      stack: error.stack,
      environment: {
        ZOHO_DC: process.env.ZOHO_DC,
        ZOHO_CLIENT_ID: process.env.ZOHO_CLIENT_ID ? 'SET' : 'MISSING',
        ZOHO_CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET ? 'SET' : 'MISSING',
        [`ZOHO_${service.toUpperCase()}_REFRESH_TOKEN`]: process.env[`ZOHO_${service.toUpperCase()}_REFRESH_TOKEN`] ? 'SET' : 'MISSING'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';