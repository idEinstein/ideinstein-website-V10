import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/admin-auth';

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

// GET - List webhooks for a repository
export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const repository = searchParams.get('repository');
    
    if (!token || !repository) {
      return NextResponse.json(
        { error: 'GitHub token and repository are required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.github.com/repos/${repository}/hooks`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'IdEinstein-Deployment-Manager'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const webhooks: GitHubWebhook[] = await response.json();
    
    return NextResponse.json({
      success: true,
      webhooks: webhooks.map(webhook => ({
        id: webhook.id,
        name: webhook.name,
        config: {
          url: webhook.config.url,
          content_type: webhook.config.content_type,
          // Don't expose the actual secret
          secret: webhook.config.secret ? '***SECRET***' : undefined
        },
        events: webhook.events,
        active: webhook.active
      })),
      repository,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GitHub webhooks fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch GitHub webhooks',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});

// POST - Create, update, or delete webhook
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { 
      action,
      githubToken,
      repository,
      webhookUrl,
      events = ['push', 'pull_request'],
      secret,
      webhookId
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
            { error: 'Webhook URL is required for creation' },
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
                secret: secret || crypto.randomUUID()
              }
            })
          }
        );

        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(`Webhook creation failed: ${errorData.message || createResponse.status}`);
        }

        const webhook = await createResponse.json();
        
        return NextResponse.json({
          success: true,
          action: 'create',
          webhook: {
            id: webhook.id,
            name: webhook.name,
            config: {
              url: webhook.config.url,
              content_type: webhook.config.content_type,
              secret: '***SECRET***'
            },
            events: webhook.events,
            active: webhook.active
          },
          timestamp: new Date().toISOString()
        });

      case 'delete':
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
          throw new Error(`Webhook deletion failed: ${deleteResponse.status}`);
        }

        return NextResponse.json({
          success: true,
          action: 'delete',
          webhookId,
          timestamp: new Date().toISOString()
        });

      case 'update':
        if (!webhookId) {
          return NextResponse.json(
            { error: 'Webhook ID is required for update' },
            { status: 400 }
          );
        }

        const updateResponse = await fetch(
          `https://api.github.com/repos/${repository}/hooks/${webhookId}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
              'User-Agent': 'IdEinstein-Deployment-Manager'
            },
            body: JSON.stringify({
              active: true,
              events,
              config: {
                url: webhookUrl,
                content_type: 'json',
                secret: secret
              }
            })
          }
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(`Webhook update failed: ${errorData.message || updateResponse.status}`);
        }

        const updatedWebhook = await updateResponse.json();
        
        return NextResponse.json({
          success: true,
          action: 'update',
          webhook: {
            id: updatedWebhook.id,
            name: updatedWebhook.name,
            config: {
              url: updatedWebhook.config.url,
              content_type: updatedWebhook.config.content_type,
              secret: '***SECRET***'
            },
            events: updatedWebhook.events,
            active: updatedWebhook.active
          },
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