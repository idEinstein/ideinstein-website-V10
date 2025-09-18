// Simple Audit Service - Production Ready
import { AuditLogger, AuditEvent } from './audit'

export class AuditService {
  private static instance: AuditService

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService()
    }
    return AuditService.instance
  }

  async log(event: AuditEvent): Promise<void> {
    return AuditLogger.log(event)
  }

  // Specific audit methods for compatibility
  async logUserAction(userId: string, action: string, details?: unknown): Promise<void> {
    return this.log({
      userId,
      action,
      entity: 'user',
      meta: details
    })
  }

  async logInvoiceAccess(userId: string, invoiceId: string, action: string): Promise<void> {
    return this.log({
      userId,
      action,
      entity: 'invoice',
      entityId: invoiceId
    })
  }

  async logProjectAccess(userId: string, projectId: string, action: string): Promise<void> {
    return this.log({
      userId,
      action,
      entity: 'project',
      entityId: projectId
    })
  }

  async logSecurityEvent(event: string, userId: string, ipAddress?: string, meta?: unknown): Promise<void> {
    return this.log({
      userId,
      action: event,
      entity: 'security',
      ipAddress,
      meta
    })
  }
}

export const auditService = AuditService.getInstance()
export const auditLogger = auditService // Alias for compatibility