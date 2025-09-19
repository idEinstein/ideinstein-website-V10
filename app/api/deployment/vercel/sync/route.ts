import { NextRequest, NextResponse } from 'next/server';
import { VercelApiClient, syncEnvironmentVariables, setupVercelProject } from '@/lib/deployment/vercel-api';
import { generateCompleteVercelConfig } from '@/lib/deployment/vercel-config';
import { withAdminAuth } from '@/lib/auth/admin-auth';

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { 
      action, 
      vercelToken, 
      teamId, 
      projectId, 
      projectName, 
      gitRepository, 
      domains,
      environmentVariables 
    } = body;

    if (!vercelToken) {
      return NextResponse.json(
        { error: 'Vercel token is required' },
        { status: 400 }
      );
    }

    const client = new VercelApiClient({ token: vercelToken, teamId });

    switch (action) {
      case 'sync-env':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required for environment sync' },
            { status: 400 }
          );
        }

        const envVarsToSync = environmentVariables || [];
        const syncResult = await syncEnvironmentVariables(client, projectId, envVarsToSync);

        return NextResponse.json({
          success: true,
          action: 'sync-env',
          result: syncResult,
          timestamp: new Date().toISOString()
        });

      case 'setup-project':
        if (!projectName) {
          return NextResponse.json(
            { error: 'Project name is required for project setup' },
            { status: 400 }
          );
        }

        // Generate default configuration
        const config = generateCompleteVercelConfig(projectName, domains || []);
        
        const setupResult = await setupVercelProject(client, {
          name: projectName,
          gitRepository,
          domains,
          environmentVariables: environmentVariables || config.project.environmentVariables,
          framework: 'nextjs',
          buildCommand: 'npm run vercel-build',
          outputDirectory: '.next',
          installCommand: 'npm ci',
          devCommand: 'npm run dev'
        });

        return NextResponse.json({
          success: true,
          action: 'setup-project',
          result: setupResult,
          timestamp: new Date().toISOString()
        });

      case 'get-projects':
        const projects = await client.getProjects();
        return NextResponse.json({
          success: true,
          action: 'get-projects',
          result: projects,
          timestamp: new Date().toISOString()
        });

      case 'get-project':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }

        const project = await client.getProject(projectId);
        const envVars = await client.getEnvironmentVariables(projectId);
        const deployments = await client.getDeployments(projectId, 10);

        return NextResponse.json({
          success: true,
          action: 'get-project',
          result: {
            project,
            environmentVariables: envVars,
            deployments
          },
          timestamp: new Date().toISOString()
        });

      case 'get-deployments':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }

        const deploymentsResult = await client.getDeployments(projectId, 20);
        return NextResponse.json({
          success: true,
          action: 'get-deployments',
          result: deploymentsResult,
          timestamp: new Date().toISOString()
        });

      case 'verify-token':
        try {
          const user = await client.getUser();
          return NextResponse.json({
            success: true,
            action: 'verify-token',
            result: {
              valid: true,
              user: user.user
            },
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          return NextResponse.json({
            success: false,
            action: 'verify-token',
            result: {
              valid: false,
              error: error instanceof Error ? error.message : 'Invalid token'
            },
            timestamp: new Date().toISOString()
          });
        }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Vercel sync error:', error);
    return NextResponse.json(
      { 
        error: 'Vercel operation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});

export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const vercelToken = searchParams.get('token');
    const teamId = searchParams.get('teamId');
    const projectId = searchParams.get('projectId');

    if (!vercelToken) {
      return NextResponse.json(
        { error: 'Vercel token is required' },
        { status: 400 }
      );
    }

    const client = new VercelApiClient({ token: vercelToken, teamId: teamId || undefined });

    if (projectId) {
      // Get specific project details
      const project = await client.getProject(projectId);
      const envVars = await client.getEnvironmentVariables(projectId);
      const deployments = await client.getDeployments(projectId, 5);
      const domains = await client.getDomains(projectId);

      return NextResponse.json({
        project,
        environmentVariables: envVars,
        deployments,
        domains,
        timestamp: new Date().toISOString()
      });
    } else {
      // Get all projects
      const projects = await client.getProjects();
      const user = await client.getUser();

      return NextResponse.json({
        projects,
        user,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Vercel API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Vercel data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});
// Ensure Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';