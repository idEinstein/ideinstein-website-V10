/**
 * Vercel Deployment Configuration System
 * Manages Vercel project configuration and environment synchronization
 */

export interface VercelProjectConfig {
  name: string;
  framework: string;
  buildCommand?: string;
  outputDirectory?: string;
  installCommand?: string;
  devCommand?: string;
  environmentVariables: VercelEnvironmentVariable[];
  domains?: string[];
  functions?: Record<string, VercelFunctionConfig>;
  redirects?: VercelRedirect[];
  headers?: VercelHeader[];
  rewrites?: VercelRewrite[];
}

export interface VercelEnvironmentVariable {
  key: string;
  value: string;
  target: ('production' | 'preview' | 'development')[];
  type: 'plain' | 'secret' | 'system';
  gitBranch?: string;
}

export interface VercelFunctionConfig {
  runtime?: string;
  memory?: number;
  maxDuration?: number;
  regions?: string[];
}

export interface VercelRedirect {
  source: string;
  destination: string;
  permanent: boolean;
  statusCode?: number;
}

export interface VercelHeader {
  source: string;
  headers: Array<{
    key: string;
    value: string;
  }>;
}

export interface VercelRewrite {
  source: string;
  destination: string;
}

export interface VercelDeploymentConfig {
  project: VercelProjectConfig;
  vercelJson: any;
  packageJson: any;
  environmentFiles: Record<string, string>;
}

/**
 * Generate Vercel project configuration for IdEinstein
 */
export function generateVercelProjectConfig(
  projectName: string = 'ideinstein-website',
  customDomains: string[] = []
): VercelProjectConfig {
  return {
    name: projectName,
    framework: 'nextjs',
    buildCommand: 'npm run build',
    outputDirectory: '.next',
    installCommand: 'npm ci',
    devCommand: 'npm run dev',
    environmentVariables: generateEnvironmentVariables(),
    domains: customDomains,
    functions: {
      'app/api/**': {
        runtime: 'nodejs18.x',
        memory: 1024,
        maxDuration: 30,
        regions: ['iad1', 'fra1'] // US East and Europe
      }
    },
    redirects: [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false
      }
    ],
    headers: [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=()'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate'
          }
        ]
      }
    ],
    rewrites: [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      },
      {
        source: '/robots.txt',
        destination: '/api/robots'
      }
    ]
  };
}

/**
 * Generate environment variables configuration for Vercel
 */
