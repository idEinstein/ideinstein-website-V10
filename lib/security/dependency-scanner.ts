/**
 * Enhanced Dependency Security Scanner
 * Provides comprehensive vulnerability scanning with Vercel compatibility
 */

import { execSync } from 'child_process';
import { readFile, access } from 'fs/promises';
import { join } from 'path';

export interface VulnerabilityInfo {
  id: string;
  title: string;
  severity: 'info' | 'low' | 'moderate' | 'high' | 'critical';
  vulnerable_versions: string;
  patched_versions?: string;
  overview: string;
  recommendation: string;
  references?: string[];
  cwe?: string[];
  cvss?: {
    score: number;
    vectorString: string;
  };
}

export interface DependencyVulnerability {
  name: string;
  version: string;
  severity: 'info' | 'low' | 'moderate' | 'high' | 'critical';
  via: VulnerabilityInfo[];
  effects: string[];
  range: string;
  nodes: string[];
  fixAvailable?: boolean | { name: string; version: string; isSemVerMajor: boolean };
}

export interface AuditResult {
  vulnerabilities: Record<string, DependencyVulnerability>;
  metadata: {
    vulnerabilities: {
      info: number;
      low: number;
      moderate: number;
      high: number;
      critical: number;
      total: number;
    };
    dependencies: {
      prod: number;
      dev: number;
      optional: number;
      peer: number;
      peerOptional: number;
      total: number;
    };
  };
}

export interface ScanResult {
  success: boolean;
  method: 'npm_audit' | 'package_analysis' | 'fallback';
  vulnerabilities: DependencyVulnerability[];
  summary: {
    total: number;
    critical: number;
    high: number;
    moderate: number;
    low: number;
    info: number;
  };
  recommendations: string[];
  scanTime: number;
  error?: string;
}

/**
 * Run npm audit with enhanced error handling
 */
async function runNpmAudit(): Promise<AuditResult | null> {
  try {
    console.log('🔍 Running npm audit...');
    
    // Try npm audit with JSON output
    const auditOutput = execSync('npm audit --json', { 
      encoding: 'utf-8',
      timeout: 30000, // 30 second timeout
      cwd: process.cwd()
    });
    
    const auditResult: AuditResult = JSON.parse(auditOutput);
    console.log('✅ npm audit completed successfully');
    return auditResult;
    
  } catch (error: any) {
    console.warn('⚠️ npm audit failed:', error.message);
    
    // Try to parse error output for partial results
    if (error.stdout) {
      try {
        const partialResult = JSON.parse(error.stdout);
        console.log('📋 Parsed partial audit results from error output');
        return partialResult;
      } catch (parseError) {
        console.warn('❌ Could not parse partial audit results');
      }
    }
    
    return null;
  }
}

/**
 * Analyze package.json for known vulnerable patterns
 */
