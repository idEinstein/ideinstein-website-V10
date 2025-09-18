// Role-Based Access Control (RBAC) System
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AuditLogger } from '@/lib/audit'

export enum Permission {
  // Project Permissions
  READ_OWN_PROJECTS = 'read:own-projects',
  READ_ACCOUNT_PROJECTS = 'read:account-projects',
  READ_ALL_PROJECTS = 'read:all-projects',
  UPDATE_PROJECT_STATUS = 'update:project-status',
  CREATE_PROJECTS = 'create:projects',
  
  // Invoice Permissions
  READ_OWN_INVOICES = 'read:own-invoices',
  READ_ACCOUNT_INVOICES = 'read:account-invoices',
  READ_ALL_INVOICES = 'read:all-invoices',
  CREATE_INVOICES = 'create:invoices',
  
  // File Permissions
  UPLOAD_PROJECT_FILES = 'upload:project-files',
  DOWNLOAD_PROJECT_FILES = 'download:project-files',
  ACCESS_TECHNICAL_DATA = 'access:technical-data',
  MANAGE_FILE_PERMISSIONS = 'manage:file-permissions',
  
  // User Management
  MANAGE_ACCOUNT_USERS = 'manage:account-users',
  MANAGE_ALL_USERS = 'manage:all-users',
  
  // Analytics & Reporting
  VIEW_ACCOUNT_ANALYTICS = 'view:account-analytics',
  VIEW_ALL_ANALYTICS = 'view:all-analytics',
  EXPORT_DATA = 'export:data',
  
  // System Administration
  MANAGE_SYSTEM = 'manage:system',
  VIEW_AUDIT_LOGS = 'view:audit-logs',
  MANAGE_INTEGRATIONS = 'manage:integrations'
}

export enum UserRole {
  CLIENT_USER = 'CLIENT_USER',
  CLIENT_ADMIN = 'CLIENT_ADMIN',
  INTERNAL_ENGINEER = 'INTERNAL_ENGINEER',
  INTERNAL_PM = 'INTERNAL_PM',
  ADMIN = 'ADMIN'
}

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.CLIENT_USER]: [
    Permission.READ_OWN_PROJECTS,
    Permission.READ_OWN_INVOICES,
    Permission.UPLOAD_PROJECT_FILES,
    Permission.DOWNLOAD_PROJECT_FILES
  ],
  [UserRole.CLIENT_ADMIN]: [
    Permission.READ_ACCOUNT_PROJECTS,
    Permission.READ_ACCOUNT_INVOICES,
    Permission.UPLOAD_PROJECT_FILES,
    Permission.DOWNLOAD_PROJECT_FILES,
    Permission.MANAGE_ACCOUNT_USERS,
    Permission.VIEW_ACCOUNT_ANALYTICS
  ],
  [UserRole.INTERNAL_ENGINEER]: [
    Permission.READ_ALL_PROJECTS,
    Permission.UPDATE_PROJECT_STATUS,
    Permission.ACCESS_TECHNICAL_DATA,
    Permission.UPLOAD_PROJECT_FILES,
    Permission.DOWNLOAD_PROJECT_FILES
  ],
  [UserRole.INTERNAL_PM]: [
    Permission.READ_ALL_PROJECTS,
    Permission.READ_ALL_INVOICES,
    Permission.UPDATE_PROJECT_STATUS,
    Permission.CREATE_PROJECTS,
    Permission.CREATE_INVOICES,
    Permission.VIEW_ALL_ANALYTICS,
    Permission.EXPORT_DATA
  ],
  [UserRole.ADMIN]: [
    // Admin has all permissions
    ...Object.values(Permission)
  ]
}

export class RBACService {
  static hasPermission(userRole: UserRole, permission: Permission): boolean {
    const permissions = RolePermissions[userRole] || []
    return permissions.includes(permission)
  }
  
  static async checkPermission(
    request: NextRequest, 
    requiredPermission: Permission
  ): Promise<{ hasPermission: boolean; user?: { email?: string; id?: string; name?: string } }> {
    try {
      const session = await getServerSession(authOptions)
      if (!session?.user) {
        return { hasPermission: false }
      }
      
      // Get user role from session or database
      const userRole = (session.user as any).userRole || UserRole.CLIENT_USER
      const hasPermission = this.hasPermission(userRole, requiredPermission)
      
      // Log permission check (optional if database available)
      try {
        await AuditLogger.log({
          userId: session.user.id,
          action: 'permission_check',
          entity: 'system',
          meta: {
            permission: requiredPermission,
            granted: hasPermission,
            userRole: userRole
          },
          ipAddress: this.getClientIP(request),
          userAgent: request.headers.get('user-agent') || undefined
        })
      } catch (auditError) {
        console.warn('⚠️ Audit logging failed (continuing):', auditError instanceof Error ? auditError.message : String(auditError))
      }
      
      return { hasPermission, user: session.user }
    } catch (error) {
      console.error('RBAC permission check error:', error)
      return { hasPermission: false }
    }
  }
  
  static getClientIP(request: NextRequest): string | undefined {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    
    if (realIP) {
      return realIP
    }
    
    return request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           'unknown'
  }
  
  static createPermissionMiddleware(requiredPermission: Permission) {
    return async (request: NextRequest) => {
      const { hasPermission, user } = await this.checkPermission(request, requiredPermission)
      
      if (!hasPermission) {
        return new Response(
          JSON.stringify({ 
            error: 'Insufficient permissions',
            required: requiredPermission 
          }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
      
      // Add user to request context
      ;(request as any).user = user
      return null // Continue to handler
    }
  }
}

// Helper function to check permissions in API routes
export async function requirePermission(
  request: NextRequest,
  permission: Permission
): Promise<{ user: { email?: string; id?: string; name?: string } } | Response> {
  const { hasPermission, user } = await RBACService.checkPermission(request, permission)
  
  if (!hasPermission) {
    return new Response(
      JSON.stringify({ 
        error: 'Insufficient permissions',
        required: permission 
      }),
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
  
  return { user: user! }
}

// Helper function to get user permissions
export function getUserPermissions(userRole: UserRole): Permission[] {
  return RolePermissions[userRole] || []
}

// Helper function to check if user can access resource
export function canAccessResource(
  userRole: UserRole,
  resourceOwnerId: string,
  currentUserId: string,
  accountId?: string
): boolean {
  // Admin can access everything
  if (userRole === UserRole.ADMIN) {
    return true
  }
  
  // Internal roles can access all resources
  if (userRole === UserRole.INTERNAL_ENGINEER || userRole === UserRole.INTERNAL_PM) {
    return true
  }
  
  // Client admin can access account resources
  if (userRole === UserRole.CLIENT_ADMIN && accountId) {
    return true // Would need to check if resource belongs to same account
  }
  
  // Client user can only access own resources
  if (userRole === UserRole.CLIENT_USER) {
    return resourceOwnerId === currentUserId
  }
  
  return false
}