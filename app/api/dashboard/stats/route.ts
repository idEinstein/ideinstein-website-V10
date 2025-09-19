import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardStatsQuerySchema } from '@/lib/validations/api'
import { validateQueryParams } from '@/lib/middleware/validation'

// Mock zohoService for now since the original was just returning mock data
interface MockProject {
  id: string
  name: string
  status: string
  modified_date: string
}

interface MockInvoice {
  invoice_id: string
  invoice_number: string
  status: string
  created_time: string
  total: number
}

interface MockContact {
  id: string
  email: string
}

const zohoService = {
  findContactByEmail: async (email: string): Promise<MockContact | null> => null,
  getProjectsByOwner: async (contactId: string): Promise<MockProject[]> => [],
  getInvoices: async (contactId: string): Promise<MockInvoice[]> => []
}

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const queryValidation = DashboardStatsQuerySchema.safeParse(params);
    
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
    
    const { timeframe, includeDetails } = queryValidation.data;
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the contact in Zoho CRM
    const contact = await zohoService.findContactByEmail(session.user.email)
    
    if (!contact) {
      // Return default stats for new users
      return NextResponse.json({
        stats: {
          activeProjects: 0,
          totalSpent: 0,
          filesUploaded: 0,
          completedProjects: 0
        },
        recentActivity: []
      })
    }

    // Get projects and invoices in parallel
    const [projects, invoices] = await Promise.all([
      zohoService.getProjectsByOwner(contact.id).catch(() => []),
      zohoService.getInvoices(contact.id).catch(() => [])
    ])

    // Calculate stats
    const activeProjects = projects.filter(p => p.status !== 'completed').length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    const totalSpent = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0)

    // Mock file count for now - in reality this would come from WorkDrive
    const filesUploaded = projects.length * 2 // Rough estimate

    // Generate recent activity
    const recentActivity = [
      ...projects.slice(0, 2).map(project => ({
        id: `project-${project.id}`,
        type: 'project',
        message: `Project "${project.name}" status: ${project.status}`,
        timestamp: project.modified_date,
        color: project.status === 'completed' ? 'green' : 'blue'
      })),
      ...invoices.slice(0, 2).map(invoice => ({
        id: `invoice-${invoice.invoice_id}`,
        type: 'invoice',
        message: `Invoice ${invoice.invoice_number} - ${invoice.status}`,
        timestamp: invoice.created_time,
        color: invoice.status === 'paid' ? 'green' : 'yellow'
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 5)

    return NextResponse.json({
      stats: {
        activeProjects,
        totalSpent,
        filesUploaded,
        completedProjects
      },
      recentActivity
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    
    // Return fallback stats on error
    return NextResponse.json({
      stats: {
        activeProjects: 0,
        totalSpent: 0,
        filesUploaded: 0,
        completedProjects: 0
      },
      recentActivity: []
    })
  }
}
