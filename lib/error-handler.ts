/**
 * Secure Error Handler for API Routes
 * Prevents sensitive information disclosure in error responses
 */

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}

export class SecureErrorHandler {
  /**
   * Handles errors securely without exposing sensitive information
   * @param error - The original error object
   * @param isDevelopment - Whether we're in development mode
   * @returns Sanitized error response
   */
  static handle(error: any, isDevelopment: boolean = false): ApiError {
    // Log full error details in development only (never in production)
    if (isDevelopment) {
      console.error('Development Error Details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3) // Limit stack trace
      });
    }

    // Standardized secure error responses
    switch (error.name) {
      case 'ValidationError':
      case 'ZodError':
        return {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request parameters provided',
          statusCode: 400
        };

      case 'UnauthorizedError':
      case 'JsonWebTokenError':
        return {
          code: 'UNAUTHORIZED',
          message: 'Authentication required to access this resource',
          statusCode: 401
        };

      case 'ForbiddenError':
        return {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions to access this resource',
          statusCode: 403
        };

      case 'NotFoundError':
        return {
          code: 'NOT_FOUND',
          message: 'The requested resource was not found',
          statusCode: 404
        };

      case 'ConflictError':
        return {
          code: 'CONFLICT',
          message: 'A conflict occurred with the current state of the resource',
          statusCode: 409
        };

      case 'RateLimitError':
        return {
          code: 'RATE_LIMITED',
          message: 'Too many requests. Please try again later',
          statusCode: 429
        };

      default:
        // Generic error response - never expose internal details
        return {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred while processing your request',
          statusCode: 500
        };
    }
  }

  /**
   * Creates a standardized error response for API routes
   * @param error - The error to handle
   * @param isDevelopment - Whether we're in development mode
   * @returns Response object with secure error
   */
  static createResponse(error: any, isDevelopment: boolean = false): Response {
    const secureError = this.handle(error, isDevelopment);
    
    return Response.json(
      {
        success: false,
        error: {
          code: secureError.code,
          message: secureError.message
        },
        // Include timestamp for debugging (safe to expose)
        timestamp: new Date().toISOString()
      },
      { 
        status: secureError.statusCode,
        headers: {
          'Content-Type': 'application/json',
          // Add security headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY'
        }
      }
    );
  }

  /**
   * Sanitizes data for logging (removes sensitive information)
   * @param data - Data to sanitize
   * @returns Sanitized data safe for logging
   */
  static sanitizeForLogging(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'auth', 'authorization',
      'cookie', 'session', 'refresh_token', 'access_token', 'api_key'
    ];

    const sanitized = Array.isArray(data) ? [...data] : { ...data };

    for (const key in sanitized) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        sanitized[key] = '***REDACTED***';
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeForLogging(sanitized[key]);
      }
    }

    return sanitized;
  }
}

/**
 * Custom error classes for better error handling
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden access') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Convenience function for handling API errors
 * @param error - The error to handle
 * @param isDevelopment - Whether we're in development mode
 * @returns Sanitized error response
 */
export function handleApiError(error: any, isDevelopment: boolean = process.env.NODE_ENV === 'development'): ApiError {
  return SecureErrorHandler.handle(error, isDevelopment);
}