import { NextRequest, NextResponse } from 'next/server';
import { validateEnvironment, ENV_SCHEMA } from '@/lib/config/env-validator';
import { withAdminAuth } from '@/lib/auth/admin-auth';

export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const targetEnv = searchParams.get('env') || process.env.NODE_ENV || 'development';
    const includeValues = searchParams.get('includeValues') === 'true';
    const onlyErrors = searchParams.get('onlyErrors') === 'true';

    // Validate environment
    const result = validateEnvironment(process.env, targetEnv);

    // Prepare response data
    const responseData: any = {
      environment: targetEnv,
      isValid: result.isValid,
      timestamp: new Date().toISOString(),
      summary: {
        totalErrors: result.errors.length,
        totalWarnings: result.warnings.length,
        missingRequired: result.missing.length,
        suggestions: result.suggestions.length
      }
    };

    if (!onlyErrors || result.errors.length > 0) {
      responseData.errors = result.errors;
    }

    if (!onlyErrors || result.warnings.length > 0) {
      responseData.warnings = result.warnings;
    }

    if (!onlyErrors) {
      responseData.missing = result.missing;
      responseData.suggestions = result.suggestions;
    }

    // Include current environment values (masked for sensitive vars)
    if (includeValues) {
      responseData.currentValues = {};
      ENV_SCHEMA.forEach(envVar => {
        const value = process.env[envVar.key];
        if (value) {
          responseData.currentValues[envVar.key] = envVar.sensitive 
            ? '***MASKED***' 
            : value;
        }
      });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Environment validation API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to validate environment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { environment, variables } = body;

    if (!environment || !variables) {
      return NextResponse.json(
        { error: 'Missing required fields: environment, variables' },
        { status: 400 }
      );
    }

    // Validate provided environment variables
    const result = validateEnvironment(variables, environment);

    return NextResponse.json({
      environment,
      isValid: result.isValid,
      timestamp: new Date().toISOString(),
      errors: result.errors,
      warnings: result.warnings,
      missing: result.missing,
      suggestions: result.suggestions,
      summary: {
        totalErrors: result.errors.length,
        totalWarnings: result.warnings.length,
        missingRequired: result.missing.length,
        suggestions: result.suggestions.length
      }
    });
  } catch (error) {
    console.error('Environment validation POST error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to validate provided environment variables',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});