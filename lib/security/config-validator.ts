/**
 * Configuration Validation System
 * Validates TypeScript, Next.js, and other configuration files for security
 */

import { readFile, access } from 'fs/promises';
import { join } from 'path';

export interface ConfigValidationResult {
  file: string;
  status: 'valid' | 'warning' | 'error';
  issues: ConfigIssue[];
  recommendations: string[];
}

export interface ConfigIssue {
  type: 'security' | 'performance' | 'compatibility' | 'best-practice';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  fix?: string;
  line?: number;
}

export interface ConfigValidationSummary {
  totalFiles: number;
  validFiles: number;
  filesWithWarnings: number;
  filesWithErrors: number;
  criticalIssues: number;
  highIssues: number;
  recommendations: string[];
}

/**
 * Validate TypeScript configuration
 */
async function validateTypeScriptConfig(): Promise<ConfigValidationResult> {
  const issues: ConfigIssue[] = [];
  const recommendations: string[] = [];
  
  try {
    const tsconfigContent = await readFile('tsconfig.json', 'utf-8');
    const tsconfig = JSON.parse(tsconfigContent);
    
    // Check strict mode
    if (!tsconfig.compilerOptions?.strict) {
      issues.push({
        type: 'security',
        severity: 'high',
        message: 'TypeScript strict mode is not enabled',
        fix: 'Set "strict": true in compilerOptions for better type safety'
      });
    } else {
      recommendations.push('✅ TypeScript strict mode is enabled');
    }
    
    // Check for proper module resolution
    if (tsconfig.compilerOptions?.moduleResolution !== 'node') {
      issues.push({
        type: 'compatibility',
        severity: 'medium',
        message: 'Module resolution should be set to "node"',
        fix: 'Set "moduleResolution": "node" in compilerOptions'
      });
    }
    
    // Check for isolated modules (required for Next.js)
    if (!tsconfig.compilerOptions?.isolatedModules) {
      issues.push({
        type: 'compatibility',
        severity: 'medium',
        message: 'isolatedModules should be enabled for Next.js compatibility',
        fix: 'Set "isolatedModules": true in compilerOptions'
      });
    }
    
    // Check for proper path mapping
    if (!tsconfig.compilerOptions?.paths?.['@/*']) {
      issues.push({
        type: 'best-practice',
        severity: 'low',
        message: 'Path mapping for "@/*" is not configured',
        fix: 'Add path mapping: "paths": { "@/*": ["./*"] }'
      });
    } else {
      recommendations.push('✅ Path mapping is configured');
    }
    
    // Check for proper exclusions
    const excludes = tsconfig.exclude || [];
    const requiredExcludes = ['node_modules', '_archive', 'backups'];
    const missingExcludes = requiredExcludes.filter(exc => 
      !excludes.some((e: string) => e.includes(exc))
    );
    
    if (missingExcludes.length > 0) {
      issues.push({
        type: 'performance',
        severity: 'low',
        message: `Missing exclusions: ${missingExcludes.join(', ')}`,
        fix: 'Add exclusions to prevent TypeScript from processing unnecessary files'
      });
    }
    
    // Check for Next.js plugin
    const plugins = tsconfig.compilerOptions?.plugins || [];
    if (!plugins.some((p: any) => p.name === 'next')) {
      issues.push({
        type: 'compatibility',
        severity: 'medium',
        message: 'Next.js TypeScript plugin is not configured',
        fix: 'Add Next.js plugin: "plugins": [{"name": "next"}]'
      });
    } else {
      recommendations.push('✅ Next.js TypeScript plugin is configured');
    }
    
  } catch (error) {
    issues.push({
      type: 'security',
      severity: 'critical',
      message: 'Cannot read or parse tsconfig.json',
      fix: 'Ensure tsconfig.json exists and is valid JSON'
    });
  }
  
  const status = issues.some(i => i.severity === 'critical' || i.severity === 'high') ? 'error' :
                issues.some(i => i.severity === 'medium') ? 'warning' : 'valid';
  
  return {
    file: 'tsconfig.json',
    status,
    issues,
    recommendations
  };
}

/**
 * Validate Next.js configuration
 */
