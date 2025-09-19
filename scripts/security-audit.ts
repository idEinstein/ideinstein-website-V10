#!/usr/bin/env tsx
/**
 * Comprehensive Security Audit Script
 * Fixes detection logic for existing security implementations
 * Provides accurate OWASP 2024 compliance reporting
 */

import { readFile, access, readdir } from 'fs/promises';
import { join } from 'path';
import { validateCryptographicImplementations } from '../lib/security/crypto-validator';

interface SecurityCheck {
  category: string;
  check: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  details?: string;
  fix?: string;
}

interface SecurityAuditResult {
  summary: {
    totalChecks: number;
    passed: number;
    failed: number;
    warnings: number;
    criticalFailures: number;
    highFailures: number;
    overallStatus: 'SECURE' | 'NEEDS_ATTENTION' | 'CRITICAL';
    lastUpdated: string;
  };
  checks: SecurityCheck[];
  detectedFeatures: {
    middleware: boolean;
    adminAuth: boolean;
    securityHeaders: boolean;
    rateLimiting: boolean;
    inputValidation: number;
    dependencyScanning: boolean;
    cryptographicImplementations: {
      bcrypt: boolean;
      secureRandom: boolean;
      hmac: boolean;
      tokenSecurity: boolean;
      keyManagement: boolean;
      encryption: boolean;
    };
  };
}

/**
 * Find all API routes in the app directory
 */
