'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Play,
  FileText,
  Activity,
  Lock,
  Globe,
  Database,
  Settings,
  Zap
} from 'lucide-react';
import RateLimitDashboard from './RateLimitDashboard';

interface SecurityCheck {
  category: string;
  check: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  details?: string;
  fix?: string;
}

interface SecuritySummary {
  totalChecks: number;
  passed: number;
  failed: number;
  warnings: number;
  criticalFailures: number;
  highFailures: number;
  overallStatus: 'SECURE' | 'NEEDS_ATTENTION' | 'CRITICAL';
  lastUpdated: string;
}

interface SecurityAuditResult {
  summary: SecuritySummary;
  checks: SecurityCheck[];
  owaspCompliance: {
    [key: string]: {
      status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
      details: string;
    };
  };
  nextjsCompliance: {
    [key: string]: {
      status: 'IMPLEMENTED' | 'PARTIAL' | 'MISSING';
      details: string;
    };
  };
}

export default function SecurityDashboard() {
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runningTest, setRunningTest] = useState<string | null>(null);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get admin token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch('/api/security/dashboard', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch security data');
      }

      const data = await response.json();
      setAuditResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const runSecurityTest = async (testType: string) => {
    try {
      setRunningTest(testType);
      setError(null);
      
      // Get admin token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch('/api/security/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ action: 'run_test', testType })
      });

      if (!response.ok) {
        throw new Error(`Failed to run ${testType} test`);
      }

      // Refresh data after test
      await fetchSecurityData();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to run ${testType} test`);
    } finally {
      setRunningTest(null);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
      case 'SECURE':
      case 'COMPLIANT':
      case 'IMPLEMENTED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'FAIL':
      case 'CRITICAL':
      case 'NON_COMPLIANT':
      case 'MISSING':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'WARNING':
      case 'NEEDS_ATTENTION':
      case 'PARTIAL':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
      case 'SECURE':
      case 'COMPLIANT':
      case 'IMPLEMENTED':
        return 'text-green-500';
      case 'FAIL':
      case 'CRITICAL':
      case 'NON_COMPLIANT':
      case 'MISSING':
        return 'text-red-500';
      case 'WARNING':
      case 'NEEDS_ATTENTION':
      case 'PARTIAL':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      CRITICAL: 'destructive',
      HIGH: 'destructive',
      MEDIUM: 'default',
      LOW: 'secondary'
    } as const;
    
    return <Badge variant={variants[severity as keyof typeof variants] || 'secondary'}>{severity}</Badge>;
  };

  if (error && !auditResult) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive security monitoring and OWASP 2024 compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSecurityData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      {auditResult && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
              {getStatusIcon(auditResult.summary.overallStatus)}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(auditResult.summary.overallStatus)}`}>
                {auditResult.summary.overallStatus}
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(auditResult.summary.lastUpdated).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Checks</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {auditResult.summary.passed}/{auditResult.summary.totalChecks}
              </div>
              <p className="text-xs text-muted-foreground">
                Passed security checks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {auditResult.summary.criticalFailures}
              </div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {auditResult.summary.warnings}
              </div>
              <p className="text-xs text-muted-foreground">
                Should be addressed
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Security Tests & Audits
          </CardTitle>
          <CardDescription>
            Run comprehensive security tests and audits (recommended weekly/monthly)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => runSecurityTest('comprehensive')}
              disabled={runningTest === 'comprehensive'}
            >
              <Shield className="h-6 w-6" />
              <span className="text-sm">Full Security Audit</span>
              {runningTest === 'comprehensive' && (
                <RefreshCw className="h-4 w-4 animate-spin" />
              )}
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => runSecurityTest('owasp')}
              disabled={runningTest === 'owasp'}
            >
              <Lock className="h-6 w-6" />
              <span className="text-sm">OWASP Top 10</span>
              {runningTest === 'owasp' && (
                <RefreshCw className="h-4 w-4 animate-spin" />
              )}
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => runSecurityTest('dependencies')}
              disabled={runningTest === 'dependencies'}
            >
              <Database className="h-6 w-6" />
              <span className="text-sm">Dependency Scan</span>
              {runningTest === 'dependencies' && (
                <RefreshCw className="h-4 w-4 animate-spin" />
              )}
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => runSecurityTest('nextjs')}
              disabled={runningTest === 'nextjs'}
            >
              <Settings className="h-6 w-6" />
              <span className="text-sm">Next.js Security</span>
              {runningTest === 'nextjs' && (
                <RefreshCw className="h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      {auditResult && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="owasp">OWASP 2024</TabsTrigger>
            <TabsTrigger value="nextjs">Next.js Security</TabsTrigger>
            <TabsTrigger value="rate-limits">Rate Limiting</TabsTrigger>
            <TabsTrigger value="checks">Detailed Checks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Summary</CardTitle>
                <CardDescription>
                  Overall security posture and key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(auditResult.summary.overallStatus)}
                      <div>
                        <div className="font-medium">Overall Security Status</div>
                        <div className="text-sm text-muted-foreground">
                          {auditResult.summary.passed} of {auditResult.summary.totalChecks} checks passed
                        </div>
                      </div>
                    </div>
                    <Badge variant={auditResult.summary.overallStatus === 'SECURE' ? 'default' : 'destructive'}>
                      {auditResult.summary.overallStatus}
                    </Badge>
                  </div>

                  {auditResult.summary.criticalFailures > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {auditResult.summary.criticalFailures} critical security issues require immediate attention.
                      </AlertDescription>
                    </Alert>
                  )}

                  {auditResult.summary.highFailures > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {auditResult.summary.highFailures} high priority security issues should be addressed soon.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="owasp" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>OWASP Top 10 2024 Compliance</CardTitle>
                <CardDescription>
                  Compliance status for OWASP Top 10 security risks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(auditResult.owaspCompliance).map(([key, compliance]) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(compliance.status)}
                        <div>
                          <div className="font-medium">{key}</div>
                          <div className="text-sm text-muted-foreground">
                            {compliance.details}
                          </div>
                        </div>
                      </div>
                      <Badge variant={compliance.status === 'COMPLIANT' ? 'default' : 'destructive'}>
                        {compliance.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nextjs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Next.js Security Best Practices</CardTitle>
                <CardDescription>
                  Implementation status of Next.js security recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(auditResult.nextjsCompliance).map(([key, compliance]) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(compliance.status)}
                        <div>
                          <div className="font-medium">{key}</div>
                          <div className="text-sm text-muted-foreground">
                            {compliance.details}
                          </div>
                        </div>
                      </div>
                      <Badge variant={compliance.status === 'IMPLEMENTED' ? 'default' : 'destructive'}>
                        {compliance.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rate-limits" className="space-y-4">
            <RateLimitDashboard />
          </TabsContent>

          <TabsContent value="checks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Security Checks</CardTitle>
                <CardDescription>
                  Individual security check results and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditResult.checks.map((check, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(check.status)}
                          <div>
                            <div className="font-medium">{check.check}</div>
                            <div className="text-sm text-muted-foreground">{check.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(check.severity)}
                          <Badge variant={check.status === 'PASS' ? 'default' : 'destructive'}>
                            {check.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {check.details && (
                        <div className="text-sm text-muted-foreground mb-2">
                          {check.details}
                        </div>
                      )}
                      
                      {check.fix && check.status !== 'PASS' && (
                        <div className="text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                          <strong>Fix:</strong> {check.fix}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}