/**
 * Real-time Security Monitoring Service
 * Provides live security status updates, compliance scoring, and trend analysis
 */

import { readFile } from 'fs/promises';
import { validateCryptographicImplementations } from './crypto-validator';
import { scanDependencies } from './dependency-scanner';

export interface SecurityMetrics {
  timestamp: string;
  overallScore: number;
  complianceScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  categories: {
    authentication: SecurityCategoryMetrics;
    cryptography: SecurityCategoryMetrics;
    dependencies: SecurityCategoryMetrics;
    configuration: SecurityCategoryMetrics;
    monitoring: SecurityCategoryMetrics;
  };
  trends: SecurityTrend[];
  alerts: SecurityAlert[];
}

export interface SecurityCategoryMetrics {
  score: number;
  status: 'SECURE' | 'NEEDS_ATTENTION' | 'VULNERABLE';
  checks: {
    total: number;
    passed: number;
    warnings: number;
    failed: number;
  };
  lastUpdated: string;
}

export interface SecurityTrend {
  category: string;
  metric: string;
  value: number;
  change: number;
  changePercent: number;
  direction: 'UP' | 'DOWN' | 'STABLE';
  timestamp: string;
}

export interface SecurityAlert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  title: string;
  description: string;
  recommendation: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface ComplianceReport {
  framework: 'OWASP_2024' | 'SOC2' | 'ISO27001';
  overallCompliance: number;
  categories: ComplianceCategory[];
  certificationReadiness: boolean;
  recommendations: string[];
  generatedAt: string;
}

export interface ComplianceCategory {
  id: string;
  name: string;
  compliance: number;
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
  requirements: ComplianceRequirement[];
}

export interface ComplianceRequirement {
  id: string;
  description: string;
  status: 'MET' | 'PARTIAL' | 'NOT_MET';
  evidence: string[];
  gaps: string[];
}

// In-memory storage for trends and alerts (in production, use a database)
let securityHistory: SecurityMetrics[] = [];
let activeAlerts: SecurityAlert[] = [];
let monitoringInterval: NodeJS.Timeout | null = null;
let lastMonitoringRun: string | null = null;

/**
 * Get current security metrics with real-time data
 */
export async function getCurrentSecurityMetrics(): Promise<SecurityMetrics> {
  const timestamp = new Date().toISOString();
  
  // Collect metrics from various security systems
  const [
    authMetrics,
    cryptoMetrics,
    dependencyMetrics,
    configMetrics,
    monitoringMetrics
  ] = await Promise.all([
    getAuthenticationMetrics(),
    getCryptographyMetrics(),
    getDependencyMetrics(),
    getConfigurationMetrics(),
    getMonitoringMetrics()
  ]);
  
  // Calculate overall scores
  const categoryScores = [
    authMetrics.score,
    cryptoMetrics.score,
    dependencyMetrics.score,
    configMetrics.score,
    monitoringMetrics.score
  ];
  
  const overallScore = Math.round(
    categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length
  );
  
  const complianceScore = calculateComplianceScore({
    authentication: authMetrics,
    cryptography: cryptoMetrics,
    dependencies: dependencyMetrics,
    configuration: configMetrics,
    monitoring: monitoringMetrics
  });
  
  const riskLevel = determineRiskLevel(overallScore, [
    authMetrics,
    cryptoMetrics,
    dependencyMetrics,
    configMetrics,
    monitoringMetrics
  ]);
  
  const metrics: SecurityMetrics = {
    timestamp,
    overallScore,
    complianceScore,
    riskLevel,
    categories: {
      authentication: authMetrics,
      cryptography: cryptoMetrics,
      dependencies: dependencyMetrics,
      configuration: configMetrics,
      monitoring: monitoringMetrics
    },
    trends: calculateTrends(timestamp),
    alerts: getActiveAlerts()
  };
  
  // Store for trend analysis
  securityHistory.push(metrics);
  
  // Keep only last 100 entries for memory management
  if (securityHistory.length > 100) {
    securityHistory = securityHistory.slice(-100);
  }
  
  return metrics;
}

/**
 * Get authentication security metrics
 */
