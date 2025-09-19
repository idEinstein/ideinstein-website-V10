/**
 * API Validation Schemas
 * Comprehensive Zod schemas for all API endpoints
 */

import { z } from 'zod';

// ============================================================================
// ADMIN API SCHEMAS
// ============================================================================

export const AdminValidateSchema = z.object({
  password: z.string().min(1, 'Password is required')
});

export const AdminVerifyTokenSchema = z.object({
  token: z.string().min(1, 'Token is required')
});

// ============================================================================
// SECURITY API SCHEMAS  
// ============================================================================

export const CSPReportSchema = z.object({
  'csp-report': z.object({
    'document-uri': z.string().optional(),
    'referrer': z.string().optional(),
    'violated-directive': z.string().optional(),
    'effective-directive': z.string().optional(),
    'original-policy': z.string().optional(),
    'disposition': z.string().optional(),
    'blocked-uri': z.string().optional(),
    'line-number': z.number().optional(),
    'column-number': z.number().optional(),
    'source-file': z.string().optional(),
    'status-code': z.number().optional(),
    'script-sample': z.string().optional()
  }).optional(),
  // Also accept direct report format
  'document-uri': z.string().optional(),
  'referrer': z.string().optional(),
  'violated-directive': z.string().optional(),
  'effective-directive': z.string().optional(),
  'original-policy': z.string().optional(),
  'disposition': z.string().optional(),
  'blocked-uri': z.string().optional(),
  'line-number': z.number().optional(),
  'column-number': z.number().optional(),
  'source-file': z.string().optional(),
  'status-code': z.number().optional(),
  'script-sample': z.string().optional()
});

export const SecurityDashboardTestSchema = z.object({
  action: z.literal('run_test'),
  testType: z.enum(['comprehensive', 'owasp', 'dependencies', 'nextjs', 'documentation'])
});

export const SecurityEventSchema = z.object({
  type: z.enum(['suspicious_request', 'rate_limit', 'auth_failure', 'csp_violation']),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
  url: z.string().optional(),
  details: z.record(z.any()).optional().default({})
});

// ============================================================================
// WEBHOOK SCHEMAS
// ============================================================================

export const GitHubWebhookSchema = z.object({
  action: z.string().optional(),
  repository: z.object({
    name: z.string(),
    full_name: z.string(),
    html_url: z.string().url()
  }),
  sender: z.object({
    login: z.string(),
    html_url: z.string().url()
  }),
  ref: z.string().optional(),
  commits: z.array(z.object({
    id: z.string(),
    message: z.string(),
    author: z.object({
      name: z.string(),
      email: z.string().email()
    })
  })).optional(),
  pull_request: z.object({
    number: z.number(),
    title: z.string(),
    html_url: z.string().url(),
    state: z.string()
  }).optional()
});

// ============================================================================
// DASHBOARD & MONITORING SCHEMAS
// ============================================================================

export const DashboardStatsQuerySchema = z.object({
  timeframe: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  includeDetails: z.string().transform(val => val === 'true').pipe(z.boolean()).default('false')
});

export const MonitoringQuerySchema = z.object({
  type: z.enum(['security', 'performance', 'errors', 'all']).default('all'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(1000)).default('100'),
  since: z.string().datetime().optional()
});

// ============================================================================
// ZOHO API SCHEMAS
// ============================================================================

export const ZohoHealthQuerySchema = z.object({
  service: z.enum(['crm', 'campaigns', 'workdrive', 'bookings', 'all']).default('all'),
  detailed: z.string().transform(val => val === 'true').pipe(z.boolean()).default('false')
});

export const ZohoOAuthSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
  scope: z.string().optional()
});

// ============================================================================
// BILLING & INVOICES SCHEMAS
// ============================================================================

export const InvoiceQuerySchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
  customer_id: z.string().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  includeDetails: z.string().transform(val => val === 'true').pipe(z.boolean()).default('true'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('20'),
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1')
});

// ============================================================================
// BLOG & CONTENT SCHEMAS
// ============================================================================

export const BlogPostQuerySchema = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
  published: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).default('10'),
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  search: z.string().optional()
});

// ============================================================================
// BOOKINGS SCHEMAS
// ============================================================================

export const BookingAvailabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  service_id: z.string().optional(),
  timezone: z.string().default('Europe/Berlin'),
  duration: z.string().transform(Number).pipe(z.number().min(15).max(480)).default('60')
});

// ============================================================================
// CONFIG & ENVIRONMENT SCHEMAS
// ============================================================================

export const ValidateEnvQuerySchema = z.object({
  environment: z.enum(['development', 'production', 'test']).optional(),
  check_secrets: z.string().transform(val => val === 'true').pipe(z.boolean()).default('false'),
  verbose: z.string().transform(val => val === 'true').pipe(z.boolean()).default('false')
});