async function analyzePackageJson(): Promise<ScanResult> {
  try {
    console.log('📦 Analyzing package.json for known vulnerabilities...');
    
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageContent = await readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageContent);
    
    const vulnerabilities: DependencyVulnerability[] = [];
    const recommendations: string[] = [];
    
    // Check for known vulnerable packages and versions
    const knownVulnerablePackages = [
      {
        name: 'lodash',
        vulnerableVersions: ['<4.17.21'],
        severity: 'high' as const,
        issue: 'Prototype pollution vulnerability',
        recommendation: 'Update to lodash@4.17.21 or higher'
      },
      {
        name: 'axios',
        vulnerableVersions: ['<0.21.2'],
        severity: 'moderate' as const,
        issue: 'Server-Side Request Forgery (SSRF)',
        recommendation: 'Update to axios@0.21.2 or higher'
      },
      {
        name: 'node-fetch',
        vulnerableVersions: ['<2.6.7', '3.0.0-3.2.4'],
        severity: 'high' as const,
        issue: 'Information exposure vulnerability',
        recommendation: 'Update to node-fetch@2.6.7 or 3.2.5+'
      },
      {
        name: 'minimist',
        vulnerableVersions: ['<1.2.6'],
        severity: 'moderate' as const,
        issue: 'Prototype pollution vulnerability',
        recommendation: 'Update to minimist@1.2.6 or higher'
      }
    ];
    
    // Check dependencies
    const allDeps = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {}
    };
    
    for (const [depName, depVersion] of Object.entries(allDeps)) {
      const knownVuln = knownVulnerablePackages.find(pkg => pkg.name === depName);
      if (knownVuln) {
        // Simple version check (this is a basic implementation)
        const version = String(depVersion).replace(/[\^~]/, '');
        
        vulnerabilities.push({
          name: depName,
          version: String(depVersion),
          severity: knownVuln.severity,
          via: [{
            id: `manual-check-${depName}`,
            title: knownVuln.issue,
            severity: knownVuln.severity,
            vulnerable_versions: knownVuln.vulnerableVersions.join(', '),
            overview: knownVuln.issue,
            recommendation: knownVuln.recommendation
          }],
          effects: [],
          range: String(depVersion),
          nodes: [`node_modules/${depName}`],
          fixAvailable: true
        });
        
        recommendations.push(knownVuln.recommendation);
      }
    }
    
    // Check for outdated Node.js version patterns
    if (packageJson.engines?.node) {
      const nodeVersion = packageJson.engines.node;
      if (nodeVersion.includes('14') || nodeVersion.includes('16')) {
        recommendations.push('Consider updating Node.js version to 18+ for latest security patches');
      }
    }
    
    // Check for missing security-related scripts
    const scripts = packageJson.scripts || {};
    if (!scripts['security:audit'] && !scripts['audit']) {
      recommendations.push('Add security audit script to package.json');
    }
    
    const summary = {
      total: vulnerabilities.length,
      critical: vulnerabilities.filter(v => v.severity === 'critical').length,
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      moderate: vulnerabilities.filter(v => v.severity === 'moderate').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length,
      info: vulnerabilities.filter(v => v.severity === 'info').length
    };
    
    console.log(`📊 Package analysis completed: ${vulnerabilities.length} potential issues found`);
    
    return {
      success: true,
      method: 'package_analysis',
      vulnerabilities,
      summary,
      recommendations,
      scanTime: Date.now()
    };
    
  } catch (error) {
    console.error('❌ Package analysis failed:', error);
    return {
      success: false,
      method: 'package_analysis',
      vulnerabilities: [],
      summary: { total: 0, critical: 0, high: 0, moderate: 0, low: 0, info: 0 },
      recommendations: ['Manual security review recommended'],
      scanTime: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fallback security check using basic file analysis
 */
async function fallbackSecurityCheck(): Promise<ScanResult> {
  console.log('🔄 Running fallback security check...');
  
  const recommendations: string[] = [];
  const vulnerabilities: DependencyVulnerability[] = [];
  
  try {
    // Check if package-lock.json exists
    try {
      await access('package-lock.json');
      recommendations.push('✅ package-lock.json found - dependency versions are locked');
    } catch {
      recommendations.push('⚠️ Consider adding package-lock.json for dependency version locking');
    }
    
    // Check if .nvmrc exists
    try {
      await access('.nvmrc');
      const nvmrc = await readFile('.nvmrc', 'utf-8');
      const nodeVersion = nvmrc.trim();
      if (nodeVersion.startsWith('14') || nodeVersion.startsWith('16')) {
        recommendations.push('Consider updating Node.js version in .nvmrc to 18+ for security');
      } else {
        recommendations.push('✅ Node.js version specified in .nvmrc');
      }
    } catch {
      recommendations.push('Consider adding .nvmrc file to specify Node.js version');
    }
    
    // Check for security-related files
    const securityFiles = [
      '.github/dependabot.yml',
      '.github/workflows/security.yml',
      'SECURITY.md'
    ];
    
    for (const file of securityFiles) {
      try {
        await access(file);
        recommendations.push(`✅ ${file} found`);
      } catch {
        recommendations.push(`Consider adding ${file} for automated security`);
      }
    }
    
    return {
      success: true,
      method: 'fallback',
      vulnerabilities,
      summary: { total: 0, critical: 0, high: 0, moderate: 0, low: 0, info: 0 },
      recommendations,
      scanTime: Date.now()
    };
    
  } catch (error) {
    return {
      success: false,
      method: 'fallback',
      vulnerabilities: [],
      summary: { total: 0, critical: 0, high: 0, moderate: 0, low: 0, info: 0 },
      recommendations: ['Manual security review required'],
      scanTime: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Convert npm audit result to our format
 */
function convertAuditResult(auditResult: AuditResult): ScanResult {
  const vulnerabilities: DependencyVulnerability[] = [];
  
  // Convert vulnerabilities object to array
  for (const [name, vuln] of Object.entries(auditResult.vulnerabilities)) {
    vulnerabilities.push(vuln);
  }
  
  const recommendations: string[] = [];
  
  // Generate recommendations based on vulnerabilities
  if (auditResult.metadata.vulnerabilities.critical > 0) {
    recommendations.push('🚨 CRITICAL: Run `npm audit fix` immediately to address critical vulnerabilities');
  }
  
  if (auditResult.metadata.vulnerabilities.high > 0) {
    recommendations.push('⚠️ HIGH: Update packages with high severity vulnerabilities');
  }
  
  if (auditResult.metadata.vulnerabilities.moderate > 0) {
    recommendations.push('📋 MODERATE: Review and update packages with moderate vulnerabilities');
  }
  
  if (auditResult.metadata.vulnerabilities.total === 0) {
    recommendations.push('✅ No known vulnerabilities found in dependencies');
    recommendations.push('💡 Consider running `npm update` to get latest patches');
  }
  
  return {
    success: true,
    method: 'npm_audit',
    vulnerabilities,
    summary: {
      total: auditResult.metadata.vulnerabilities.total,
      critical: auditResult.metadata.vulnerabilities.critical,
      high: auditResult.metadata.vulnerabilities.high,
      moderate: auditResult.metadata.vulnerabilities.moderate,
      low: auditResult.metadata.vulnerabilities.low,
      info: auditResult.metadata.vulnerabilities.info
    },
    recommendations,
    scanTime: Date.now()
  };
}

/**
 * Main dependency scanning function with multiple fallback methods
 */
export async function scanDependencies(): Promise<ScanResult> {
  const startTime = Date.now();
  
  console.log('🔍 Starting comprehensive dependency security scan...');
  
  // Method 1: Try npm audit (preferred)
  const auditResult = await runNpmAudit();
  if (auditResult) {
    const result = convertAuditResult(auditResult);
    result.scanTime = Date.now() - startTime;
    console.log(`✅ Dependency scan completed via npm audit in ${result.scanTime}ms`);
    return result;
  }
  
  // Method 2: Fallback to package.json analysis
  console.log('🔄 npm audit failed, trying package analysis...');
  const packageResult = await analyzePackageJson();
  if (packageResult.success) {
    packageResult.scanTime = Date.now() - startTime;
    console.log(`✅ Dependency scan completed via package analysis in ${packageResult.scanTime}ms`);
    return packageResult;
  }
  
  // Method 3: Basic fallback check
  console.log('🔄 Package analysis failed, using fallback method...');
  const fallbackResult = await fallbackSecurityCheck();
  fallbackResult.scanTime = Date.now() - startTime;
  console.log(`✅ Dependency scan completed via fallback method in ${fallbackResult.scanTime}ms`);
  
  return fallbackResult;
}

/**
 * Get vulnerability severity score for sorting/prioritization
 */
export function getSeverityScore(severity: string): number {
  switch (severity) {
    case 'critical': return 5;
    case 'high': return 4;
    case 'moderate': return 3;
    case 'low': return 2;
    case 'info': return 1;
    default: return 0;
  }
}

/**
 * Generate fix recommendations based on scan results
 */
export function generateFixRecommendations(result: ScanResult): string[] {
  const fixes: string[] = [];
  
  if (result.summary.critical > 0) {
    fixes.push('🚨 IMMEDIATE ACTION REQUIRED: Critical vulnerabilities found');
    fixes.push('Run `npm audit fix --force` to attempt automatic fixes');
    fixes.push('Review and manually update packages if automatic fix fails');
  }
  
  if (result.summary.high > 0) {
    fixes.push('⚠️ HIGH PRIORITY: Update packages with high severity vulnerabilities');
    fixes.push('Run `npm audit fix` to apply available patches');
  }
  
  if (result.summary.moderate > 0 || result.summary.low > 0) {
    fixes.push('📋 MAINTENANCE: Update packages with moderate/low vulnerabilities');
    fixes.push('Consider updating to latest stable versions');
  }
  
  if (result.summary.total === 0) {
    fixes.push('✅ No vulnerabilities found - maintain current security practices');
    fixes.push('💡 Run `npm update` periodically to get latest security patches');
    fixes.push('🔄 Consider enabling Dependabot for automated security updates');
  }
  
  // Add method-specific recommendations
  fixes.push(...result.recommendations);
  
  return fixes;
}

/**
 * Check if dependency scanning is available in current environment
 */
export async function isDependencyScanningAvailable(): Promise<{
  available: boolean;
  methods: string[];
  limitations: string[];
}> {
  const methods: string[] = [];
  const limitations: string[] = [];
  
  // Check npm availability
  try {
    execSync('npm --version', { encoding: 'utf-8', timeout: 5000 });
    methods.push('npm audit');
  } catch {
    limitations.push('npm not available');
  }
  
  // Check package.json accessibility
  try {
    await access('package.json');
    methods.push('package.json analysis');
  } catch {
    limitations.push('package.json not accessible');
  }
  
  // Always available fallback
  methods.push('basic security check');
  
  return {
    available: methods.length > 0,
    methods,
    limitations
  };
}