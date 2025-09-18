/**
 * Secure Logging Utility
 * Prevents sensitive information from being logged to console or files
 */

export class SecureLogger {
  private static sensitiveKeys = [
    'token', 'secret', 'password', 'key', 'auth', 'authorization',
    'cookie', 'session', 'refresh_token', 'access_token', 'api_key',
    'zoho_refresh_token', 'nextauth_secret', 'client_secret'
  ];

  /**
   * Log message with automatic data sanitization
   * @param level - Log level (info, warn, error, debug)
   * @param message - Log message
   * @param data - Optional data to log (will be sanitized)
   */
  static log(level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any): void {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const timestamp = new Date().toISOString();
    
    // Always log the message
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    switch (level) {
      case 'error':
        console.error(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'debug':
        if (isDevelopment) {
          console.debug(logMessage);
        }
        break;
      default:
        console.log(logMessage);
    }

    // Log sanitized data only in development
    if (data && isDevelopment) {
      const sanitizedData = this.sanitizeData(data);
      console.log('Data:', sanitizedData);
    }
  }

  /**
   * Log info message
   */
  static info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Log warning message
   */
  static warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  /**
   * Log error message
   */
  static error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  /**
   * Log debug message (only in development)
   */
  static debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  /**
   * Log API request without exposing sensitive headers
   */
  static logApiRequest(method: string, url: string, headers?: Record<string, string>): void {
    const sanitizedHeaders = headers ? this.sanitizeHeaders(headers) : undefined;
    this.info(`API Request: ${method} ${url}`, { headers: sanitizedHeaders });
  }

  /**
   * Log API response without exposing sensitive data
   */
  static logApiResponse(status: number, url: string, responseTime?: number): void {
    const data = responseTime ? { responseTime: `${responseTime}ms` } : undefined;
    this.info(`API Response: ${status} ${url}`, data);
  }

  /**
   * Log authentication events securely
   */
  static logAuth(event: string, userId?: string, email?: string): void {
    const sanitizedEmail = email ? this.maskEmail(email) : undefined;
    this.info(`Auth Event: ${event}`, { userId, email: sanitizedEmail });
  }

  /**
   * Log token operations without exposing tokens
   */
  static logTokenOperation(operation: string, service: string, success: boolean): void {
    this.info(`Token ${operation}: ${service}`, { success });
  }

  /**
   * Sanitize data by removing or masking sensitive information
   */
  private static sanitizeData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }

    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        return data.map(item => this.sanitizeData(item));
      }

      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();
        
        if (this.sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
          sanitized[key] = this.maskSensitiveValue(value as string);
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Sanitize headers by masking authorization and sensitive headers
   */
  private static sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(headers)) {
      const lowerKey = key.toLowerCase();
      
      if (lowerKey.includes('authorization') || lowerKey.includes('token') || lowerKey.includes('key')) {
        sanitized[key] = this.maskSensitiveValue(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  /**
   * Sanitize string by looking for token-like patterns
   */
  private static sanitizeString(str: string): string {
    // Look for token-like patterns and mask them
    return str
      .replace(/([a-zA-Z0-9]{20,})/g, (match) => {
        // If it looks like a token (long alphanumeric string), mask it
        if (match.length > 20) {
          return `${match.substring(0, 4)}***${match.substring(match.length - 4)}`;
        }
        return match;
      })
      .replace(/(Bearer\s+)([a-zA-Z0-9\-._~+/]+=*)/gi, '$1***MASKED***')
      .replace(/(Zoho-oauthtoken\s+)([a-zA-Z0-9\-._~+/]+=*)/gi, '$1***MASKED***');
  }

  /**
   * Mask sensitive values
   */
  private static maskSensitiveValue(value: string): string {
    if (!value || typeof value !== 'string') {
      return '***REDACTED***';
    }

    if (value.length <= 8) {
      return '***REDACTED***';
    }

    // Show first 2 and last 2 characters for debugging
    return `${value.substring(0, 2)}***${value.substring(value.length - 2)}`;
  }

  /**
   * Mask email addresses for logging
   */
  private static maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return '***REDACTED***';
    
    if (local.length <= 2) {
      return `${local[0]}***@${domain}`;
    }
    
    return `${local.substring(0, 2)}***@${domain}`;
  }

  /**
   * Create a safe error message for logging
   */
  static createSafeErrorMessage(error: any): string {
    if (error instanceof Error) {
      // Remove sensitive information from error messages
      let message = error.message;
      
      // Remove tokens from error messages
      message = this.sanitizeString(message);
      
      // Remove file paths that might contain sensitive info
      message = message.replace(/\/[^\s]+/g, '[PATH_REDACTED]');
      
      return message;
    }
    
    return 'Unknown error occurred';
  }

  /**
   * Log performance metrics safely
   */
  static logPerformance(operation: string, duration: number, metadata?: Record<string, any>): void {
    const sanitizedMetadata = metadata ? this.sanitizeData(metadata) : undefined;
    this.info(`Performance: ${operation} completed in ${duration}ms`, sanitizedMetadata);
  }
}

// Export convenience methods
export const logger = {
  info: SecureLogger.info.bind(SecureLogger),
  warn: SecureLogger.warn.bind(SecureLogger),
  error: SecureLogger.error.bind(SecureLogger),
  debug: SecureLogger.debug.bind(SecureLogger),
  logApiRequest: SecureLogger.logApiRequest.bind(SecureLogger),
  logApiResponse: SecureLogger.logApiResponse.bind(SecureLogger),
  logAuth: SecureLogger.logAuth.bind(SecureLogger),
  logTokenOperation: SecureLogger.logTokenOperation.bind(SecureLogger),
  logPerformance: SecureLogger.logPerformance.bind(SecureLogger)
};

export default SecureLogger;