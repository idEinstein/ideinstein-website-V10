import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cacheService } from '@/lib/cache-service'
import { auditLogger } from '@/lib/audit-service'
import { z } from 'zod'
import { InvoiceQuerySchema } from '@/lib/validations/api'
import { validateQueryParams } from '@/lib/middleware/validation'

export async function GET(request: NextRequest) {
  console.log('🔍 Billing/Invoices API - GET called')
  
  try {
    // Validate query parameters
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const queryValidation = InvoiceQuerySchema.safeParse(params);
    
    if (!queryValidation.success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid query parameters',
          details: queryValidation.error.flatten()
        },
        { status: 400 }
      );
    }
    
    const { status, limit, page, dateFrom, dateTo, includeDetails } = queryValidation.data;
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, use email as account ID (can be enhanced with proper account mapping)
    const accountId = session.user.email
    
    // Get invoices using cache service
    const invoices = await cacheService.getInvoices(accountId)
    
    // Calculate summary statistics
    const totalPaid = invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + (invoice.total || 0), 0)
    
    const outstandingBalance = invoices
      .filter(invoice => invoice.status !== 'paid')
      .reduce((sum, invoice) => sum + (invoice.balance || 0), 0)
    
    const paidInvoicesCount = invoices.filter(invoice => invoice.status === 'paid').length

    // Log audit event
    await auditLogger.logInvoiceAccess(
      session.user.id || session.user.email,
      'all',
      'list_invoices'
    )
    
    console.log('✅ Invoices retrieved:', {
      count: invoices?.length || 0,
      totalPaid,
      outstandingBalance,
      cached: true
    })

    return NextResponse.json({ 
      success: true,
      invoices: invoices || [],
      summary: {
        totalPaid,
        outstandingBalance,
        paidInvoicesCount
      },
      cached: true,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Billing/Invoices API error:', error)
    
    // Log security event for errors
    const session = await getServerSession(authOptions)
    if (session?.user) {
      try {
        await auditLogger.logSecurityEvent(
          'api_error',
          session.user.id || session.user.email,
          request.headers.get('x-forwarded-for') || 'unknown',
          { error: (error as Error).message, endpoint: '/api/billing/invoices' }
        )
      } catch (auditError) {
        console.error('Failed to log audit event:', auditError)
      }
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Prevent this route from being statically analyzed during build
export const dynamic = 'force-dynamic'