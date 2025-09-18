/**
 * Production Environment Variable Validator
 * Validates and manages environment variables for secure deployment
 */

export interface EnvVarDefinition {
  key: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'url' | 'email' | 'json';
  description: string;
  example?: string;
  validation?: (value: string) => boolean;
  suggestions?: string[];
  environments?: ('development' | 'production' | 'preview')[];
  sensitive?: boolean; // Should be masked in logs
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  missing: string[];
  suggestions: EnvSuggestion[];
}

export interface ValidationError {
  key: string;
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

export interface ValidationWarning {
  key: string;
  message: string;
  suggestion?: string;
}

export interface EnvSuggestion {
  key: string;
  suggestion: string;
  reason: string;
}

/**
 * Comprehensive environment variable schema for IdEinstein platform
 */
export const ENV_SCHEMA: EnvVarDefinition[] = [
  // Core Application
  {
    key: 'NODE_ENV',
    required: true,
    type: 'string',
    description: 'Application environment',
    example: 'production',
    validation: (value) => ['development', 'production', 'test', 'preview'].includes(value),
    suggestions: ['production', 'development', 'preview']
  },
  {
    key: 'NEXTAUTH_URL',
    required: true,
    type: 'url',
    description: 'Base URL for NextAuth.js',
    example: 'https://your-domain.com',
    environments: ['production', 'preview']
  },
  {
    key: 'NEXTAUTH_SECRET',
    required: true,
    type: 'string',
    description: 'Secret key for NextAuth.js JWT encryption',
    example: 'your-secret-key-here',
    sensitive: true,
    validation: (value) => value.length >= 32
  },

  // Database Configuration
  {
    key: 'DATABASE_URL',
    required: true,
    type: 'url',
    description: 'PostgreSQL database connection URL with SSL',
    example: 'postgresql://user:password@host:5432/database?sslmode=require',
    sensitive: true,
    validation: (value) => value.includes('sslmode=require') || value.includes('ssl=true')
  },
  {
    key: 'DIRECT_URL',
    required: false,
    type: 'url',
    description: 'Direct database connection URL for migrations',
    example: 'postgresql://user:password@host:5432/database?sslmode=require',
    sensitive: true,
    environments: ['production']
  },

  // Zoho Integration
  {
    key: 'ZOHO_CLIENT_ID',
    required: true,
    type: 'string',
    description: 'Zoho OAuth client ID',
    example: '1000.XXXXXXXXXXXXXXXXXXXXXXXXXX'
  },
  {
    key: 'ZOHO_CLIENT_SECRET',
    required: true,
    type: 'string',
    description: 'Zoho OAuth client secret',
    example: 'your-zoho-client-secret',
    sensitive: true
  },
  {
    key: 'ZOHO_CRM_REFRESH',
    required: true,
    type: 'string',
    description: 'Zoho CRM OAuth refresh token',
    example: '1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    sensitive: true
  },
  {
    key: 'ZOHO_BOOKINGS_REFRESH',
    required: true,
    type: 'string',
    description: 'Zoho Bookings OAuth refresh token',
    example: '1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    sensitive: true
  },
  {
    key: 'ZOHO_WORKDRIVE_REFRESH',
    required: true,
    type: 'string',
    description: 'Zoho WorkDrive OAuth refresh token',
    example: '1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    sensitive: true
  },
  {
    key: 'ZOHO_CAMPAIGNS_REFRESH',
    required: true,
    type: 'string',
    description: 'Zoho Campaigns OAuth refresh token',
    example: '1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    sensitive: true
  },
  {
    key: 'ZOHO_REGION',
    required: false,
    type: 'string',
    description: 'Zoho data center region',
    example: 'com',
    validation: (value) => ['com', 'eu', 'in', 'com.au', 'jp'].includes(value),
    suggestions: ['com', 'eu', 'in']
  },

  // Email Configuration
  {
    key: 'SMTP_HOST',
    required: true,
    type: 'string',
    description: 'SMTP server hostname',
    example: 'smtp.gmail.com'
  },
  {
    key: 'SMTP_PORT',
    required: true,
    type: 'number',
    description: 'SMTP server port',
    example: '587',
    validation: (value) => {
      const port = parseInt(value);
      return port > 0 && port <= 65535;
    }
  },
  {
    key: 'SMTP_USER',
    required: true,
    type: 'email',
    description: 'SMTP authentication username (email)',
    example: 'your-email@gmail.com'
  },
  {
    key: 'SMTP_PASS',
    required: true,
    type: 'string',
    description: 'SMTP authentication password or app password',
    example: 'your-app-password',
    sensitive: true
  },
  {
    key: 'FROM_EMAIL',
    required: true,
    type: 'email',
    description: 'Default sender email address',
    example: 'noreply@your-domain.com'
  },

  // Security Configuration
  {
    key: 'ADMIN_PASSWORD',
    required: true,
    type: 'string',
    description: 'Admin authentication password (server-side only)',
    example: 'your-strong-admin-password',
    sensitive: true,
    validation: (value) => value.length >= 12,
    environments: ['production', 'preview']
  },
  {
    key: 'ENCRYPTION_KEY',
    required: true,
    type: 'string',
    description: 'Key for encrypting sensitive data',
    example: 'your-32-character-encryption-key',
    sensitive: true,
    validation: (value) => value.length >= 32,
    environments: ['production']
  },
  {
    key: 'RATE_LIMIT_REDIS_URL',
    required: false,
    type: 'url',
    description: 'Redis URL for distributed rate limiting',
    example: 'redis://localhost:6379',
    sensitive: true,
    environments: ['production']
  },

  // Analytics and Monitoring
  {
    key: 'GOOGLE_ANALYTICS_ID',
    required: false,
    type: 'string',
    description: 'Google Analytics measurement ID',
    example: 'G-XXXXXXXXXX',
    validation: (value) => value.startsWith('G-') || value.startsWith('UA-')
  },
  {
    key: 'SENTRY_DSN',
    required: false,
    type: 'url',
    description: 'Sentry error tracking DSN',
    example: 'https://xxxxx@sentry.io/xxxxx',
    sensitive: true,
    environments: ['production']
  },

  // File Storage
  {
    key: 'AWS_ACCESS_KEY_ID',
    required: false,
    type: 'string',
    description: 'AWS access key for S3 storage',
    example: 'AKIAIOSFODNN7EXAMPLE',
    sensitive: true
  },
  {
    key: 'AWS_SECRET_ACCESS_KEY',
    required: false,
    type: 'string',
    description: 'AWS secret key for S3 storage',
    example: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    sensitive: true
  },
  {
    key: 'AWS_REGION',
    required: false,
    type: 'string',
    description: 'AWS region for S3 storage',
    example: 'us-east-1',
    validation: (value) => /^[a-z]{2}-[a-z]+-\d{1}$/.test(value)
  },
  {
    key: 'S3_BUCKET_NAME',
    required: false,
    type: 'string',
    description: 'S3 bucket name for file storage',
    example: 'ideinstein-files'
  },

  // Development Only
  {
    key: 'SKIP_ENV_VALIDATION',
    required: false,
    type: 'boolean',
    description: 'Skip environment validation (development only)',
    example: 'false',
    environments: ['development']
  }
];

/**
 * Validate environment variables against schema
 */
export function validateEnvironment(
  env: Record<string, string | undefined> = process.env,
  targetEnv: string = process.env.NODE_ENV || 'development'
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const missing: string[] = [];
  const suggestions: EnvSuggestion[] = [];

  // Skip validation if explicitly disabled (development only)
  if (targetEnv === 'development' && env.SKIP_ENV_VALIDATION === 'true') {
    return {
      isValid: true,
      errors: [],
      warnings: [{
        key: 'SKIP_ENV_VALIDATION',
        message: 'Environment validation skipped for development',
        suggestion: 'Remove SKIP_ENV_VALIDATION in production'
      }],
      missing: [],
      suggestions: []
    };
  }

  for (const envVar of ENV_SCHEMA) {
    const value = env[envVar.key];
    
    // Check if variable is required for this environment
    const isRequiredForEnv = envVar.environments 
      ? envVar.environments.includes(targetEnv as any)
      : true;

    if (envVar.required && isRequiredForEnv && !value) {
      missing.push(envVar.key);
      errors.push({
        key: envVar.key,
        message: `Required environment variable ${envVar.key} is missing`,
        severity: 'error',
        suggestion: `Set ${envVar.key}=${envVar.example || 'your-value-here'}`
      });
      continue;
    }

    if (!value) continue;

    // Type validation
    const typeError = validateType(envVar.key, value, envVar.type);
    if (typeError) {
      errors.push(typeError);
    }

    // Custom validation
    if (envVar.validation && !envVar.validation(value)) {
      errors.push({
        key: envVar.key,
        message: `Invalid value for ${envVar.key}`,
        severity: 'error',
        suggestion: envVar.suggestions 
          ? `Try one of: ${envVar.suggestions.join(', ')}`
          : `Expected format: ${envVar.example}`
      });
    }

    // Environment-specific warnings
    if (targetEnv === 'production') {
      if (envVar.key === 'DATABASE_URL' && !value.includes('sslmode=require')) {
        warnings.push({
          key: envVar.key,
          message: 'Database URL should include SSL requirement for production',
          suggestion: 'Add ?sslmode=require to your DATABASE_URL'
        });
      }

      if (envVar.sensitive && value.length < 16) {
        warnings.push({
          key: envVar.key,
          message: `${envVar.key} appears to be too short for production use`,
          suggestion: 'Use a longer, more secure value for production'
        });
      }
    }
  }

  // Check for common misconfigurations
  if (targetEnv === 'production') {
    if (!env.NEXTAUTH_URL || env.NEXTAUTH_URL.includes('localhost')) {
      errors.push({
        key: 'NEXTAUTH_URL',
        message: 'NEXTAUTH_URL must be set to production domain',
        severity: 'error',
        suggestion: 'Set NEXTAUTH_URL to your production domain (e.g., https://yourdomain.com)'
      });
    }
  }

  // Generate suggestions for missing optional variables
  for (const envVar of ENV_SCHEMA) {
    if (!envVar.required && !env[envVar.key]) {
      const isRelevantForEnv = envVar.environments 
        ? envVar.environments.includes(targetEnv as any)
        : true;

      if (isRelevantForEnv) {
        suggestions.push({
          key: envVar.key,
          suggestion: `Consider setting ${envVar.key} for enhanced functionality`,
          reason: envVar.description
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missing,
    suggestions: suggestions.slice(0, 5) // Limit suggestions
  };
}

/**
 * Validate individual environment variable type
 */
function validateType(key: string, value: string, type: EnvVarDefinition['type']): ValidationError | null {
  switch (type) {
    case 'number':
      if (isNaN(Number(value))) {
        return {
          key,
          message: `${key} must be a valid number`,
          severity: 'error',
          suggestion: 'Provide a numeric value'
        };
      }
      break;

    case 'boolean':
      if (!['true', 'false', '1', '0'].includes(value.toLowerCase())) {
        return {
          key,
          message: `${key} must be a boolean value`,
          severity: 'error',
          suggestion: 'Use true, false, 1, or 0'
        };
      }
      break;

    case 'url':
      try {
        new URL(value);
      } catch {
        return {
          key,
          message: `${key} must be a valid URL`,
          severity: 'error',
          suggestion: 'Provide a complete URL including protocol (https://)'
        };
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return {
          key,
          message: `${key} must be a valid email address`,
          severity: 'error',
          suggestion: 'Provide a valid email address (user@domain.com)'
        };
      }
      break;

    case 'json':
      try {
        JSON.parse(value);
      } catch {
        return {
          key,
          message: `${key} must be valid JSON`,
          severity: 'error',
          suggestion: 'Provide a valid JSON string'
        };
      }
      break;
  }

  return null;
}

/**
 * Generate environment variable documentation
 */
export function generateEnvDocumentation(targetEnv?: string): string {
  const relevantVars = ENV_SCHEMA.filter(envVar => {
    if (!targetEnv) return true;
    return !envVar.environments || envVar.environments.includes(targetEnv as any);
  });

  let doc = `# Environment Variables${targetEnv ? ` (${targetEnv})` : ''}\n\n`;
  
  const required = relevantVars.filter(v => v.required);
  const optional = relevantVars.filter(v => !v.required);

  if (required.length > 0) {
    doc += '## Required Variables\n\n';
    for (const envVar of required) {
      doc += `### ${envVar.key}\n`;
      doc += `- **Description**: ${envVar.description}\n`;
      doc += `- **Type**: ${envVar.type}\n`;
      if (envVar.example && !envVar.sensitive) {
        doc += `- **Example**: \`${envVar.example}\`\n`;
      }
      if (envVar.suggestions) {
        doc += `- **Valid values**: ${envVar.suggestions.join(', ')}\n`;
      }
      doc += '\n';
    }
  }

  if (optional.length > 0) {
    doc += '## Optional Variables\n\n';
    for (const envVar of optional) {
      doc += `### ${envVar.key}\n`;
      doc += `- **Description**: ${envVar.description}\n`;
      doc += `- **Type**: ${envVar.type}\n`;
      if (envVar.example && !envVar.sensitive) {
        doc += `- **Example**: \`${envVar.example}\`\n`;
      }
      doc += '\n';
    }
  }

  return doc;
}

/**
 * Create .env.example file content
 */
export function generateEnvExample(targetEnv?: string): string {
  const relevantVars = ENV_SCHEMA.filter(envVar => {
    if (!targetEnv) return true;
    return !envVar.environments || envVar.environments.includes(targetEnv as any);
  });

  let content = `# Environment Variables${targetEnv ? ` - ${targetEnv.toUpperCase()}` : ''}\n`;
  content += `# Generated on ${new Date().toISOString()}\n\n`;

  const required = relevantVars.filter(v => v.required);
  const optional = relevantVars.filter(v => !v.required);

  if (required.length > 0) {
    content += '# Required Variables\n';
    for (const envVar of required) {
      content += `# ${envVar.description}\n`;
      if (envVar.sensitive) {
        content += `${envVar.key}=your-${envVar.key.toLowerCase().replace(/_/g, '-')}-here\n`;
      } else {
        content += `${envVar.key}=${envVar.example || 'your-value-here'}\n`;
      }
      content += '\n';
    }
  }

  if (optional.length > 0) {
    content += '# Optional Variables\n';
    for (const envVar of optional) {
      content += `# ${envVar.description}\n`;
      if (envVar.sensitive) {
        content += `# ${envVar.key}=your-${envVar.key.toLowerCase().replace(/_/g, '-')}-here\n`;
      } else {
        content += `# ${envVar.key}=${envVar.example || 'your-value-here'}\n`;
      }
      content += '\n';
    }
  }

  return content;
}
