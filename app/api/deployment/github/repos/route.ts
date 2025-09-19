import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/admin-auth';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  html_url: string;
}

interface GitHubWebhook {
  id: number;
  name: string;
  config: {
    url: string;
    content_type: string;
    secret?: string;
  };
  events: string[];
  active: boolean;
}

// GET - List repositories or webhooks
export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const repository = searchParams.get('repository');
    
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token is required' },
        { status: 400 }
      );
    }

    if (repository) {
      // Get webhooks for repository
      const webhooksResponse = await fetch(
        `https://api.github.com/repos/${repository}/hooks`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'IdEinstein-Deployment-Manager'
          }
        }
      );

      if (!webhooksResponse.ok) {
        throw new Error(`GitHub API error: ${webhooksResponse.status}`);
      }

      const webhooks: GitHubWebhook[] = await webhooksResponse.json();
      
      return NextResponse.json({
        success: true,
        webhooks,
        repository,
        timestamp: new Date().toISOString()
      });
    } else {
      // Get user repositories
      const reposResponse = await fetch(
        'https://api.github.com/user/repos?type=all&sort=updated&per_page=100',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'IdEinstein-Deployment-Manager'
          }
        }
      );

      if (!reposResponse.ok) {
        throw new Error(`GitHub API error: ${reposResponse.status}`);
      }

      const repositories: GitHubRepo[] = await reposResponse.json();
      
      return NextResponse.json({
        success: true,
        repositories: repositories.map(repo => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          private: repo.private,
          default_branch: repo.default_branch,
          html_url: repo.html_url
        })),
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch GitHub data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});

// POST - Create webhook
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { 
      action,
      githubToken,
      repository,
      webhookUrl,
      events = ['push', 'pull_request'],
      secret
    } = body;

    if (!githubToken || !repository) {
      return NextResponse.json(
        { error: 'GitHub token and repository are required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create':
        if (!webhookUrl) {
          return NextResponse.json(
            { error: 'Webhook URL is required' },
            { status: 400 }
          );
        }

        const createResponse = await fetch(
          `https://api.github.com/repos/${repository}/hooks`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
              'User-Agent': 'IdEinstein-Deployment-Manager'
            },
            body: JSON.stringify({
              name: 'web',
              active: true,
              events,
              config: {
                url: webhookUrl,
                content_type: 'json',
                secret: secret || undefined
              }
            })
          }
        );

        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(`GitHub webhook creation failed: ${errorData.message || createResponse.status}`);
        }

        const webhook = await createResponse.json();
        
        return NextResponse.json({
          success: true,
          action: 'create',
          webhook: {
            id: webhook.id,
            name: webhook.name,
            config: webhook.config,
            events: webhook.events,
            active: webhook.active
          },
          timestamp: new Date().toISOString()
        });

      case 'delete':
        const { webhookId } = body;
        if (!webhookId) {
          return NextResponse.json(
            { error: 'Webhook ID is required for deletion' },
            { status: 400 }
          );
        }

        const deleteResponse = await fetch(
          `https://api.github.com/repos/${repository}/hooks/${webhookId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'IdEinstein-Deployment-Manager'
            }
          }
        );

        if (!deleteResponse.ok && deleteResponse.status !== 404) {
          throw new Error(`GitHub webhook deletion failed: ${deleteResponse.status}`);
        }

        return NextResponse.json({
          success: true,
          action: 'delete',
          webhookId,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('GitHub webhook operation error:', error);
    return NextResponse.json(
      { 
        error: 'GitHub webhook operation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});
// Ensure Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';