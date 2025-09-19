/**
 * Validation Middleware for API Routes
 * Provides reusable validation patterns for Next.js API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Validation error response format
 */
interface ValidationErrorResponse {
  success: false;
  error: string;
  details?: any;
  timestamp: string;
}

/**
 * Create a standardized validation error response
 */
function createValidationErrorResponse(
  error: z.ZodError | Error,
  status: number = 400
): NextResponse<ValidationErrorResponse> {
  const response: ValidationErrorResponse = {
    success: false,
    error: 'Validation failed',
    timestamp: new Date().toISOString()
  };

  if (error instanceof z.ZodError) {
    response.details = error.flatten();
  } else {
    response.error = error.message;
  }

  return NextResponse.json(response, { status });
}

/**
 * Validate request body with Zod schema
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { 
        success: false, 
        response: createValidationErrorResponse(result.error) 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      response: createValidationErrorResponse(
        new Error('Invalid JSON in request body'),
        400
      )
    };
  }
}

/**
 * Validate query parameters with Zod schema
 */
export function validateQueryParams<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Handle the case where no query parameters are provided
    // by providing empty object for schemas with defaults
    const inputParams = Object.keys(params).length === 0 ? {} : params;
    
    const result = schema.safeParse(inputParams);
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { 
        success: false, 
        response: createValidationErrorResponse(result.error) 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      response: createValidationErrorResponse(
        new Error('Invalid query parameters'),
        400
      )
    };
  }
}

/**
 * Higher-order function to add validation to API route handlers
 */
export function withBodyValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T, request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const validation = await validateRequestBody(request, schema);
    
    if (!validation.success) {
      return validation.response;
    }
    
    return handler(validation.data, request);
  };
}

/**
 * Higher-order function to add query parameter validation to API route handlers
 */
export function withQueryValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (params: T, request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const validation = validateQueryParams(request, schema);
    
    if (!validation.success) {
      return validation.response;
    }
    
    return handler(validation.data, request);
  };
}

/**
 * Combined validation for both body and query parameters
 */
export function withValidation<TBody, TQuery>(
  bodySchema: z.ZodSchema<TBody>,
  querySchema: z.ZodSchema<TQuery>,
  handler: (body: TBody, query: TQuery, request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Validate query parameters
    const queryValidation = validateQueryParams(request, querySchema);
    if (!queryValidation.success) {
      return queryValidation.response;
    }
    
    // Validate request body
    const bodyValidation = await validateRequestBody(request, bodySchema);
    if (!bodyValidation.success) {
      return bodyValidation.response;
    }
    
    return handler(bodyValidation.data, queryValidation.data, request);
  };
}

/**
 * Validation for GET requests (query parameters only)
 */
export function withGetValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (params: T, request: NextRequest) => Promise<NextResponse>
) {
  return withQueryValidation(schema, handler);
}

/**
 * Validation for POST requests (body only)
 */
export function withPostValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T, request: NextRequest) => Promise<NextResponse>
) {
  return withBodyValidation(schema, handler);
}

/**
 * Optional validation - allows empty/undefined values
 */
export function withOptionalValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T | null, request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const body = await request.text();
      
      // If body is empty, pass null to handler
      if (!body.trim()) {
        return handler(null, request);
      }
      
      const parsedBody = JSON.parse(body);
      const result = schema.safeParse(parsedBody);
      
      if (result.success) {
        return handler(result.data, request);
      } else {
        return createValidationErrorResponse(result.error);
      }
    } catch (error) {
      // If JSON parsing fails but body exists, it's an error
      return createValidationErrorResponse(
        new Error('Invalid JSON in request body')
      );
    }
  };
}

/**
 * Validation helper for multipart/form-data requests
 */
export async function validateFormData<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T; formData: FormData } | { success: false; response: NextResponse }> {
  try {
    const formData = await request.formData();
    const data: Record<string, any> = {};
    
    // Convert FormData to object
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        // Handle boolean coercion for form data
        if (value === 'true' || value === 'false') {
          data[key] = value === 'true';
        } else {
          data[key] = value;
        }
      } else {
        // Keep File objects as-is
        data[key] = value;
      }
    });
    
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data, formData };
    } else {
      return { 
        success: false, 
        response: createValidationErrorResponse(result.error) 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      response: createValidationErrorResponse(
        new Error('Invalid form data'),
        400
      )
    };
  }
}

/**
 * Higher-order function for form data validation
 */
export function withFormDataValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T, formData: FormData, request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const validation = await validateFormData(request, schema);
    
    if (!validation.success) {
      return validation.response;
    }
    
    return handler(validation.data, validation.formData, request);
  };
}