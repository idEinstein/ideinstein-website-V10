import { NextRequest, NextResponse } from 'next/server';
import { projects } from '@/lib/zoho/client';
import { applyRateLimit, getRateLimitConfig } from '@/lib/security/rate-limit';
import { withAdminAuth } from '@/lib/auth/admin-auth';
import { logger } from '@/library/logger';
import { withCorrelation } from '@/lib/helpers/withCorrelation';
import { withError } from '@/lib/helpers/withError';

// Define types for Zoho Projects API responses
interface ZohoProjectsResponse {
  projects?: any[];
}

export const GET = withAdminAuth(async (request: NextRequest) => {
  const { cid, responseWithCid } = withCorrelation(request);
  
  try {
    logger.info('projects.list.get.start', { cid });
    
    // Apply rate limiting
    const { config } = getRateLimitConfig(request);
    const rateLimitResult = applyRateLimit(request, config);
    if (!rateLimitResult.allowed) {
      logger.warn('projects.list.rate_limited', { cid });
      return responseWithCid(
        { error: 'Too many requests. Please try again later.' },
        429
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '20';
    const status = searchParams.get('status'); // active, archived, template
    const sortBy = searchParams.get('sort_by') || 'created_time';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // Build query parameters
    const queryParams = new URLSearchParams({
      index: ((parseInt(page) - 1) * parseInt(perPage)).toString(),
      range: perPage,
      sort_column: sortBy,
      sort_order: sortOrder
    });

    if (status) queryParams.append('status', status);

    // Fetch projects from Zoho Projects
    const result = await withError(() => 
      projects.request<ZohoProjectsResponse>(`projects/?${queryParams.toString()}`, { cid }),
      { cid, context: 'projects.list.fetch' }
    );
    
    if (!result) {
      return responseWithCid(
        { error: 'Failed to fetch projects from Zoho Projects' },
        500
      );
    }

    logger.info('projects.list.get.success', { 
      cid, 
      count: result?.projects?.length || 0 
    });

    return responseWithCid({
      success: true,
      data: result,
      pagination: {
        page: parseInt(page),
        perPage: parseInt(perPage),
        total: result?.projects?.length || 0
      }
    });

  } catch (error) {
    logger.error('projects.list.get.failed', { 
      cid, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    
    return responseWithCid(
      { 
        error: 'Failed to fetch projects from Zoho Projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  const { cid, responseWithCid } = withCorrelation(request);
  
  try {
    logger.info('projects.list.create.start', { cid });
    
    // Apply rate limiting
    const { config } = getRateLimitConfig(request);
    const rateLimitResult = applyRateLimit(request, config);
    if (!rateLimitResult.allowed) {
      logger.warn('projects.list.rate_limited', { cid });
      return responseWithCid(
        { error: 'Too many requests. Please try again later.' },
        429
      );
    }

    const body = await request.json();

    // Create project in Zoho Projects
    const result = await withError(() => 
      projects.request<any>('projects/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cid
      }),
      { cid, context: 'projects.list.create' }
    );
    
    if (!result) {
      return responseWithCid(
        { error: 'Failed to create project in Zoho Projects' },
        500
      );
    }

    logger.info('projects.list.create.success', { cid });

    return responseWithCid({
      success: true,
      message: 'Project created successfully',
      data: result
    });

  } catch (error) {
    logger.error('projects.list.create.failed', { 
      cid, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    
    return responseWithCid(
      { 
        error: 'Failed to create project in Zoho Projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
});

// Get project details
export const PUT = withAdminAuth(async (request: NextRequest) => {
  const { cid, responseWithCid } = withCorrelation(request);
  
  try {
    logger.info('projects.list.update.start', { cid });
    
    // Apply rate limiting
    const { config } = getRateLimitConfig(request);
    const rateLimitResult = applyRateLimit(request, config);
    if (!rateLimitResult.allowed) {
      logger.warn('projects.list.rate_limited', { cid });
      return responseWithCid(
        { error: 'Too many requests. Please try again later.' },
        429
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    if (!projectId) {
      logger.warn('projects.list.update.missing_id', { cid });
      return responseWithCid(
        { error: 'Project ID is required' },
        400
      );
    }

    const body = await request.json();

    // Update project in Zoho Projects
    const result = await withError(() => 
      projects.request<any>(`projects/${projectId}/`, {
        method: 'POST', // Zoho Projects uses POST for updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cid
      }),
      { cid, context: 'projects.list.update' }
    );
    
    if (!result) {
      return responseWithCid(
        { error: 'Failed to update project in Zoho Projects' },
        500
      );
    }

    logger.info('projects.list.update.success', { cid, projectId });

    return responseWithCid({
      success: true,
      message: 'Project updated successfully',
      data: result
    });

  } catch (error) {
    logger.error('projects.list.update.failed', { 
      cid, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    
    return responseWithCid(
      { 
        error: 'Failed to update project in Zoho Projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
});