async function validateNextJsConfig(): Promise<ConfigValidationResult> {
  const issues: ConfigIssue[] = [];
  const recommendations: string[] = [];
  
  try {
    const nextConfigContent = await readFile('next.config.js', 'utf-8');
    
    // Check for standalone output (required for serverless)
    if (!nextConfigContent.includes('output: \'standalone\'')) {
      issues.push({
        type: 'compatibility',
        severity: 'high',
        message: 'Standalone output is not configured',
        fix: 'Add "output: \'standalone\'" for serverless deployment compatibility'
      });
    } else {
      recommendations.push('✅ Standalone output is configured');
    }
    
    // Check for React strict mode
    if (!nextConfigContent.includes('reactStrictMode: true')) {
      issues.push({
        type: 'best-practice',
        severity: 'medium',
        message: 'React strict mode is not enabled',
        fix: 'Add "reactStrictMode: true" for better development experience'
      });
    } else {
      recommendations.push('✅ React strict mode is enabled');
    }
    
    // Check for security headers
    if (nextConfigContent.includes('async headers()')) {
      recommendations.push('✅ Security headers are configured');
    } else {
      issues.push({
        type: 'security',
        severity: 'medium',
        message: 'Security headers are not configured in Next.js config',
        fix: 'Add async headers() function with security headers'
      });
    }
    
    // Check for powered by header removal
    if (!nextConfigContent.includes('poweredByHeader: false')) {
      issues.push({
        type: 'security',
        severity: 'low',
        message: 'X-Powered-By header is not disabled',
        fix: 'Add "poweredByHeader: false" to hide framework information'
      });
    } else {
      recommendations.push('✅ X-Powered-By header is disabled');
    }
    
    // Check for compression
    if (!nextConfigContent.includes('compress: true')) {
      issues.push({
        type: 'performance',
        severity: 'low',
        message: 'Compression is not enabled',
        fix: 'Add "compress: true" for better performance'
      });
    } else {
      recommendations.push('✅ Compression is enabled');
    }
    
    // Check for experimental features that might be unstable
    if (nextConfigContent.includes('experimental:')) {
      issues.push({
        type: 'compatibility',
        severity: 'medium',
        message: 'Experimental features are enabled',
        fix: 'Review experimental features and disable if not needed for production'
      });
    }
    
    // Check for proper webpack configuration
    if (nextConfigContent.includes('webpack:')) {
      recommendations.push('✅ Custom webpack configuration detected');
    }
    
  } catch (error) {
    issues.push({
      type: 'security',
      severity: 'critical',
      message: 'Cannot read next.config.js',
      fix: 'Ensure next.config.js exists and is valid JavaScript'
    });
  }
  
  const status = issues.some(i => i.severity === 'critical' || i.severity === 'high') ? 'error' :
                issues.some(i => i.severity === 'medium') ? 'warning' : 'valid';
  
  return {
    file: 'next.config.js',
    status,
    issues,
    recommendations
  };
}

/**
 * Validate package.json configuration
 */
async function validatePackageJson(): Promise<ConfigValidationResult> {
  const issues: ConfigIssue[] = [];
  const recommendations: string[] = [];
  
  try {
    const packageContent = await readFile('package.json', 'utf-8');
    const packageJson = JSON.parse(packageContent);
    
    // Check for security scripts
    const scripts = packageJson.scripts || {};
    const securityScripts = [
      'security:audit',
      'dependency:scan',
      'type-check',
      'lint'
    ];
    
    const missingSecurityScripts = securityScripts.filter(script => !scripts[script]);
    if (missingSecurityScripts.length > 0) {
      issues.push({
        type: 'security',
        severity: 'medium',
        message: `Missing security scripts: ${missingSecurityScripts.join(', ')}`,
        fix: 'Add security-related npm scripts for automated checks'
      });
    } else {
      recommendations.push('✅ Security scripts are configured');
    }
    
    // Check for Node.js version specification
    if (!packageJson.engines?.node) {
      issues.push({
        type: 'compatibility',
        severity: 'medium',
        message: 'Node.js version is not specified',
        fix: 'Add "engines": {"node": ">=18.0.0"} to specify Node.js version'
      });
    } else {
      const nodeVersion = packageJson.engines.node;
      if (nodeVersion.includes('14') || nodeVersion.includes('16')) {
        issues.push({
          type: 'security',
          severity: 'medium',
          message: 'Node.js version is outdated',
          fix: 'Update to Node.js 18+ for latest security patches'
        });
      } else {
        recommendations.push('✅ Node.js version is specified and current');
      }
    }
    
    // Check for type field
    if (packageJson.type !== 'module' && !packageJson.type) {
      recommendations.push('✅ Using CommonJS (default)');
    }
    
    // Check for security-related dependencies
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const securityDeps = ['zod', 'bcryptjs', 'helmet'];
    const hasSecurityDeps = securityDeps.some(dep => dependencies[dep]);
    
    if (hasSecurityDeps) {
      recommendations.push('✅ Security-related dependencies detected');
    }
    
    // Check for development dependencies in production
    if (packageJson.dependencies && Object.keys(packageJson.dependencies).some(dep => 
      dep.includes('test') || dep.includes('dev') || dep === 'nodemon'
    )) {
      issues.push({
        type: 'performance',
        severity: 'low',
        message: 'Development dependencies may be in production dependencies',
        fix: 'Move development-only packages to devDependencies'
      });
    }
    
  } catch (error) {
    issues.push({
      type: 'security',
      severity: 'critical',
      message: 'Cannot read or parse package.json',
      fix: 'Ensure package.json exists and is valid JSON'
    });
  }
  
  const status = issues.some(i => i.severity === 'critical' || i.severity === 'high') ? 'error' :
                issues.some(i => i.severity === 'medium') ? 'warning' : 'valid';
  
  return {
    file: 'package.json',
    status,
    issues,
    recommendations
  };
}