// ============================================================================
// DATABASE SCHEMAS
// ============================================================================

export const DatabaseConfigQuerySchema = z.object({
  action: z.enum(['validate', 'test_connection', 'get_stats']).default('validate'),
  include_sensitive: z.string().transform(val => val === 'true').pipe(z.boolean()).default('false')
});

export const DatabaseSecurityAuditQuerySchema = z.object({
  check_type: z.enum(['permissions', 'encryption', 'backup', 'monitoring', 'all']).default('all'),
  detailed: z.string().transform(val => val === 'true').pipe(z.boolean()).default('true')
});

// ============================================================================
// DEPLOYMENT SCHEMAS
// ============================================================================

export const DeploymentConfigSchema = z.object({
  environment: z.enum(['development', 'staging', 'production']),
  branch: z.string().min(1, 'Branch is required'),
  auto_deploy: z.boolean().optional().default(false),
  run_tests: z.boolean().optional().default(true)
});

export const VercelSyncSchema = z.object({
  project_id: z.string().min(1, 'Project ID is required'),
  team_id: z.string().optional(),
  sync_env: z.boolean().optional().default(true),
  sync_domains: z.boolean().optional().default(false)
});

// ============================================================================
// RATE LIMITING SCHEMAS
// ============================================================================

export const RateLimitQuerySchema = z.object({
  ip: z.string().ip().optional(),
  endpoint: z.string().optional(),
  timeframe: z.enum(['1h', '24h', '7d', '30d']).default('24h'),
  include_violations: z.string().transform(val => val === 'true').pipe(z.boolean()).default('true')
});

export const RateLimitResetSchema = z.object({
  ip: z.string().ip().optional(),
  endpoint: z.string().optional(),
  reset_all: z.boolean().optional().default(false)
});

// ============================================================================
// COMMON QUERY SCHEMAS
// ============================================================================

export const PaginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('20'),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
});

export const TimestampQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  timezone: z.string().optional().default('Europe/Berlin')
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AdminValidateInput = z.infer<typeof AdminValidateSchema>;
export type AdminVerifyTokenInput = z.infer<typeof AdminVerifyTokenSchema>;
export type CSPReportInput = z.infer<typeof CSPReportSchema>;
export type SecurityDashboardTestInput = z.infer<typeof SecurityDashboardTestSchema>;
export type SecurityEventInput = z.infer<typeof SecurityEventSchema>;
export type GitHubWebhookInput = z.infer<typeof GitHubWebhookSchema>;
export type DashboardStatsQuery = z.infer<typeof DashboardStatsQuerySchema>;
export type MonitoringQuery = z.infer<typeof MonitoringQuerySchema>;
export type ZohoHealthQuery = z.infer<typeof ZohoHealthQuerySchema>;
export type ZohoOAuthInput = z.infer<typeof ZohoOAuthSchema>;
export type InvoiceQuery = z.infer<typeof InvoiceQuerySchema>;
export type BlogPostQuery = z.infer<typeof BlogPostQuerySchema>;
export type BookingAvailabilityQuery = z.infer<typeof BookingAvailabilityQuerySchema>;
export type ValidateEnvQuery = z.infer<typeof ValidateEnvQuerySchema>;
export type DatabaseConfigQuery = z.infer<typeof DatabaseConfigQuerySchema>;
export type DatabaseSecurityAuditQuery = z.infer<typeof DatabaseSecurityAuditQuerySchema>;
export type DeploymentConfigInput = z.infer<typeof DeploymentConfigSchema>;
export type VercelSyncInput = z.infer<typeof VercelSyncSchema>;
export type RateLimitQuery = z.infer<typeof RateLimitQuerySchema>;
export type RateLimitResetInput = z.infer<typeof RateLimitResetSchema>;
export type PaginationQuery = z.infer<typeof PaginationSchema>;
export type TimestampQuery = z.infer<typeof TimestampQuerySchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate query parameters from URL search params
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const params = Object.fromEntries(searchParams.entries());
  const result = schema.safeParse(params);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

/**
 * Validate JSON request body
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: z.ZodError | Error }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    return { 
      success: false, 
      error: new Error('Invalid JSON in request body') 
    };
  }
}

/**
 * Create validation middleware for API routes
 */
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T, request: Request) => Promise<Response>
) {
  return async (request: Request) => {
    const validation = await validateRequestBody(request, schema);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          details: validation.error instanceof z.ZodError 
            ? validation.error.flatten() 
            : validation.error.message
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return handler(validation.data, request);
  };
}