import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check environment variables
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const nodeEnv = process.env.NODE_ENV;
    
    // Environment check
    const environmentCheck = {
      hasPasswordHash: !!adminPasswordHash,
      hasPlainPassword: !!adminPassword,
      hashFormat: adminPasswordHash ? 
        (adminPasswordHash.startsWith('$2') && adminPasswordHash.length === 60 ? 'valid' : 'invalid') : 'missing',
      nodeEnv: nodeEnv || 'unknown',
      hashLength: adminPasswordHash?.length || 0,
      hashPrefix: adminPasswordHash?.substring(0, 10) || 'none',
      hashSuffix: adminPasswordHash?.substring(-10) || 'none'
    };
    
    // Runtime check
    let bcryptAvailable = false;
    let bcryptError = null;
    try {
      // Test bcrypt functionality
      const testHash = await bcrypt.hash('test', 12);
      const testCompare = await bcrypt.compare('test', testHash);
      bcryptAvailable = testCompare === true;
    } catch (error) {
      bcryptError = error instanceof Error ? error.message : 'Unknown bcrypt error';
    }
    
    const runtimeCheck = {
      bcryptAvailable,
      bcryptError,
      runtimeType: 'nodejs', // This endpoint forces Node.js runtime
      responseTime: Date.now() - startTime
    };
    
    // Authentication test (if hash is available)
    let authTest = null;
    if (adminPasswordHash && bcryptAvailable) {
      try {
        // Test with a dummy password to verify hash format
        const dummyTest = await bcrypt.compare('dummy', adminPasswordHash);
        authTest = {
          hashTestable: true,
          hashFormatValid: true
        };
      } catch (error) {
        authTest = {
          hashTestable: false,
          hashFormatValid: false,
          error: error instanceof Error ? error.message : 'Hash format error'
        };
      }
    }
    
    // Compile diagnostic result
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environmentCheck,
      runtimeCheck,
      authTest,
      recommendations: [] as string[]
    };
    
    // Generate recommendations based on findings
    if (!environmentCheck.hasPasswordHash) {
      diagnostics.recommendations.push('Set ADMIN_PASSWORD_HASH environment variable');
    }
    
    if (environmentCheck.hashFormat === 'invalid') {
      diagnostics.recommendations.push('Regenerate ADMIN_PASSWORD_HASH using bcrypt with proper format');
    }
    
    if (!runtimeCheck.bcryptAvailable) {
      diagnostics.recommendations.push('Fix bcrypt compatibility - ensure Node.js runtime is used');
    }
    
    if (authTest && !authTest.hashTestable) {
      diagnostics.recommendations.push('Hash format is invalid - regenerate using scripts/generate-admin-hash.js');
    }
    
    if (diagnostics.recommendations.length === 0) {
      diagnostics.recommendations.push('Environment appears configured correctly - check browser cache');
    }
    
    return NextResponse.json({
      success: true,
      diagnostics,
      message: 'Diagnostic completed successfully'
    });
    
  } catch (error) {
    console.error('Diagnostic endpoint error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Diagnostic failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      recommendations: [
        'Check server logs for detailed error information',
        'Verify environment variables are properly set',
        'Ensure bcrypt package is installed and compatible'
      ]
    }, { status: 500 });
  }
}

// Force Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';