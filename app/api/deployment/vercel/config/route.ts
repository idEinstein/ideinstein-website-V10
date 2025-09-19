import { NextRequest, NextResponse } from 'next/server';
import { 
  generateCompleteVercelConfig, 
  validateVercelConfig,
  VercelProjectConfig 
} from '@/lib/deployment/vercel-config';
import { withAdminAuth } from '@/lib/auth/admin-auth';

export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const projectName = searchParams.get('projectName') || 'ideinstein-website';
    const domains = searchParams.get('domains')?.split(',').filter(Boolean) || [];
    const format = searchParams.get('format') || 'complete';

    const config = generateCompleteVercelConfig(projectName, domains);
    const validation = validateVercelConfig(config.project);

    switch (format) {
      case 'vercel-json':
        return NextResponse.json(config.vercelJson);
      
      case 'package-json':
        return NextResponse.json(config.packageJson);
      
      case 'env-files':
        return NextResponse.json(config.environmentFiles);
      
      case 'project':
        return NextResponse.json(config.project);
      
      case 'validation':
        return NextResponse.json(validation);
      
      default:
        return NextResponse.json({
          config,
          validation,
          metadata: {
            generatedAt: new Date().toISOString(),
            projectName,
            domains,
            environmentVariableCount: config.project.environmentVariables.length
          }
        });
    }
  } catch (error) {
    console.error('Vercel config generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate Vercel configuration',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { projectName, domains, customConfig } = body;

    if (!projectName) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Generate base configuration
    let config = generateCompleteVercelConfig(projectName, domains || []);

    // Apply custom configuration if provided
    if (customConfig) {
      config = {
        ...config,
        project: { ...config.project, ...customConfig },
        vercelJson: { ...config.vercelJson, ...customConfig.vercelJson }
      };
    }

    // Validate configuration
    const validation = validateVercelConfig(config.project);

    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Invalid configuration',
          validation
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      config,
      validation,
      metadata: {
        generatedAt: new Date().toISOString(),
        projectName,
        domains: domains || [],
        environmentVariableCount: config.project.environmentVariables.length
      }
    });

  } catch (error) {
    console.error('Vercel config creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create Vercel configuration',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});
// Ensure Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';