/**
 * Validate environment configuration
 */
async function validateEnvironmentConfig(): Promise<ConfigValidationResult> {
  const issues: ConfigIssue[] = [];
  const recommendations: string[] = [];
  
  try {
    // Check for .env.example
    await access('.env.example');
    const envExampleContent = await readFile('.env.example', 'utf-8');
    
    // Check for required security variables
    const requiredSecurityVars = [
      'ADMIN_PASSWORD',
      'NEXTAUTH_SECRET',
      'FORM_HMAC_SECRET'
    ];
    
    const missingVars = requiredSecurityVars.filter(varName => 
      !envExampleContent.includes(varName)
    );
    
    if (missingVars.length > 0) {
      issues.push({
        type: 'security',
        severity: 'high',
        message: `Missing security environment variables in .env.example: ${missingVars.join(', ')}`,
        fix: 'Add all required security environment variables to .env.example'
      });
    } else {
      recommendations.push('✅ Required security environment variables are documented');
    }
    
    // Check for production environment template
    try {
      await access('.env.production');
      recommendations.push('✅ Production environment template exists');
    } catch {
      issues.push({
        type: 'best-practice',
        severity: 'low',
        message: 'Production environment template (.env.production) not found',
        fix: 'Create .env.production template for production deployment'
      });
    }
    
  } catch (error) {
    issues.push({
      type: 'best-practice',
      severity: 'medium',
      message: 'Environment example file (.env.example) not found',
      fix: 'Create .env.example to document required environment variables'
    });
  }
  
  const status = issues.some(i => i.severity === 'critical' || i.severity === 'high') ? 'error' :
                issues.some(i => i.severity === 'medium') ? 'warning' : 'valid';
  
  return {
    file: '.env.example',
    status,
    issues,
    recommendations
  };
}

/**
 * Run comprehensive configuration validation
 */
export async function validateConfigurations(): Promise<{
  results: ConfigValidationResult[];
  summary: ConfigValidationSummary;
}> {
  console.log('🔧 Running comprehensive configuration validation...');
  
  const results: ConfigValidationResult[] = [];
  
  // Run all validations
  results.push(await validateTypeScriptConfig());
  results.push(await validateNextJsConfig());
  results.push(await validatePackageJson());
  results.push(await validateEnvironmentConfig());
  
  // Calculate summary
  const totalFiles = results.length;
  const validFiles = results.filter(r => r.status === 'valid').length;
  const filesWithWarnings = results.filter(r => r.status === 'warning').length;
  const filesWithErrors = results.filter(r => r.status === 'error').length;
  
  const allIssues = results.flatMap(r => r.issues);
  const criticalIssues = allIssues.filter(i => i.severity === 'critical').length;
  const highIssues = allIssues.filter(i => i.severity === 'high').length;
  
  const allRecommendations = results.flatMap(r => r.recommendations);
  
  const summary: ConfigValidationSummary = {
    totalFiles,
    validFiles,
    filesWithWarnings,
    filesWithErrors,
    criticalIssues,
    highIssues,
    recommendations: allRecommendations
  };
  
  console.log(`✅ Configuration validation completed: ${validFiles}/${totalFiles} files valid`);
  
  return { results, summary };
}

/**
 * Get configuration validation status for security dashboard
 */
export function getConfigValidationStatus(summary: ConfigValidationSummary): {
  status: 'secure' | 'needs_attention' | 'critical';
  message: string;
  score: number;
} {
  if (summary.criticalIssues > 0) {
    return {
      status: 'critical',
      message: `${summary.criticalIssues} critical configuration issues found`,
      score: 0
    };
  }
  
  if (summary.highIssues > 0 || summary.filesWithErrors > 0) {
    return {
      status: 'needs_attention',
      message: `${summary.highIssues} high priority issues in ${summary.filesWithErrors} files`,
      score: 50
    };
  }
  
  if (summary.filesWithWarnings > 0) {
    const score = Math.round((summary.validFiles / summary.totalFiles) * 100);
    return {
      status: 'needs_attention',
      message: `${summary.filesWithWarnings} files have warnings`,
      score
    };
  }
  
  return {
    status: 'secure',
    message: 'All configuration files are properly configured',
    score: 100
  };
}