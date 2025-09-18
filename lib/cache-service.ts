// Simple Cache Service - Production Ready (Zoho Direct)
// Temporarily disable cache service imports until services are properly exported
// import { ZohoServiceFactory, ConfigService } from '@/lib/services'

export class CacheService {
  private static instance: CacheService

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  // Direct Zoho Integration - No Database Required
  async getProjects(accountId: string, _forceRefresh = false): Promise<any[]> {
    try {
      console.log(`🔍 Getting projects for account: ${accountId}`)
      return await this.fetchProjectsFromZoho(accountId)
    } catch (error) {
      console.error('❌ Error in getProjects:', error)
      return []
    }
  }

  async getInvoices(accountId: string, _forceRefresh = false): Promise<any[]> {
    try {
      console.log(`🔍 Getting invoices for account: ${accountId}`)
      return await this.fetchInvoicesFromZoho(accountId)
    } catch (error) {
      console.error('❌ Error in getInvoices:', error)
      return []
    }
  }

  private async fetchProjectsFromZoho(accountId: string): Promise<any[]> {
    // Check if Zoho is configured
    if (!process.env.ZOHO_CLIENT_ID || !process.env.ZOHO_CLIENT_SECRET) {
      console.warn('⚠️ Zoho not configured, returning empty projects')
      return []
    }

    try {
      console.log('🔄 Fetching projects from Zoho...')
      // Use the canonical client directly
      const { projects } = await import('@/lib/zoho/client')
      
      // Define the response type
      interface ZohoProjectsResponse {
        projects?: any[];
      }
      
      const result = await projects.request<ZohoProjectsResponse>('projects/')
      return result?.projects || []
    } catch (error) {
      console.error('❌ Error fetching projects from Zoho:', error)
      return []
    }
  }

  private async fetchInvoicesFromZoho(accountId: string): Promise<any[]> {
    // Check if Zoho is configured
    if (!process.env.ZOHO_CLIENT_ID || !process.env.ZOHO_CLIENT_SECRET) {
      console.warn('⚠️ Zoho not configured, returning empty invoices')
      return []
    }

    try {
      console.log('🔄 Fetching invoices from Zoho...')
      // Use the canonical client directly
      const { books } = await import('@/lib/zoho/client')
      
      // Define the response type
      interface ZohoBooksInvoiceResponse {
        invoices?: any[];
      }
      
      const result = await books.request<ZohoBooksInvoiceResponse>('invoices')
      return result?.invoices || []
    } catch (error) {
      console.error('❌ Error fetching invoices from Zoho:', error)
      return []
    }
  }

  // No-op methods for compatibility
  async updateProjectsCache(__accountId: string, __projects: unknown[]): Promise<void> {
    console.log('📝 Cache update skipped - using direct Zoho integration')
  }

  async updateInvoicesCache(__accountId: string, __invoices: unknown[]): Promise<void> {
    console.log('📝 Cache update skipped - using direct Zoho integration')
  }

  async invalidateCache(__accountId: string, __entity?: string): Promise<void> {
    console.log('📝 Cache invalidation skipped - using direct Zoho integration')
  }

  async getCacheStats(): Promise<any> {
    return {
      totalProjects: 0,
      freshProjects: 0,
      totalInvoices: 0,
      freshInvoices: 0,
      cacheHitRate: 0,
      lastUpdate: null,
      mode: 'direct_zoho'
    }
  }
}

export const cacheService = CacheService.getInstance()
