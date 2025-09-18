import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface GitHubWebhookPayload {
  action?: string;
  repository: {
    name: string;
    full_name: string;
    html_url: string;
  };
  sender: {
    login: string;
    html_url: string;
  };
  ref?: string;
  commits?: Array<{
    id: string;
    message: string;
    author: {
      name: string;
      email: string;
    };
  }>;
  pull_request?: {
    number: number;
    title: string;
    html_url: string;
    state: string;
  };
}

function verifyGitHubSignature(payload: string, signature: string, secret: string): boolean {
  if (!secret || !signature) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  const actualSignature = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(actualSignature, 'hex')
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const payload: GitHubWebhookPayload = JSON.parse(body);
    
    // Get headers
    const signature = request.headers.get('x-hub-signature-256');
    const event = request.headers.get('x-github-event');
    const deliveryId = request.headers.get('x-github-delivery');
    
    // Verify webhook signature
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const isValid = verifyGitHubSignature(body, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid GitHub webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }
    
    console.log(`GitHub webhook received: ${event} from ${payload.repository.full_name}`);
    
    // Handle different events
    switch (event) {
      case 'push':
        await handlePushEvent(payload);
        break;
        
      case 'pull_request':
        await handlePullRequestEvent(payload);
        break;
        
      case 'deployment_status':
        await handleDeploymentStatusEvent(payload);
        break;
        
      default:
        console.log(`Unhandled GitHub event: ${event}`);
    }
    
    return NextResponse.json({ 
      success: true,
      event,
      repository: payload.repository.full_name,
      deliveryId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('GitHub webhook processing error:', error);
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function handlePushEvent(payload: GitHubWebhookPayload) {
  console.log(`Push event: ${payload.commits?.length || 0} commits to ${payload.repository.full_name}`);
  
  // Here you could:
  // 1. Trigger a Vercel deployment
  // 2. Run CI/CD pipeline
  // 3. Send notifications
  // 4. Update deployment status
  
  if (payload.ref === 'refs/heads/main' || payload.ref === 'refs/heads/master') {
    console.log('Push to main branch detected - could trigger production deployment');
    
    // Example: Trigger Vercel deployment
    if (process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID) {
      try {
        const deployResponse = await fetch('https://api.vercel.com/v13/deployments', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'ideinstein-website',
            gitSource: {
              type: 'github',
              repo: payload.repository.full_name,
              ref: payload.ref
            },
            target: 'production'
          })
        });
        
        if (deployResponse.ok) {
          const deployment = await deployResponse.json();
          console.log('Vercel deployment triggered:', deployment.url);
        }
      } catch (error) {
        console.error('Failed to trigger Vercel deployment:', error);
      }
    }
  }
}

async function handlePullRequestEvent(payload: GitHubWebhookPayload) {
  console.log(`Pull request ${payload.action}: #${payload.pull_request?.number} - ${payload.pull_request?.title}`);
  
  if (payload.action === 'opened' || payload.action === 'synchronize') {
    console.log('PR opened/updated - could trigger preview deployment');
    
    // Here you could trigger a preview deployment
  }
}

async function handleDeploymentStatusEvent(payload: any) {
  console.log(`Deployment status: ${payload.deployment_status?.state} for ${payload.repository.full_name}`);
  
  // Here you could:
  // 1. Update internal deployment tracking
  // 2. Send notifications about deployment status
  // 3. Trigger post-deployment actions
}

// Handle GET requests (for webhook URL verification)
export async function GET() {
  return NextResponse.json({
    message: 'GitHub webhook endpoint is active',
    timestamp: new Date().toISOString(),
    service: 'IdEinstein Deployment Manager'
  });
}