function generateEnvironmentVariables(): VercelEnvironmentVariable[] {
  const envVars: VercelEnvironmentVariable[] = [
    // Core Application
    {
      key: 'NODE_ENV',
      value: 'production',
      target: ['production'],
      type: 'plain'
    },
    {
      key: 'NODE_ENV',
      value: 'preview',
      target: ['preview'],
      type: 'plain'
    },
    {
      key: 'NEXTAUTH_URL',
      value: 'https://your-domain.com',
      target: ['production'],
      type: 'plain'
    },
    {
      key: 'NEXTAUTH_SECRET',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },

    // Database
    {
      key: 'DATABASE_URL',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'DIRECT_URL',
      value: '', // To be set manually
      target: ['production'],
      type: 'secret'
    },

    // Zoho Integration
    {
      key: 'ZOHO_CLIENT_ID',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'plain'
    },
    {
      key: 'ZOHO_CLIENT_SECRET',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'ZOHO_CRM_REFRESH',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'ZOHO_BOOKINGS_REFRESH',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'ZOHO_WORKDRIVE_REFRESH',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'ZOHO_CAMPAIGNS_REFRESH',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'ZOHO_REGION',
      value: 'com',
      target: ['production', 'preview'],
      type: 'plain'
    },

    // Email Configuration
    {
      key: 'SMTP_HOST',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'plain'
    },
    {
      key: 'SMTP_PORT',
      value: '587',
      target: ['production', 'preview'],
      type: 'plain'
    },
    {
      key: 'SMTP_USER',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'plain'
    },
    {
      key: 'SMTP_PASS',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'FROM_EMAIL',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'plain'
    },

    // Security
    {
      key: 'ENCRYPTION_KEY',
      value: '', // To be set manually
      target: ['production'],
      type: 'secret'
    },
    {
      key: 'ADMIN_PASSWORD',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'FORM_HMAC_SECRET',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'NEXT_PUBLIC_HMAC_SECRET',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'plain'
    },
    {
      key: 'RATE_PER_MIN',
      value: '60',
      target: ['production', 'preview'],
      type: 'plain'
    },
    {
      key: 'RATE_LIMIT_REDIS_URL',
      value: '', // To be set manually
      target: ['production'],
      type: 'secret'
    },

    // GitHub Integration
    {
      key: 'GITHUB_CLIENT_ID',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'plain'
    },
    {
      key: 'GITHUB_CLIENT_SECRET',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'GITHUB_WEBHOOK_SECRET',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'GITHUB_TOKEN',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },

    // Vercel Integration
    {
      key: 'VERCEL_TOKEN',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'VERCEL_TEAM_ID',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'plain'
    },
    {
      key: 'VERCEL_PROJECT_ID',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'plain'
    },
    {
      key: 'VERCEL_ORG_ID',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'plain'
    },

    // Analytics & Monitoring
    {
      key: 'GOOGLE_ANALYTICS_ID',
      value: '', // To be set manually
      target: ['production'],
      type: 'plain'
    },
    {
      key: 'SENTRY_DSN',
      value: '', // To be set manually
      target: ['production'],
      type: 'secret'
    },

    // AWS S3 (Optional)
    {
      key: 'AWS_ACCESS_KEY_ID',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'AWS_SECRET_ACCESS_KEY',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'secret'
    },
    {
      key: 'AWS_REGION',
      value: 'us-east-1',
      target: ['production', 'preview'],
      type: 'plain'
    },
    {
      key: 'S3_BUCKET_NAME',
      value: '', // To be set manually
      target: ['production', 'preview'],
      type: 'plain'
    }
  ];

  return envVars;
}

/**
 * Generate vercel.json configuration
 */
export function generateVercelJson(config: VercelProjectConfig): any {
  return {
    version: 2,
    framework: config.framework,
    buildCommand: config.buildCommand,
    outputDirectory: config.outputDirectory,
    installCommand: config.installCommand,
    devCommand: config.devCommand,
    functions: config.functions,
    redirects: config.redirects,
    headers: config.headers,
    rewrites: config.rewrites,
    regions: ['iad1', 'fra1'], // US East and Europe for better global performance
    env: config.environmentVariables
      .filter(env => env.target.includes('production'))
      .reduce((acc, env) => {
        acc[env.key] = env.value;
        return acc;
      }, {} as Record<string, string>),
    build: {
      env: {
        NODE_ENV: 'production'
      }
    },
    crons: [
      {
        path: '/api/cron/cleanup',
        schedule: '0 2 * * *' // Daily at 2 AM UTC
      },
      {
        path: '/api/cron/health-check',
        schedule: '*/5 * * * *' // Every 5 minutes
      }
    ]
  };
}

/**
 * Generate deployment-specific package.json modifications
 */
export function generateDeploymentPackageJson(): any {
  return {
    scripts: {
      'vercel-build': 'npm run validate-env:prod && npm run build',
      'postinstall': 'prisma generate'
    },
    engines: {
      node: '>=18.0.0',
      npm: '>=8.0.0'
    }
  };
}

/**
 * Generate environment files for different deployment targets
 */