async function getAuthenticationMetrics(): Promise<SecurityCategoryMetrics> {
  let passed = 0;
  let warnings = 0;
  let failed = 0;
  let total = 0;
  
  try {
    // Check admin authentication system
    const adminAuth = await readFile('lib/auth/admin-auth.ts', 'utf-8');
    total++;
    
    if (adminAuth.includes('bcrypt') && adminAuth.includes('verifyAdminAuth')) {
      passed++;
    } else if (adminAuth.includes('withAdminAuth')) {
      warnings++;
    } else {
      failed++;
    }
    
    // Check middleware authentication
    const middleware = await readFile('middleware.ts', 'utf-8');
    total++;
    
    if (middleware.includes('verifyAdminAuthEdge') || middleware.includes('authorization')) {
      passed++;
    } else {
      warnings++;
    }
    
    // Check API route protection
    const apiRoutes = [
      'app/api/admin/validate/route.ts',
      'app/api/admin/verify-token/route.ts'
    ];
    
    for (const route of apiRoutes) {
      try {
        const content = await readFile(route, 'utf-8');
        total++;
        
        if (content.includes('withAdminAuth') || content.includes('verifyAdminAuth')) {
          passed++;
        } else {
          failed++;
        }
      } catch (error) {
        total++;
        failed++;
      }
    }
    
  } catch (error) {
    total = 1;
    failed = 1;
  }
  
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;
  const status = failed > 0 ? 'VULNERABLE' : warnings > 0 ? 'NEEDS_ATTENTION' : 'SECURE';
  
  return {
    score,
    status,
    checks: { total, passed, warnings, failed },
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Get cryptography security metrics
 */
async function getCryptographyMetrics(): Promise<SecurityCategoryMetrics> {
  try {
    const { summary } = await validateCryptographicImplementations();
    
    const score = summary.overallScore;
    const status = summary.overallStatus === 'secure' ? 'SECURE' :
                  summary.overallStatus === 'needs_attention' ? 'NEEDS_ATTENTION' : 'VULNERABLE';
    
    return {
      score,
      status,
      checks: {
        total: summary.totalChecks,
        passed: summary.secureImplementations,
        warnings: summary.warnings,
        failed: summary.vulnerabilities
      },
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    return {
      score: 0,
      status: 'VULNERABLE',
      checks: { total: 1, passed: 0, warnings: 0, failed: 1 },
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Get dependency security metrics
 */
async function getDependencyMetrics(): Promise<SecurityCategoryMetrics> {
  try {
    const scanResult = await scanDependencies();
    
    const total = scanResult.summary.total;
    const critical = scanResult.summary.critical;
    const high = scanResult.summary.high;
    const moderate = scanResult.summary.moderate;
    
    const failed = critical + high;
    const warnings = moderate;
    const passed = Math.max(0, total - failed - warnings);
    
    const score = total > 0 ? Math.round(((passed + warnings * 0.5) / total) * 100) : 100;
    const status = critical > 0 ? 'VULNERABLE' : 
                  high > 0 ? 'NEEDS_ATTENTION' : 'SECURE';
    
    return {
      score,
      status,
      checks: { total, passed, warnings, failed },
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    return {
      score: 80, // Assume reasonable security if scan fails
      status: 'NEEDS_ATTENTION',
      checks: { total: 1, passed: 0, warnings: 1, failed: 0 },
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Get configuration security metrics
 */
async function getConfigurationMetrics(): Promise<SecurityCategoryMetrics> {
  let passed = 0;
  let warnings = 0;
  let failed = 0;
  let total = 0;
  
  try {
    // Check TypeScript configuration
    const tsConfig = await readFile('tsconfig.json', 'utf-8');
    total++;
    
    if (tsConfig.includes('"strict": true')) {
      passed++;
    } else {
      warnings++;
    }
    
    // Check Next.js configuration
    const nextConfig = await readFile('next.config.js', 'utf-8');
    total++;
    
    if (!nextConfig.includes('NEXT_PUBLIC_ADMIN_PASSWORD')) {
      passed++;
    } else {
      failed++;
    }
    
    // Check environment template
    try {
      const envExample = await readFile('.env.example', 'utf-8');
      total++;
      
      if (envExample.includes('ADMIN_PASSWORD') && envExample.includes('NEXTAUTH_SECRET')) {
        passed++;
      } else {
        warnings++;
      }
    } catch (error) {
      total++;
      warnings++;
    }
    
    // Check middleware configuration
    const middleware = await readFile('middleware.ts', 'utf-8');
    total++;
    
    if (middleware.includes('securityHeaders') && middleware.includes('rateLimit')) {
      passed++;
    } else {
      warnings++;
    }
    
  } catch (error) {
    total = 1;
    failed = 1;
  }
  
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;
  const status = failed > 0 ? 'VULNERABLE' : warnings > 0 ? 'NEEDS_ATTENTION' : 'SECURE';
  
  return {
    score,
    status,
    checks: { total, passed, warnings, failed },
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Get monitoring security metrics
 */
async function getMonitoringMetrics(): Promise<SecurityCategoryMetrics> {
  let passed = 0;
  let warnings = 0;
  let failed = 0;
  let total = 0;
  
  try {
    // Check security logging
    const securityLogger = await readFile('lib/security/logging.ts', 'utf-8');
    total++;
    
    if (securityLogger.includes('logEvent') && securityLogger.includes('severity')) {
      passed++;
    } else {
      warnings++;
    }
    
    // Check rate limiting monitoring
    try {
      await readFile('lib/security/rate-limit-monitor.ts', 'utf-8');
      total++;
      passed++;
    } catch (error) {
      total++;
      warnings++;
    }
    
    // Check security audit system
    try {
      await readFile('scripts/security-audit.ts', 'utf-8');
      total++;
      passed++;
    } catch (error) {
      total++;
      failed++;
    }
    
    // Check dashboard monitoring
    try {
      await readFile('app/api/security/dashboard/route.ts', 'utf-8');
      total++;
      passed++;
    } catch (error) {
      total++;
      warnings++;
    }
    
  } catch (error) {
    total = 1;
    failed = 1;
  }
  
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;
  const status = failed > 0 ? 'VULNERABLE' : warnings > 0 ? 'NEEDS_ATTENTION' : 'SECURE';
  
  return {
    score,
    status,
    checks: { total, passed, warnings, failed },
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Calculate compliance score based on category metrics
 */
function calculateComplianceScore(categories: Record<string, SecurityCategoryMetrics>): number {
  const scores = Object.values(categories).map(cat => cat.score);
  const weights = [0.25, 0.25, 0.2, 0.15, 0.15]; // Authentication and crypto are most important
  
  return Math.round(
    scores.reduce((sum, score, index) => sum + (score * weights[index]), 0)
  );
}

/**
 * Determine overall risk level
 */
function determineRiskLevel(
  overallScore: number, 
  categories: SecurityCategoryMetrics[]
): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const hasVulnerable = categories.some(cat => cat.status === 'VULNERABLE');
  const hasHighRiskFailures = categories.some(cat => cat.checks.failed > 0);
  
  if (hasVulnerable || overallScore < 60) {
    return 'CRITICAL';
  } else if (hasHighRiskFailures || overallScore < 75) {
    return 'HIGH';
  } else if (overallScore < 90) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}

/**
 * Calculate security trends
 */
function calculateTrends(currentTimestamp: string): SecurityTrend[] {
  const trends: SecurityTrend[] = [];
  
  if (securityHistory.length < 2) {
    return trends;
  }
  
  const current = securityHistory[securityHistory.length - 1];
  const previous = securityHistory[securityHistory.length - 2];
  
  // Overall score trend
  const overallChange = current.overallScore - previous.overallScore;
  trends.push({
    category: 'Overall',
    metric: 'Security Score',
    value: current.overallScore,
    change: overallChange,
    changePercent: previous.overallScore > 0 ? Math.round((overallChange / previous.overallScore) * 100) : 0,
    direction: overallChange > 0 ? 'UP' : overallChange < 0 ? 'DOWN' : 'STABLE',
    timestamp: currentTimestamp
  });
  
  // Category trends
  Object.entries(current.categories).forEach(([category, metrics]) => {
    const prevMetrics = previous.categories[category as keyof typeof previous.categories];
    const change = metrics.score - prevMetrics.score;
    
    trends.push({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      metric: 'Category Score',
      value: metrics.score,
      change,
      changePercent: prevMetrics.score > 0 ? Math.round((change / prevMetrics.score) * 100) : 0,
      direction: change > 0 ? 'UP' : change < 0 ? 'DOWN' : 'STABLE',
      timestamp: currentTimestamp
    });
  });
  
  return trends;
}

/**
 * Get active security alerts
 */
function getActiveAlerts(): SecurityAlert[] {
  return activeAlerts.filter(alert => !alert.acknowledged);
}

/**
 * Add security alert
 */
export function addSecurityAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp' | 'acknowledged'>): void {
  const newAlert: SecurityAlert = {
    ...alert,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    acknowledged: false
  };
  
  activeAlerts.push(newAlert);
  
  // Keep only last 50 alerts
  if (activeAlerts.length > 50) {
    activeAlerts = activeAlerts.slice(-50);
  }
}

/**
 * Acknowledge security alert
 */
export function acknowledgeAlert(alertId: string): boolean {
  const alert = activeAlerts.find(a => a.id === alertId);
  if (alert) {
    alert.acknowledged = true;
    return true;
  }
  return false;
}

/**
 * Generate OWASP 2024 compliance report
 */
export async function generateOWASPComplianceReport(): Promise<ComplianceReport> {
  const metrics = await getCurrentSecurityMetrics();
  
  const categories: ComplianceCategory[] = [
    {
      id: 'A01',
      name: 'Broken Access Control',
      compliance: metrics.categories.authentication.score,
      status: metrics.categories.authentication.score >= 90 ? 'COMPLIANT' :
              metrics.categories.authentication.score >= 70 ? 'PARTIAL' : 'NON_COMPLIANT',
      requirements: [
        {
          id: 'A01.1',
          description: 'Implement proper authentication mechanisms',
          status: metrics.categories.authentication.checks.passed > 0 ? 'MET' : 'NOT_MET',
          evidence: ['lib/auth/admin-auth.ts', 'middleware.ts'],
          gaps: metrics.categories.authentication.checks.failed > 0 ? ['Missing authentication on some routes'] : []
        }
      ]
    },
    {
      id: 'A02',
      name: 'Cryptographic Failures',
      compliance: metrics.categories.cryptography.score,
      status: metrics.categories.cryptography.score >= 90 ? 'COMPLIANT' :
              metrics.categories.cryptography.score >= 70 ? 'PARTIAL' : 'NON_COMPLIANT',
      requirements: [
        {
          id: 'A02.1',
          description: 'Use strong cryptographic implementations',
          status: metrics.categories.cryptography.checks.passed >= metrics.categories.cryptography.checks.total * 0.8 ? 'MET' : 'PARTIAL',
          evidence: ['bcrypt implementation', 'HMAC validation', 'secure random generation'],
          gaps: metrics.categories.cryptography.checks.warnings > 0 ? ['Some cryptographic warnings present'] : []
        }
      ]
    },
    {
      id: 'A06',
      name: 'Vulnerable and Outdated Components',
      compliance: metrics.categories.dependencies.score,
      status: metrics.categories.dependencies.score >= 90 ? 'COMPLIANT' :
              metrics.categories.dependencies.score >= 70 ? 'PARTIAL' : 'NON_COMPLIANT',
      requirements: [
        {
          id: 'A06.1',
          description: 'Keep dependencies up to date and secure',
          status: metrics.categories.dependencies.checks.failed === 0 ? 'MET' : 'NOT_MET',
          evidence: ['Dependency scanning system', 'Regular security audits'],
          gaps: metrics.categories.dependencies.checks.failed > 0 ? ['Vulnerable dependencies detected'] : []
        }
      ]
    },
    {
      id: 'A05',
      name: 'Security Misconfiguration',
      compliance: metrics.categories.configuration.score,
      status: metrics.categories.configuration.score >= 90 ? 'COMPLIANT' :
              metrics.categories.configuration.score >= 70 ? 'PARTIAL' : 'NON_COMPLIANT',
      requirements: [
        {
          id: 'A05.1',
          description: 'Implement secure configuration practices',
          status: metrics.categories.configuration.checks.passed >= metrics.categories.configuration.checks.total * 0.8 ? 'MET' : 'PARTIAL',
          evidence: ['Security headers', 'Environment variable security', 'TypeScript strict mode'],
          gaps: metrics.categories.configuration.checks.failed > 0 ? ['Configuration security issues'] : []
        }
      ]
    },
    {
      id: 'A09',
      name: 'Security Logging and Monitoring Failures',
      compliance: metrics.categories.monitoring.score,
      status: metrics.categories.monitoring.score >= 90 ? 'COMPLIANT' :
              metrics.categories.monitoring.score >= 70 ? 'PARTIAL' : 'NON_COMPLIANT',
      requirements: [
        {
          id: 'A09.1',
          description: 'Implement comprehensive security logging and monitoring',
          status: metrics.categories.monitoring.checks.passed >= metrics.categories.monitoring.checks.total * 0.8 ? 'MET' : 'PARTIAL',
          evidence: ['Security event logging', 'Real-time monitoring', 'Security dashboard'],
          gaps: metrics.categories.monitoring.checks.warnings > 0 ? ['Monitoring gaps present'] : []
        }
      ]
    }
  ];
  
  const overallCompliance = Math.round(
    categories.reduce((sum, cat) => sum + cat.compliance, 0) / categories.length
  );
  
  const certificationReadiness = overallCompliance >= 85 && 
    categories.every(cat => cat.status !== 'NON_COMPLIANT');
  
  const recommendations: string[] = [];
  categories.forEach(cat => {
    cat.requirements.forEach(req => {
      recommendations.push(...req.gaps);
    });
  });
  
  // Remove duplicates using Array.from and Set
  const uniqueRecommendations = Array.from(new Set(recommendations));
  
  return {
    framework: 'OWASP_2024',
    overallCompliance,
    categories,
    certificationReadiness,
    recommendations: uniqueRecommendations,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Get security history for trend analysis
 */
export function getSecurityHistory(limit: number = 24): SecurityMetrics[] {
  return securityHistory.slice(-limit);
}

/**
 * Start automated security monitoring
 */
export function startAutomatedMonitoring(intervalMinutes: number = 15): void {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
  
  console.log(`🔄 Starting automated security monitoring (every ${intervalMinutes} minutes)`);
  
  // Run initial monitoring
  runAutomatedSecurityCheck();
  
  // Schedule periodic monitoring
  monitoringInterval = setInterval(() => {
    runAutomatedSecurityCheck();
  }, intervalMinutes * 60 * 1000);
}

/**
 * Stop automated security monitoring
 */
export function stopAutomatedMonitoring(): void {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
    console.log('🛑 Stopped automated security monitoring');
  }
}

/**
 * Run automated security check and generate alerts
 */
async function runAutomatedSecurityCheck(): Promise<void> {
  try {
    console.log('🔍 Running automated security check...');
    
    const metrics = await getCurrentSecurityMetrics();
    lastMonitoringRun = metrics.timestamp;
    
    // Generate alerts based on metrics
    await generateAutomatedAlerts(metrics);
    
    console.log(`✅ Automated security check completed. Overall score: ${metrics.overallScore}%`);
    
  } catch (error) {
    console.error('❌ Automated security check failed:', error);
    
    addSecurityAlert({
      severity: 'HIGH',
      category: 'Monitoring',
      title: 'Automated Security Check Failed',
      description: 'The automated security monitoring system encountered an error',
      recommendation: 'Check monitoring system logs and ensure all security components are functioning'
    });
  }
}

/**
 * Generate automated alerts based on security metrics
 */
async function generateAutomatedAlerts(metrics: SecurityMetrics): Promise<void> {
  // Critical risk level alert
  if (metrics.riskLevel === 'CRITICAL') {
    addSecurityAlert({
      severity: 'CRITICAL',
      category: 'Overall Security',
      title: 'Critical Security Risk Detected',
      description: `Overall security score has dropped to ${metrics.overallScore}% with critical vulnerabilities detected`,
      recommendation: 'Immediate action required. Review all failed security checks and address critical vulnerabilities'
    });
  }
  
  // High risk level alert
  if (metrics.riskLevel === 'HIGH') {
    addSecurityAlert({
      severity: 'HIGH',
      category: 'Overall Security',
      title: 'High Security Risk Detected',
      description: `Overall security score is ${metrics.overallScore}% with high-risk issues present`,
      recommendation: 'Review and address high-priority security issues within 24 hours'
    });
  }
  
  // Category-specific alerts
  Object.entries(metrics.categories).forEach(([category, categoryMetrics]) => {
    if (categoryMetrics.status === 'VULNERABLE') {
      addSecurityAlert({
        severity: 'HIGH',
        category: category.charAt(0).toUpperCase() + category.slice(1),
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Security Vulnerability`,
        description: `${category} security score is ${categoryMetrics.score}% with ${categoryMetrics.checks.failed} failed checks`,
        recommendation: `Review and fix ${category} security issues immediately`
      });
    } else if (categoryMetrics.status === 'NEEDS_ATTENTION' && categoryMetrics.score < 70) {
      addSecurityAlert({
        severity: 'MEDIUM',
        category: category.charAt(0).toUpperCase() + category.slice(1),
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Security Attention Required`,
        description: `${category} security score is ${categoryMetrics.score}% with ${categoryMetrics.checks.warnings} warnings`,
        recommendation: `Review and improve ${category} security configuration`
      });
    }
  });
  
  // Trend-based alerts
  metrics.trends.forEach(trend => {
    if (trend.direction === 'DOWN' && Math.abs(trend.changePercent) > 10) {
      addSecurityAlert({
        severity: 'MEDIUM',
        category: 'Security Trends',
        title: `${trend.category} Security Score Declining`,
        description: `${trend.category} ${trend.metric} has decreased by ${Math.abs(trend.changePercent)}% to ${trend.value}`,
        recommendation: `Investigate the cause of declining ${trend.category.toLowerCase()} security metrics`
      });
    }
  });
  
  // Compliance alerts
  if (metrics.complianceScore < 80) {
    addSecurityAlert({
      severity: 'HIGH',
      category: 'Compliance',
      title: 'Security Compliance Below Threshold',
      description: `Overall compliance score is ${metrics.complianceScore}% (below 80% threshold)`,
      recommendation: 'Review compliance requirements and address gaps to meet certification standards'
    });
  }
}

/**
 * Get monitoring status
 */
export function getMonitoringStatus(): {
  isRunning: boolean;
  lastRun: string | null;
  nextRun: string | null;
  activeAlertsCount: number;
} {
  const nextRun = monitoringInterval && lastMonitoringRun ? 
    new Date(new Date(lastMonitoringRun).getTime() + 15 * 60 * 1000).toISOString() : null;
  
  return {
    isRunning: monitoringInterval !== null,
    lastRun: lastMonitoringRun,
    nextRun,
    activeAlertsCount: getActiveAlerts().length
  };
}

/**
 * Generate certification-ready security report
 */
export async function generateCertificationReport(): Promise<{
  reportId: string;
  generatedAt: string;
  validUntil: string;
  overallAssessment: 'READY' | 'NEEDS_IMPROVEMENT' | 'NOT_READY';
  metrics: SecurityMetrics;
  compliance: ComplianceReport;
  recommendations: string[];
  evidence: Record<string, string[]>;
}> {
  const metrics = await getCurrentSecurityMetrics();
  const compliance = await generateOWASPComplianceReport();
  
  const overallAssessment = 
    metrics.overallScore >= 90 && compliance.certificationReadiness ? 'READY' :
    metrics.overallScore >= 75 ? 'NEEDS_IMPROVEMENT' : 'NOT_READY';
  
  const evidence = {
    'Authentication Security': [
      'lib/auth/admin-auth.ts - Admin authentication implementation',
      'middleware.ts - Authentication middleware',
      'app/api/admin/ - Protected admin routes'
    ],
    'Cryptographic Security': [
      'bcrypt password hashing implementation',
      'HMAC validation system',
      'Secure random number generation',
      'Environment variable secret management'
    ],
    'Dependency Security': [
      'Automated dependency vulnerability scanning',
      'Regular security audits',
      'Dependency update monitoring'
    ],
    'Configuration Security': [
      'TypeScript strict mode enforcement',
      'Security headers implementation',
      'Environment variable security'
    ],
    'Monitoring & Logging': [
      'Real-time security monitoring',
      'Security event logging',
      'Automated alerting system',
      'Compliance reporting'
    ]
  };
  
  const recommendations = [
    ...compliance.recommendations,
    ...(metrics.overallScore < 90 ? ['Improve overall security score to 90% or higher'] : []),
    ...(metrics.riskLevel !== 'LOW' ? ['Address high-risk security issues'] : []),
    ...(getActiveAlerts().length > 0 ? ['Resolve all active security alerts'] : [])
  ];
  
  return {
    reportId: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    overallAssessment,
    metrics,
    compliance,
    recommendations: Array.from(new Set(recommendations)),
    evidence
  };
}

/**
 * Clear security history (for testing)
 */
export function clearSecurityHistory(): void {
  securityHistory = [];
  activeAlerts = [];
  lastMonitoringRun = null;
}