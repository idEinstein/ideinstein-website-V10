// Simple Audit System - Production Ready
export interface AuditEvent {
  userId?: string
  action: string
  entity: string
  entityId?: string
  meta?: unknown
  ipAddress?: string
  userAgent?: string
  sessionId?: string
}

export class AuditLogger {
  static async log(event: AuditEvent): Promise<void> {
    // Simple console logging for now - database can be added later
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      userId: event.userId || 'anonymous',
      action: event.action,
      entity: event.entity,
      entityId: event.entityId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent
    }
    
    console.log('📝 AUDIT:', JSON.stringify(logEntry, null, 2))
  }
}