export function generateEnvironmentFiles(config: VercelProjectConfig): Record<string, string> {
  const files: Record<string, string> = {};

  // Production environment template
  files['.env.production.template'] = generateEnvFileContent(
    config.environmentVariables.filter(env => env.target.includes('production')),
    'production'
  );

  // Preview environment template
  files['.env.preview.template'] = generateEnvFileContent(
    config.environmentVariables.filter(env => env.target.includes('preview')),
    'preview'
  );

  // Vercel environment variables import format
  files['vercel-env-import.json'] = JSON.stringify(
    config.environmentVariables.map(env => ({
      key: env.key,
      value: env.value || `[SET_${env.key}_VALUE]`,
      target: env.target,
      type: env.type,
      gitBranch: env.gitBranch
    })),
    null,
    2
  );

  return files;
}

/**
 * Generate environment file content
 */
function generateEnvFileContent(
  envVars: VercelEnvironmentVariable[],
  environment: string
): string {
  let content = `# Environment Variables - ${environment.toUpperCase()}\n`;
  content += `# Generated for Vercel deployment\n`;
  content += `# Copy this file to .env.${environment} and fill in the values\n\n`;

  const requiredVars = envVars.filter(env => env.value === '' || env.value.startsWith('[SET_'));
  const configuredVars = envVars.filter(env => env.value !== '' && !env.value.startsWith('[SET_'));

  if (requiredVars.length > 0) {
    content += '# Required Variables (must be set)\n';
    requiredVars.forEach(env => {
      content += `${env.key}=${env.value || `your-${env.key.toLowerCase().replace(/_/g, '-')}-here`}\n`;
    });
    content += '\n';
  }

  if (configuredVars.length > 0) {
    content += '# Pre-configured Variables\n';
    configuredVars.forEach(env => {
      content += `${env.key}=${env.value}\n`;
    });
    content += '\n';
  }

  return content;
}

/**
 * Validate Vercel deployment configuration
 */
export function validateVercelConfig(config: VercelProjectConfig): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate project name
  if (!config.name || config.name.length < 3) {
    errors.push('Project name must be at least 3 characters long');
  }

  if (!/^[a-z0-9-]+$/.test(config.name)) {
    errors.push('Project name can only contain lowercase letters, numbers, and hyphens');
  }

  // Validate environment variables
  const requiredEnvVars = [
    'NEXTAUTH_SECRET',
    'DATABASE_URL',
    'ZOHO_CLIENT_ID',
    'ZOHO_CLIENT_SECRET',
    'ZOHO_CRM_REFRESH',
    'FORM_HMAC_SECRET',
    'ADMIN_PASSWORD',
    'ENCRYPTION_KEY'
  ];

  requiredEnvVars.forEach(key => {
    const envVar = config.environmentVariables.find(env => env.key === key);
    if (!envVar) {
      errors.push(`Missing required environment variable: ${key}`);
    } else if (!envVar.value || envVar.value === '') {
      warnings.push(`Environment variable ${key} is not set`);
    }
  });

  // Validate domains
  if (config.domains) {
    config.domains.forEach(domain => {
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
        errors.push(`Invalid domain format: ${domain}`);
      }
    });
  }

  // Validate function configurations
  if (config.functions) {
    Object.entries(config.functions).forEach(([path, funcConfig]) => {
      if (funcConfig.memory && (funcConfig.memory < 128 || funcConfig.memory > 3008)) {
        errors.push(`Invalid memory configuration for ${path}: must be between 128MB and 3008MB`);
      }
      if (funcConfig.maxDuration && (funcConfig.maxDuration < 1 || funcConfig.maxDuration > 900)) {
        errors.push(`Invalid maxDuration for ${path}: must be between 1 and 900 seconds`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generate complete Vercel deployment configuration
 */
export function generateCompleteVercelConfig(
  projectName: string = 'ideinstein-website',
  customDomains: string[] = []
): VercelDeploymentConfig {
  const projectConfig = generateVercelProjectConfig(projectName, customDomains);
  
  return {
    project: projectConfig,
    vercelJson: generateVercelJson(projectConfig),
    packageJson: generateDeploymentPackageJson(),
    environmentFiles: generateEnvironmentFiles(projectConfig)
  };
}
