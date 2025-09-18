/**
 * Security Event Logging System
 * Comprehensive security event tracking and monitoring
 */

export interface SecurityEvent {
  id: string;
  type: 'csp_violation' | 'rate_limit' | 'auth_failure' | 'suspicious_request' | 'middleware_error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  userId?: string;
  sessionId?: string;
  details: Record<string, any>;
  environment: string;
}

export interface SecurityMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  recentEvents: SecurityEvent[];
  suspiciousIPs: string[];
}

/**
 * Security Event Logger Class
 */
export class SecurityLogger {
  private static instance: SecurityLogger;
  private events: SecurityEvent[] = [];
  private maxEvents: number = 1000; // Keep last 1000 events in memory

  private constructor() {}

  public static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  /**
   * Log a security event
   */
  public logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'environment'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'unknown'
    };

    // Add to in-memory storage
    this.events.unshift(securityEvent);
    
    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(securityEvent);
    }

    // In production, you would send to external monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.logToProduction(securityEvent);
    }

    // Handle critical events immediately
    if (securityEvent.severity === 'critical') {
      this.handleCriticalEvent(securityEvent);
    }
  }

  /**
   * Log CSP violation
   */
  public logCSPViolation(violation: any, request?: any): void {
    this.logEvent({
      type: 'csp_violation',
      severity: 'medium',
      ip: this.extractIP(request),
      userAgent: request?.headers?.get('user-agent'),
      url: request?.url,
      details: {
        violatedDirective: violation['violated-directive'],
        blockedURI: violation['blocked-uri'],
        documentURI: violation['document-uri'],
        originalPolicy: violation['original-policy'],
        disposition: violation.disposition
      }
    });
  }

  /**
   * Log rate limit violation
   */
  public logRateLimitViolation(ip: string, endpoint: string, limit: number, request?: any): void {
    this.logEvent({
      type: 'rate_limit',
      severity: 'high',
      ip,
      userAgent: request?.headers?.get('user-agent'),
      url: endpoint,
      method: request?.method,
      details: {
        limit,
        endpoint,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Log authentication failure
   */
  public logAuthFailure(ip: string, email?: string, reason?: string, request?: any): void {
    this.logEvent({
      type: 'auth_failure',
      severity: 'medium',
      ip,
      userAgent: request?.headers?.get('user-agent'),
      url: request?.url,
      method: request?.method,
      details: {
        email: email ? this.maskEmail(email) : undefined,
        reason,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Log suspicious request
   */
  public logSuspiciousRequest(ip: string, reason: string, request?: any): void {
    this.logEvent({
      type: 'suspicious_request',
      severity: 'high',
      ip,
      userAgent: request?.headers?.get('user-agent'),
      url: request?.url,
      method: request?.method,
      details: {
        reason,
        headers: this.sanitizeHeaders(request?.headers),
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Get security metrics
   */
  public getMetrics(): SecurityMetrics {
    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    const suspiciousIPs: string[] = [];

    this.events.forEach(event => {
      // Count by type
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      
      // Count by severity
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
      
      // Track suspicious IPs
      if (event.ip && (event.severity === 'high' || event.severity === 'critical')) {
        if (!suspiciousIPs.includes(event.ip)) {
          suspiciousIPs.push(event.ip);
        }
      }
    });

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      recentEvents: this.events.slice(0, 10), // Last 10 events
      suspiciousIPs: suspiciousIPs.slice(0, 20) // Top 20 suspicious IPs
    };
  }

  /**
   * Get events by type
   */
  public getEventsByType(type: SecurityEvent['type'], limit: number = 50): SecurityEvent[] {
    return this.events
      .filter(event => event.type === type)
      .slice(0, limit);
  }

  /**
   * Get events by IP
   */
  public getEventsByIP(ip: string, limit: number = 50): SecurityEvent[] {
    return this.events
      .filter(event => event.ip === ip)
      .slice(0, limit);
  }

  /**
   * Check if IP is suspicious
   */
  public isSuspiciousIP(ip: string): boolean {
    const recentEvents = this.events
      .filter(event => event.ip === ip)
      .filter(event => {
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return event.timestamp > hourAgo;
      });

    // Consider IP suspicious if:
    // - More than 10 events in the last hour
    // - Any critical events
    // - More than 5 high severity events
    const criticalEvents = recentEvents.filter(e => e.severity === 'critical').length;
    const highSeverityEvents = recentEvents.filter(e => e.severity === 'high').length;

    return recentEvents.length > 10 || criticalEvents > 0 || highSeverityEvents > 5;
  }

  /**
   * Private helper methods
   */
  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractIP(request: any): string | undefined {
    if (!request) return undefined;
    
    // Try various headers for IP extraction
    const headers = request.headers;
    return headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
           headers?.get('x-real-ip') ||
           headers?.get('cf-connecting-ip') ||
           request.ip ||
           'unknown';
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return '***';
    
    const maskedLocal = local.length > 2 
      ? `${local[0]}***${local[local.length - 1]}`
      : '***';
    
    return `${maskedLocal}@${domain}`;
  }

  private sanitizeHeaders(headers: any): Record<string, string> {
    if (!headers) return {};
    
    const sanitized: Record<string, string> = {};
    const allowedHeaders = [
      'user-agent', 'accept', 'accept-language', 'accept-encoding',
      'referer', 'origin', 'x-forwarded-for', 'x-real-ip'
    ];

    allowedHeaders.forEach(header => {
      const value = headers.get?.(header) || headers[header];
      if (value) {
        sanitized[header] = value;
      }
    });

    return sanitized;
  }

  private logToConsole(event: SecurityEvent): void {
    const color = this.getSeverityColor(event.severity);
    console.log(`\n🔒 ${color}SECURITY EVENT${'\x1b[0m'}`);
    console.log(`   Type: ${event.type}`);
    console.log(`   Severity: ${event.severity}`);
    console.log(`   IP: ${event.ip || 'unknown'}`);
    console.log(`   URL: ${event.url || 'unknown'}`);
    console.log(`   Time: ${event.timestamp.toISOString()}`);
    if (Object.keys(event.details).length > 0) {
      console.log(`   Details:`, event.details);
    }
    console.log('');
  }

  private logToProduction(event: SecurityEvent): void {
    // In production, send to monitoring service
    // Examples:
    // - Send to Sentry, DataDog, New Relic
    // - Store in database for analysis
    // - Send to SIEM system
    // - Trigger alerts for critical events
    
    try {
      // Example: Send to external monitoring service
      // await fetch('/api/security/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
      
      // For now, just log to console in production too
      console.error('Security Event:', JSON.stringify(event, null, 2));
    } catch (error) {
      console.error('Failed to log security event to production service:', error);
    }
  }

  private handleCriticalEvent(event: SecurityEvent): void {
    // Handle critical security events immediately
    console.error('🚨 CRITICAL SECURITY EVENT:', event);
    
    // In production, you might:
    // - Send immediate alerts to security team
    // - Temporarily block suspicious IPs
    // - Trigger incident response procedures
    // - Notify stakeholders
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return '\x1b[41m\x1b[37m'; // Red background, white text
      case 'high': return '\x1b[31m'; // Red text
      case 'medium': return '\x1b[33m'; // Yellow text
      case 'low': return '\x1b[36m'; // Cyan text
      default: return '\x1b[0m'; // Reset
    }
  }
}

/**
 * Singleton instance for easy access
 */
export const securityLogger = SecurityLogger.getInstance();
