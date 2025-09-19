import { NextRequest, NextResponse } from 'next/server';
import { books } from '@/lib/zoho/client';
import { applyRateLimit, getRateLimitConfig } from '@/lib/security/rate-limit';
import { withAdminAuth } from '@/lib/auth/admin-auth';
import { logger } from '@/library/logger';
import { withCorrelation } from '@/lib/helpers/withCorrelation';
import { withError } from '@/lib/helpers/withError';

// Define types for Zoho Books API responses
interface ZohoBooksInvoiceResponse {
  page_context?: {
    total?: number;
  };
  invoices?: any[];
}

export const GET = withAdminAuth(async (request: NextRequest) => {
  const { cid, responseWithCid } = withCorrelation(request);
  
  try {
    logger.info('books.invoices.get.start', { cid });
    
    // Apply rate limiting
    const { config } = getRateLimitConfig(request);
    const rateLimitResult = applyRateLimit(request, config);
    if (!rateLimitResult.allowed) {
      logger.warn('books.invoices.rate_limited', { cid });
      return responseWithCid(
        { error: 'Too many requests. Please try again later.' },
        429
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '20';
    const status = searchParams.get('status'); // draft, sent, paid, etc.
    const customerId = searchParams.get('customer_id');

    // Build query parameters
    const queryParams = new URLSearchParams({
      page,
      per_page: perPage,
    });

    if (status) queryParams.append('status', status);
    if (customerId) queryParams.append('customer_id', customerId);

    // Fetch invoices from Zoho Books
    const result = await withError(() => 
      books.request<ZohoBooksInvoiceResponse>(`invoices?${queryParams.toString()}`, { cid }),
      { cid, context: 'books.invoices.fetch' }
    );
    
    if (!result) {
      return responseWithCid(
        { error: 'Failed to fetch invoices from Zoho Books' },
        500
      );
    }

    logger.info('books.invoices.get.success', { 
      cid, 
      count: result?.invoices?.length || 0 
    });

    return responseWithCid({
      success: true,
      data: result,
      pagination: {
        page: parseInt(page),
        perPage: parseInt(perPage),
        total: result?.page_context?.total || 0
      }
    });

  } catch (error) {
    logger.error('books.invoices.get.failed', { 
      cid, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    
    return responseWithCid(
      { 
        error: 'Failed to fetch invoices from Zoho Books',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  const { cid, responseWithCid } = withCorrelation(request);
  
  try {
    logger.info('books.invoices.create.start', { cid });
    
    // Apply rate limiting
    const { config } = getRateLimitConfig(request);
    const rateLimitResult = applyRateLimit(request, config);
    if (!rateLimitResult.allowed) {
      logger.warn('books.invoices.rate_limited', { cid });
      return responseWithCid(
        { error: 'Too many requests. Please try again later.' },
        429
      );
    }

    const body = await request.json();

    // Create invoice in Zoho Books
    const result = await withError(() => 
      books.request<any>('invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cid
      }),
      { cid, context: 'books.invoices.create' }
    );
    
    if (!result) {
      return responseWithCid(
        { error: 'Failed to create invoice in Zoho Books' },
        500
      );
    }

    logger.info('books.invoices.create.success', { cid });

    return responseWithCid({
      success: true,
      message: 'Invoice created successfully',
      data: result
    });

  } catch (error) {
    logger.error('books.invoices.create.failed', { 
      cid, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    
    return responseWithCid(
      { 
        error: 'Failed to create invoice in Zoho Books',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
});

// Get specific invoice
export const PUT = withAdminAuth(async (request: NextRequest) => {
  const { cid, responseWithCid } = withCorrelation(request);
  
  try {
    logger.info('books.invoices.update.start', { cid });
    
    // Apply rate limiting
    const { config } = getRateLimitConfig(request);
    const rateLimitResult = applyRateLimit(request, config);
    if (!rateLimitResult.allowed) {
      logger.warn('books.invoices.rate_limited', { cid });
      return responseWithCid(
        { error: 'Too many requests. Please try again later.' },
        429
      );
    }

    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoice_id');

    if (!invoiceId) {
      logger.warn('books.invoices.update.missing_id', { cid });
      return responseWithCid(
        { error: 'Invoice ID is required' },
        400
      );
    }

    const body = await request.json();

    // Update invoice in Zoho Books
    const result = await withError(() => 
      books.request<any>(`invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cid
      }),
      { cid, context: 'books.invoices.update' }
    );
    
    if (!result) {
      return responseWithCid(
        { error: 'Failed to update invoice in Zoho Books' },
        500
      );
    }

    logger.info('books.invoices.update.success', { cid, invoiceId });

    return responseWithCid({
      success: true,
      message: 'Invoice updated successfully',
      data: result
    });

  } catch (error) {
    logger.error('books.invoices.update.failed', { 
      cid, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    
    return responseWithCid(
      { 
        error: 'Failed to update invoice in Zoho Books',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
});
// Ensure Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';