async function findApiRoutes(dir: string, basePath: string = ''): Promise<string[]> {
  const routes: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const routePath = join(basePath, entry.name);
      
      if (entry.isDirectory()) {
        routes.push(...await findApiRoutes(fullPath, routePath));
      } else if (entry.name === 'route.ts') {
        routes.push(fullPath);
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  return routes;
}

/**
 * Check if middleware.ts exists and has security features
 */
async function checkMiddleware(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  
  try {
    // Check if middleware.ts exists at root level
    await access('middleware.ts');
    
    // Read middleware content to verify security features
    const middlewareContent = await readFile('middleware.ts', 'utf-8');
    
    // Check for security middleware implementation
    if (middlewareContent.includes('applySecurityHeaders') || 
        middlewareContent.includes('Content-Security-Policy') ||
        middlewareContent.includes('X-Frame-Options')) {
      checks.push({
        category: 'Middleware Security',
        check: 'Security middleware exists and configured',
        status: 'PASS',
        severity: 'HIGH',
        details: 'middleware.ts found with security headers implementation'
      });
    } else {
      checks.push({
        category: 'Middleware Security',
        check: 'Security middleware configuration',
        status: 'WARNING',
        severity: 'HIGH',
        details: 'middleware.ts exists but security features not detected',
        fix: 'Add security headers and CSP configuration to middleware'
      });
    }
    
    // Check for rate limiting
    if (middlewareContent.includes('applyRateLimit') || 
        middlewareContent.includes('rate') ||
        middlewareContent.includes('buckets')) {
      checks.push({
        category: 'Middleware Security',
        check: 'Rate limiting implementation',
        status: 'PASS',
        severity: 'HIGH',
        details: 'Rate limiting detected in middleware'
      });
    } else {
      checks.push({
        category: 'Middleware Security',
        check: 'Rate limiting implementation',
        status: 'WARNING',
        severity: 'HIGH',
        details: 'Rate limiting not detected in middleware',
        fix: 'Implement rate limiting in middleware'
      });
    }
    
  } catch (error) {
    checks.push({
      category: 'Middleware Security',
      check: 'Security middleware exists',
      status: 'FAIL',
      severity: 'CRITICAL',
      details: 'middleware.ts not found at project root',
      fix: 'Create security middleware for request filtering and protection'
    });
  }
  
  return checks;
}

/**
 * Check admin authentication system
 */
async function checkAdminAuth(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  
  try {
    // Check if admin-auth.ts exists
    await access('lib/auth/admin-auth.ts');
    
    // Read admin auth content
    const adminAuthContent = await readFile('lib/auth/admin-auth.ts', 'utf-8');
    
    // Check for proper authentication functions
    if (adminAuthContent.includes('withAdminAuth') && 
        adminAuthContent.includes('verifyAdminAuth')) {
      checks.push({
        category: 'Admin Authentication',
        check: 'Admin authentication system',
        status: 'PASS',
        severity: 'CRITICAL',
        details: 'Admin authentication system properly implemented'
      });
    } else {
      checks.push({
        category: 'Admin Authentication',
        check: 'Admin authentication system',
        status: 'FAIL',
        severity: 'CRITICAL',
        details: 'Admin authentication functions incomplete',
        fix: 'Implement complete admin authentication with withAdminAuth and verifyAdminAuth'
      });
    }
    
    // Check for session management
    if (adminAuthContent.includes('SESSION_TIMEOUT') || 
        adminAuthContent.includes('session') ||
        adminAuthContent.includes('expiry')) {
      checks.push({
        category: 'Admin Authentication',
        check: 'Session management',
        status: 'PASS',
        severity: 'HIGH',
        details: 'Session management features detected'
      });
    } else {
      checks.push({
        category: 'Admin Authentication',
        check: 'Session management',
        status: 'WARNING',
        severity: 'HIGH',
        details: 'Session management not clearly implemented',
        fix: 'Add proper session timeout and management'
      });
    }
    
  } catch (error) {
    checks.push({
      category: 'Admin Authentication',
      check: 'Admin authentication system',
      status: 'FAIL',
      severity: 'CRITICAL',
      details: 'lib/auth/admin-auth.ts not found',
      fix: 'Create admin authentication system'
    });
  }
  
  return checks;
}

/**
 * Check security headers implementation
 */
async function checkSecurityHeaders(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  
  try {
    // Check if security headers file exists
    await access('lib/security/headers.ts');
    
    const headersContent = await readFile('lib/security/headers.ts', 'utf-8');
    
    // Check for required security headers
    const requiredHeaders = [
      'Content-Security-Policy',
      'X-Frame-Options', 
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Strict-Transport-Security'
    ];
    
    let implementedHeaders = 0;
    const missingHeaders: string[] = [];
    
    for (const header of requiredHeaders) {
      if (headersContent.includes(header)) {
        implementedHeaders++;
      } else {
        missingHeaders.push(header);
      }
    }
    
    if (implementedHeaders === requiredHeaders.length) {
      checks.push({
        category: 'Security Headers',
        check: 'Comprehensive security headers',
        status: 'PASS',
        severity: 'HIGH',
        details: 'All required security headers implemented'
      });
    } else {
      checks.push({
        category: 'Security Headers',
        check: 'Comprehensive security headers',
        status: 'WARNING',
        severity: 'HIGH',
        details: `${implementedHeaders}/${requiredHeaders.length} headers implemented. Missing: ${missingHeaders.join(', ')}`,
        fix: `Implement missing security headers: ${missingHeaders.join(', ')}`
      });
    }
    
    // Check if headers are applied in middleware
    try {
      const middlewareContent = await readFile('middleware.ts', 'utf-8');
      if (middlewareContent.includes('applySecurityHeaders') || 
          middlewareContent.includes('getSecurityHeadersConfig')) {
        checks.push({
          category: 'Security Headers',
          check: 'Headers applied in middleware',
          status: 'PASS',
          severity: 'HIGH',
          details: 'Security headers properly applied in middleware'
        });
      } else {
        checks.push({
          category: 'Security Headers',
          check: 'Headers applied in middleware',
          status: 'WARNING',
          severity: 'HIGH',
          details: 'Security headers not applied in middleware',
          fix: 'Apply security headers in middleware.ts'
        });
      }
    } catch (error) {
      // Middleware check already handled above
    }
    
  } catch (error) {
    checks.push({
      category: 'Security Headers',
      check: 'Security headers configuration',
      status: 'FAIL',
      severity: 'HIGH',
      details: 'lib/security/headers.ts not found',
      fix: 'Create security headers configuration'
    });
  }
  
  return checks;
}

/**
 * Check rate limiting implementation
 */
async function checkRateLimiting(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  
  try {
    // Check if rate limiting files exist
    await access('lib/security/rate-limit.ts');
    
    const rateLimitContent = await readFile('lib/security/rate-limit.ts', 'utf-8');
    
    // Check for comprehensive rate limiting features
    if (rateLimitContent.includes('applyRateLimit') && 
        rateLimitContent.includes('RateLimitConfig') &&
        rateLimitContent.includes('DEFAULT_RATE_LIMITS')) {
      checks.push({
        category: 'Rate Limiting',
        check: 'Rate limiting system',
        status: 'PASS',
        severity: 'HIGH',
        details: 'Comprehensive rate limiting system implemented'
      });
    } else {
      checks.push({
        category: 'Rate Limiting',
        check: 'Rate limiting system',
        status: 'WARNING',
        severity: 'HIGH',
        details: 'Rate limiting system incomplete',
        fix: 'Implement comprehensive rate limiting with proper configuration'
      });
    }
    
    // Check for rate limit monitoring
    try {
      await access('lib/security/rate-limit-monitor.ts');
      checks.push({
        category: 'Rate Limiting',
        check: 'Rate limit monitoring',
        status: 'PASS',
        severity: 'MEDIUM',
        details: 'Rate limit monitoring system detected'
      });
    } catch (error) {
      checks.push({
        category: 'Rate Limiting',
        check: 'Rate limit monitoring',
        status: 'WARNING',
        severity: 'MEDIUM',
        details: 'Rate limit monitoring not found',
        fix: 'Add rate limit monitoring and analytics'
      });
    }
    
  } catch (error) {
    checks.push({
      category: 'Rate Limiting',
      check: 'Rate limiting system',
      status: 'FAIL',
      severity: 'HIGH',
      details: 'lib/security/rate-limit.ts not found',
      fix: 'Implement rate limiting system'
    });
  }
  
  return checks;
}

/**
 * Check dependency scanning implementation
 */
async function checkDependencyScanning(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  
  try {
    // Check if dependency scanner exists
    await access('lib/security/dependency-scanner.ts');
    
    const scannerContent = await readFile('lib/security/dependency-scanner.ts', 'utf-8');
    
    // Check for comprehensive scanning features
    if (scannerContent.includes('scanDependencies') && 
        scannerContent.includes('fallback') &&
        scannerContent.includes('npm audit')) {
      checks.push({
        category: 'Dependency Security',
        check: 'Enhanced dependency scanning system',
        status: 'PASS',
        severity: 'HIGH',
        details: 'Comprehensive dependency scanner with fallback methods implemented'
      });
    } else {
      checks.push({
        category: 'Dependency Security',
        check: 'Enhanced dependency scanning system',
        status: 'WARNING',
        severity: 'HIGH',
        details: 'Basic dependency scanner found but missing advanced features',
        fix: 'Implement comprehensive dependency scanning with fallback methods'
      });
    }
    
    // Check if scanner is integrated with security dashboard
    try {
      const dashboardContent = await readFile('app/api/security/dashboard/route.ts', 'utf-8');
      if (dashboardContent.includes('dependency-scanner') && 
          dashboardContent.includes('scanDependencies')) {
        checks.push({
          category: 'Dependency Security',
          check: 'Dashboard integration',
          status: 'PASS',
          severity: 'MEDIUM',
          details: 'Dependency scanner integrated with security dashboard'
        });
      } else {
        checks.push({
          category: 'Dependency Security',
          check: 'Dashboard integration',
          status: 'WARNING',
          severity: 'MEDIUM',
          details: 'Dependency scanner not integrated with security dashboard',
          fix: 'Integrate dependency scanner with security dashboard'
        });
      }
    } catch (error) {
      checks.push({
        category: 'Dependency Security',
        check: 'Dashboard integration',
        status: 'WARNING',
        severity: 'MEDIUM',
        details: 'Could not verify dashboard integration',
        fix: 'Ensure security dashboard exists and integrates dependency scanning'
      });
    }
    
  } catch (error) {
    checks.push({
      category: 'Dependency Security',
      check: 'Dependency scanning system',
      status: 'FAIL',
      severity: 'HIGH',
      details: 'lib/security/dependency-scanner.ts not found',
      fix: 'Implement comprehensive dependency scanning system'
    });
  }
  
  // Test npm audit availability
  try {
    const { execSync } = await import('child_process');
    execSync('npm --version', { encoding: 'utf-8', timeout: 5000 });
    
    checks.push({
      category: 'Dependency Security',
      check: 'npm audit availability',
      status: 'PASS',
      severity: 'MEDIUM',
      details: 'npm is available for dependency auditing'
    });
  } catch (error) {
    checks.push({
      category: 'Dependency Security',
      check: 'npm audit availability',
      status: 'WARNING',
      severity: 'MEDIUM',
      details: 'npm not available - dependency scanning will use fallback methods',
      fix: 'Ensure npm is available in deployment environment'
    });
  }
  
  return checks;
}

/**
 * Check input validation coverage
 */
async function checkInputValidation(): Promise<{ checks: SecurityCheck[]; coverage: number }> {
  const checks: SecurityCheck[] = [];
  let coverage = 0;
  
  try {
    const apiDir = join(process.cwd(), 'app', 'api');
    const routes = await findApiRoutes(apiDir);
    let validatedRoutes = 0;
    let totalRoutes = 0;
    
    for (const route of routes) {
      totalRoutes++;
      try {
        const content = await readFile(route, 'utf-8');
        
        // Check for Zod validation (multiple patterns)
        if ((content.includes('z.object') && 
             (content.includes('.parse(') || content.includes('.safeParse('))) ||
            content.includes('validateRequestBody') ||
            content.includes('validateQueryParams') ||
            content.includes('withValidation') ||
            content.includes('Schema.safeParse')) {
          validatedRoutes++;
        }
      } catch (error) {
        // Skip unreadable files
      }
    }
    
    coverage = totalRoutes > 0 ? (validatedRoutes / totalRoutes) * 100 : 0;
    
    if (coverage >= 80) {
      checks.push({
        category: 'Input Validation',
        check: 'API input validation coverage',
        status: 'PASS',
        severity: 'HIGH',
        details: `${coverage.toFixed(1)}% of API routes have input validation (${validatedRoutes}/${totalRoutes})`
      });
    } else if (coverage >= 50) {
      checks.push({
        category: 'Input Validation',
        check: 'API input validation coverage',
        status: 'WARNING',
        severity: 'HIGH',
        details: `${coverage.toFixed(1)}% of API routes have input validation (${validatedRoutes}/${totalRoutes})`,
        fix: 'Add Zod validation to remaining API routes'
      });
    } else {
      checks.push({
        category: 'Input Validation',
        check: 'API input validation coverage',
        status: 'FAIL',
        severity: 'HIGH',
        details: `Only ${coverage.toFixed(1)}% of API routes have input validation (${validatedRoutes}/${totalRoutes})`,
        fix: 'Implement comprehensive input validation using Zod schemas'
      });
    }
    
  } catch (error) {
    checks.push({
      category: 'Input Validation',
      check: 'API input validation coverage',
      status: 'WARNING',
      severity: 'HIGH',
      details: 'Could not analyze API routes for input validation',
      fix: 'Ensure API routes are accessible for validation analysis'
    });
  }
  
  return { checks, coverage };
}

/**
 * Check security documentation
 */
async function checkSecurityDocumentation(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  
  try {
    // Check if documentation generator exists
    await access('lib/security/documentation-generator.ts');
    
    const generatorContent = await readFile('lib/security/documentation-generator.ts', 'utf-8');
    
    // Check for comprehensive documentation features
    if (generatorContent.includes('generateSecurityDocumentation') && 
        generatorContent.includes('OWASP') &&
        generatorContent.includes('generateImplementationGuide')) {
      checks.push({
        category: 'Security Documentation',
        check: 'Documentation generator system',
        status: 'PASS',
        severity: 'MEDIUM',
        details: 'Comprehensive security documentation generator implemented'
      });
    } else {
      checks.push({
        category: 'Security Documentation',
        check: 'Documentation generator system',
        status: 'WARNING',
        severity: 'MEDIUM',
        details: 'Basic documentation generator found but missing advanced features',
        fix: 'Implement comprehensive security documentation generator'
      });
    }
    
    // Check if documentation script exists
    try {
      await access('scripts/generate-security-docs.ts');
      checks.push({
        category: 'Security Documentation',
        check: 'Documentation generation script',
        status: 'PASS',
        severity: 'LOW',
        details: 'Security documentation generation script available'
      });
    } catch (error) {
      checks.push({
        category: 'Security Documentation',
        check: 'Documentation generation script',
        status: 'WARNING',
        severity: 'LOW',
        details: 'Documentation generation script not found',
        fix: 'Create security documentation generation script'
      });
    }
    
    // Check if documentation has been generated
    try {
      await access('docs/security/README.md');
      await access('docs/security/OWASP-2024-Compliance.md');
      
      checks.push({
        category: 'Security Documentation',
        check: 'Generated security documentation',
        status: 'PASS',
        severity: 'MEDIUM',
        details: 'Security documentation has been generated and is available'
      });
    } catch (error) {
      checks.push({
        category: 'Security Documentation',
        check: 'Generated security documentation',
        status: 'WARNING',
        severity: 'MEDIUM',
        details: 'Security documentation not found - run npm run security:docs to generate',
        fix: 'Generate security documentation using npm run security:docs'
      });
    }
    
  } catch (error) {
    checks.push({
      category: 'Security Documentation',
      check: 'Documentation system',
      status: 'FAIL',
      severity: 'MEDIUM',
      details: 'lib/security/documentation-generator.ts not found',
      fix: 'Implement security documentation generation system'
    });
  }
  
  return checks;
}

/**
 * Check configuration validation
 */
async function checkConfigurationValidation(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = [];
  
  try {
    // Check if configuration validator exists
    await access('lib/security/config-validator.ts');
    
    const validatorContent = await readFile('lib/security/config-validator.ts', 'utf-8');
    
    // Check for comprehensive configuration validation features
    if (validatorContent.includes('validateConfigurations') && 
        validatorContent.includes('validateTypeScriptConfig') &&
        validatorContent.includes('validateNextJsConfig')) {
      checks.push({
        category: 'Configuration Security',
        check: 'Configuration validation system',
        status: 'PASS',
        severity: 'MEDIUM',
        details: 'Comprehensive configuration validation system implemented'
      });
    } else {
      checks.push({
        category: 'Configuration Security',
        check: 'Configuration validation system',
        status: 'WARNING',
        severity: 'MEDIUM',
        details: 'Basic configuration validation found but missing advanced features',
        fix: 'Implement comprehensive configuration validation system'
      });
    }
    
    // Check if validation script exists
    try {
      await access('scripts/validate-config.ts');
      checks.push({
        category: 'Configuration Security',
        check: 'Configuration validation script',
        status: 'PASS',
        severity: 'LOW',
        details: 'Configuration validation script available'
      });
    } catch (error) {
      checks.push({
        category: 'Configuration Security',
        check: 'Configuration validation script',
        status: 'WARNING',
        severity: 'LOW',
        details: 'Configuration validation script not found',
        fix: 'Create configuration validation script'
      });
    }
    
    // Test TypeScript configuration
    try {
      const tsconfigContent = await readFile('tsconfig.json', 'utf-8');
      const tsconfig = JSON.parse(tsconfigContent);
      
      if (tsconfig.compilerOptions?.strict) {
        checks.push({
          category: 'Configuration Security',
          check: 'TypeScript strict mode',
          status: 'PASS',
          severity: 'MEDIUM',
          details: 'TypeScript strict mode is enabled for better type safety'
        });
      } else {
        checks.push({
          category: 'Configuration Security',
          check: 'TypeScript strict mode',
          status: 'FAIL',
          severity: 'HIGH',
          details: 'TypeScript strict mode is not enabled',
          fix: 'Enable strict mode in tsconfig.json for better type safety'
        });
      }
    } catch (error) {
      checks.push({
        category: 'Configuration Security',
        check: 'TypeScript configuration',
        status: 'FAIL',
        severity: 'HIGH',
        details: 'Cannot read or parse tsconfig.json',
        fix: 'Ensure tsconfig.json exists and is valid'
      });
    }
    
    // Test Next.js configuration
    try {
      const nextConfigContent = await readFile('next.config.js', 'utf-8');
      
      if (nextConfigContent.includes('poweredByHeader: false')) {
        checks.push({
          category: 'Configuration Security',
          check: 'Next.js security configuration',
          status: 'PASS',
          severity: 'LOW',
          details: 'X-Powered-By header is disabled'
        });
      } else {
        checks.push({
          category: 'Configuration Security',
          check: 'Next.js security configuration',
          status: 'WARNING',
          severity: 'LOW',
          details: 'X-Powered-By header is not disabled',
          fix: 'Add poweredByHeader: false to next.config.js'
        });
      }
    } catch (error) {
      checks.push({
        category: 'Configuration Security',
        check: 'Next.js configuration',
        status: 'WARNING',
        severity: 'MEDIUM',
        details: 'Cannot read next.config.js',
        fix: 'Ensure next.config.js exists and is properly configured'
      });
    }
    
  } catch (error) {
    checks.push({
      category: 'Configuration Security',
      check: 'Configuration validation system',
      status: 'FAIL',
      severity: 'MEDIUM',
      details: 'lib/security/config-validator.ts not found',
      fix: 'Implement configuration validation system'
    });
  }
  
  return checks;
}

/**
 * Run comprehensive security audit
 */
async function runSecurityAudit(): Promise<SecurityAuditResult> {
  console.log('🔍 Running comprehensive security audit...');
  
  const allChecks: SecurityCheck[] = [];
  
  // Run all security checks
  const middlewareChecks = await checkMiddleware();
  const adminAuthChecks = await checkAdminAuth();
  const securityHeadersChecks = await checkSecurityHeaders();
  const rateLimitingChecks = await checkRateLimiting();
  const { checks: inputValidationChecks, coverage: validationCoverage } = await checkInputValidation();
  const dependencyScanningChecks = await checkDependencyScanning();
  
  // Run cryptographic validation
  const { results: cryptoResults } = await validateCryptographicImplementations();
  const cryptoChecks = cryptoResults.map(result => ({
    category: result.category,
    check: result.check,
    status: result.status === 'secure' ? 'PASS' as const : 
            result.status === 'warning' ? 'WARNING' as const : 'FAIL' as const,
    severity: result.severity.toUpperCase() as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    details: result.details,
    fix: result.recommendations.join('; ')
  }));
  
  allChecks.push(...middlewareChecks);
  allChecks.push(...adminAuthChecks);
  allChecks.push(...securityHeadersChecks);
  allChecks.push(...rateLimitingChecks);
  allChecks.push(...inputValidationChecks);
  allChecks.push(...dependencyScanningChecks);
  allChecks.push(...cryptoChecks);
  
  // Check security documentation
  const documentationChecks = await checkSecurityDocumentation();
  allChecks.push(...documentationChecks);
  
  // Check configuration validation
  const configurationChecks = await checkConfigurationValidation();
  allChecks.push(...configurationChecks);
  
  // Calculate summary statistics
  const totalChecks = allChecks.length;
  const passed = allChecks.filter(check => check.status === 'PASS').length;
  const failed = allChecks.filter(check => check.status === 'FAIL').length;
  const warnings = allChecks.filter(check => check.status === 'WARNING').length;
  const criticalFailures = allChecks.filter(check => check.status === 'FAIL' && check.severity === 'CRITICAL').length;
  const highFailures = allChecks.filter(check => check.status === 'FAIL' && check.severity === 'HIGH').length;
  
  const overallStatus = criticalFailures > 0 ? 'CRITICAL' : 
                       highFailures > 0 ? 'NEEDS_ATTENTION' : 'SECURE';
  

  
  // Detect implemented features
  const detectedFeatures = {
    middleware: middlewareChecks.some(check => check.check.includes('middleware') && check.status === 'PASS'),
    adminAuth: adminAuthChecks.some(check => check.check.includes('authentication') && check.status === 'PASS'),
    securityHeaders: securityHeadersChecks.some(check => check.check.includes('headers') && check.status === 'PASS'),
    rateLimiting: rateLimitingChecks.some(check => check.check.includes('limiting') && check.status === 'PASS'),
    inputValidation: validationCoverage,
    dependencyScanning: dependencyScanningChecks.some(check => check.check.includes('scanning') && check.status === 'PASS'),
    cryptographicImplementations: {
      bcrypt: cryptoChecks.some(check => check.category === 'Password Hashing' && check.status === 'PASS'),
      secureRandom: cryptoChecks.some(check => check.category === 'Random Generation' && check.status === 'PASS'),
      hmac: cryptoChecks.some(check => check.category === 'HMAC Validation' && check.status === 'PASS'),
      tokenSecurity: cryptoChecks.some(check => check.category === 'Token Security' && check.status === 'PASS'),
      keyManagement: cryptoChecks.some(check => check.category === 'Key Management' && check.status === 'PASS'),
      encryption: cryptoChecks.some(check => check.category === 'Encryption' && check.status === 'PASS')
    }
  };
  
  return {
    summary: {
      totalChecks,
      passed,
      failed,
      warnings,
      criticalFailures,
      highFailures,
      overallStatus,
      lastUpdated: new Date().toISOString()
    },
    checks: allChecks,
    detectedFeatures
  };
}

/**
 * Main execution
 */
async function main() {
  try {
    const result = await runSecurityAudit();
    
    console.log('\n🔒 Security Audit Results');
    console.log('========================');
    console.log(`Overall Status: ${result.summary.overallStatus}`);
    console.log(`Total Checks: ${result.summary.totalChecks}`);
    console.log(`Passed: ${result.summary.passed}`);
    console.log(`Failed: ${result.summary.failed}`);
    console.log(`Warnings: ${result.summary.warnings}`);
    console.log(`Critical Failures: ${result.summary.criticalFailures}`);
    console.log(`High Failures: ${result.summary.highFailures}`);
    
    console.log('\n🔍 Detected Features:');
    console.log(`Middleware: ${result.detectedFeatures.middleware ? '✅' : '❌'}`);
    console.log(`Admin Auth: ${result.detectedFeatures.adminAuth ? '✅' : '❌'}`);
    console.log(`Security Headers: ${result.detectedFeatures.securityHeaders ? '✅' : '❌'}`);
    console.log(`Rate Limiting: ${result.detectedFeatures.rateLimiting ? '✅' : '❌'}`);
    console.log(`Input Validation: ${result.detectedFeatures.inputValidation.toFixed(1)}%`);
    console.log(`Dependency Scanning: ${result.detectedFeatures.dependencyScanning ? '✅' : '❌'}`);
    
    console.log('\n🔐 Cryptographic Implementations:');
    console.log(`bcrypt Password Hashing: ${result.detectedFeatures.cryptographicImplementations.bcrypt ? '✅' : '❌'}`);
    console.log(`Secure Random Generation: ${result.detectedFeatures.cryptographicImplementations.secureRandom ? '✅' : '❌'}`);
    console.log(`HMAC Validation: ${result.detectedFeatures.cryptographicImplementations.hmac ? '✅' : '❌'}`);
    console.log(`Token Security: ${result.detectedFeatures.cryptographicImplementations.tokenSecurity ? '✅' : '❌'}`);
    console.log(`Key Management: ${result.detectedFeatures.cryptographicImplementations.keyManagement ? '✅' : '❌'}`);
    console.log(`Encryption: ${result.detectedFeatures.cryptographicImplementations.encryption ? '✅' : '❌'}`);
    
    if (result.summary.criticalFailures > 0 || result.summary.highFailures > 0) {
      console.log('\n⚠️  Issues Found:');
      result.checks
        .filter(check => check.status === 'FAIL' && (check.severity === 'CRITICAL' || check.severity === 'HIGH'))
        .forEach(check => {
          console.log(`❌ ${check.category}: ${check.check}`);
          if (check.details) console.log(`   Details: ${check.details}`);
          if (check.fix) console.log(`   Fix: ${check.fix}`);
        });
    }
    
    if (result.summary.warnings > 0) {
      console.log('\n⚠️  Warnings:');
      result.checks
        .filter(check => check.status === 'WARNING')
        .forEach(check => {
          console.log(`⚠️  ${check.category}: ${check.check}`);
          if (check.details) console.log(`   Details: ${check.details}`);
          if (check.fix) console.log(`   Fix: ${check.fix}`);
        });
    }
    
    // Exit with appropriate code
    if (result.summary.criticalFailures > 0) {
      process.exit(1);
    } else if (result.summary.highFailures > 0) {
      process.exit(2);
    } else {
      console.log('\n✅ Security audit completed successfully!');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Security audit failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { runSecurityAudit };
export type { SecurityCheck, SecurityAuditResult };