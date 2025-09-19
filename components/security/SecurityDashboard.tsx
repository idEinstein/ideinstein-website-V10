/**
 * Real-time Security Dashboard Component
 * Displays live security monitoring, trends, and compliance reporting
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Database,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  Clock,
  Award
} from 'lucide-react';
import RateLimitDashboard from './RateLimitDashboard';

interface SecurityMetrics {
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

interface SecurityCategoryMetrics {
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

interface SecurityTrend {
  category: string;
  metric: string;
  value: number;
  change: number;
  changePercent: number;
  direction: 'UP' | 'DOWN' | 'STABLE';
  timestamp: string;
}

interface SecurityAlert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  title: string;
  description: string;
  recommendation: string;
  timestamp: string;
  acknowledged: boolean;
}

interface ComplianceReport {
  framework: 'OWASP_2024' | 'SOC2' | 'ISO27001';
  overallCompliance: number;
  categories: ComplianceCategory[];
  certificationReadiness: boolean;
  recommendations: string[];
  generatedAt: string;
}

interface ComplianceCategory {
  id: string;
  name: string;
  compliance: number;
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
  requirements: ComplianceRequirement[];
}

interface ComplianceRequirement {
  id: string;
  description: string;
  status: 'MET' | 'PARTIAL' | 'NOT_MET';
  evidence: string[];
  gaps: string[];
}

interface MonitoringStatus {
  isRunning: boolean;
  lastRun: string | null;
  nextRun: string | null;
  activeAlertsCount: number;
}

export default function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [compliance, setCompliance] = useState<ComplianceReport | null>(null);
  const [monitoringStatus, setMonitoringStatus] = useState<MonitoringStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get admin token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      // Fetch real-time metrics
      const [metricsResponse, complianceResponse, statusResponse] = await Promise.all([
        fetch('/api/security/monitoring?type=metrics', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        fetch('/api/security/monitoring?type=compliance', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        fetch('/api/security/monitoring?type=status', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        })
      ]);

      if (!metricsResponse.ok || !complianceResponse.ok || !statusResponse.ok) {
        throw new Error('Failed to fetch security data');
      }

      const [metricsData, complianceData, statusData] = await Promise.all([
        metricsResponse.json(),
        complianceResponse.json(),
        statusResponse.json()
      ]);

      setMetrics(metricsData.data);
      setCompliance(complianceData.data);
      setMonitoringStatus(statusData.data);
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

  const toggleAutomatedMonitoring = async () => {
    try {
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }

      const action = monitoringStatus?.isRunning ? 'stop_monitoring' : 'start_monitoring';
      
      const response = await fetch('/api/security/monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ action, intervalMinutes: 15 })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle monitoring');
      }

      // Refresh status
      await fetchSecurityData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle monitoring');
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }

      const response = await fetch('/api/security/monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ action: 'acknowledge_alert', alertId })
      });

      if (!response.ok) {
        throw new Error('Failed to acknowledge alert');
      }

      // Refresh data
      await fetchSecurityData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to acknowledge alert');
    }
  };

  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
      setAutoRefresh(false);
    } else {
      const interval = setInterval(fetchSecurityData, 30000); // 30 seconds
      setRefreshInterval(interval);
      setAutoRefresh(true);
    }
  };

  useEffect(() => {
    fetchSecurityData();
    
    // Cleanup interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SECURE':
      case 'COMPLIANT':
      case 'MET':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'VULNERABLE':
      case 'NON_COMPLIANT':
      case 'NOT_MET':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'NEEDS_ATTENTION':
      case 'PARTIAL':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SECURE':
      case 'COMPLIANT':
      case 'MET':
        return 'text-green-500';
      case 'VULNERABLE':
      case 'NON_COMPLIANT':
      case 'NOT_MET':
        return 'text-red-500';
      case 'NEEDS_ATTENTION':
      case 'PARTIAL':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return 'text-green-500';
      case 'MEDIUM':
        return 'text-yellow-500';
      case 'HIGH':
        return 'text-orange-500';
      case 'CRITICAL':
        return 'text-red-500';
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

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'UP':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'DOWN':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  if (error && !metrics) {
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
            Real-time security monitoring and OWASP 2024 compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAutoRefresh}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSecurityData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {monitoringStatus && (
            <Button
              variant={monitoringStatus.isRunning ? "destructive" : "default"}
              size="sm"
              onClick={toggleAutomatedMonitoring}
            >
              <Activity className="h-4 w-4 mr-2" />
              {monitoringStatus.isRunning ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
          )}
        </div>
      </div>

      {/* Security Overview */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.overallScore}%
              </div>
              <p className="text-xs text-muted-foreground">
                Security score
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getRiskLevelColor(metrics.riskLevel)}`}>
                {metrics.riskLevel}
              </div>
              <p className="text-xs text-muted-foreground">
                Current risk level
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {metrics.complianceScore}%
              </div>
              <p className="text-xs text-muted-foreground">
                OWASP compliance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {metrics.alerts.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {new Date(metrics.timestamp).toLocaleTimeString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(metrics.timestamp).toLocaleDateString()}
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
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => runSecurityTest('documentation')}
              disabled={runningTest === 'documentation'}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Generate Docs</span>
              {runningTest === 'documentation' && (
                <RefreshCw className="h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      {metrics && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="rate-limits">Rate Limiting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Summary</CardTitle>
                <CardDescription>
                  Real-time security posture and key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-8 w-8 text-blue-500" />
                      <div>
                        <div className="font-medium">Overall Security Score</div>
                        <div className="text-sm text-muted-foreground">
                          {metrics.overallScore}% security compliance
                        </div>
                      </div>
                    </div>
                    <Badge variant={metrics.overallScore >= 80 ? 'default' : 'destructive'}>
                      {metrics.overallScore >= 80 ? 'GOOD' : 'NEEDS IMPROVEMENT'}
                    </Badge>
                  </div>

                  {metrics.riskLevel === 'CRITICAL' && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Critical security risk detected. Immediate action required.
                      </AlertDescription>
                    </Alert>
                  )}

                  {metrics.riskLevel === 'HIGH' && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        High security risk detected. Address issues within 24 hours.
                      </AlertDescription>
                    </Alert>
                  )}

                  {metrics.alerts.length > 0 && (
                    <Alert>
                      <Bell className="h-4 w-4" />
                      <AlertDescription>
                        {metrics.alerts.length} active security alerts require attention.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(metrics.categories).map(([category, data]) => (
                <Card key={category}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </CardTitle>
                    {getStatusIcon(data.status)}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">{data.score}%</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Passed:</span>
                        <span className="text-green-600">{data.checks.passed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Warnings:</span>
                        <span className="text-yellow-600">{data.checks.warnings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Failed:</span>
                        <span className="text-red-600">{data.checks.failed}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={data.status === 'SECURE' ? 'default' : 'destructive'}
                      className="mt-2"
                    >
                      {data.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Trends</CardTitle>
                <CardDescription>
                  Track security metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.trends.length > 0 ? (
                    metrics.trends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getTrendIcon(trend.direction)}
                          <div>
                            <div className="font-medium">{trend.category} {trend.metric}</div>
                            <div className="text-sm text-muted-foreground">
                              Current value: {trend.value}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${
                            trend.direction === 'UP' ? 'text-green-600' : 
                            trend.direction === 'DOWN' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {trend.changePercent > 0 ? '+' : ''}{trend.changePercent}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {trend.direction === 'UP' ? 'Improving' : 
                             trend.direction === 'DOWN' ? 'Declining' : 'Stable'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No trend data available yet. Trends will appear after multiple monitoring cycles.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
                <CardDescription>
                  Active security alerts and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.alerts.length > 0 ? (
                    metrics.alerts.map((alert) => (
                      <div key={alert.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className={`h-5 w-5 ${
                              alert.severity === 'CRITICAL' ? 'text-red-500' :
                              alert.severity === 'HIGH' ? 'text-orange-500' :
                              alert.severity === 'MEDIUM' ? 'text-yellow-500' : 'text-blue-500'
                            }`} />
                            <div>
                              <div className="font-medium">{alert.title}</div>
                              <div className="text-sm text-muted-foreground">{alert.category}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getSeverityBadge(alert.severity)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              Acknowledge
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-2">
                          {alert.description}
                        </div>
                        
                        <div className="text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                          <strong>Recommendation:</strong> {alert.recommendation}
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-2">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      No active security alerts. Your system is secure!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            {compliance && (
              <Card>
                <CardHeader>
                  <CardTitle>OWASP 2024 Compliance Report</CardTitle>
                  <CardDescription>
                    Detailed compliance status and certification readiness
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Award className="h-8 w-8 text-blue-500" />
                        <div>
                          <div className="font-medium">Overall Compliance</div>
                          <div className="text-sm text-muted-foreground">
                            {compliance.overallCompliance}% compliant
                          </div>
                        </div>
                      </div>
                      <Badge variant={compliance.certificationReadiness ? 'default' : 'destructive'}>
                        {compliance.certificationReadiness ? 'CERTIFICATION READY' : 'NOT READY'}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {compliance.categories.map((category) => (
                        <div key={category.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(category.status)}
                              <div>
                                <div className="font-medium">{category.id} - {category.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {category.compliance}% compliant
                                </div>
                              </div>
                            </div>
                            <Badge variant={category.status === 'COMPLIANT' ? 'default' : 'destructive'}>
                              {category.status}
                            </Badge>
                          </div>
                          
                          {category.requirements.map((req) => (
                            <div key={req.id} className="ml-6 mt-2 text-sm">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(req.status)}
                                <span>{req.description}</span>
                              </div>
                              {req.gaps.length > 0 && (
                                <div className="ml-6 mt-1 text-xs text-red-600">
                                  Gaps: {req.gaps.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {compliance.recommendations.length > 0 && (
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="font-medium mb-2">Recommendations:</div>
                        <ul className="text-sm space-y-1">
                          {compliance.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Status</CardTitle>
                <CardDescription>
                  Automated security monitoring and alerting system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {monitoringStatus && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className={`h-8 w-8 ${monitoringStatus.isRunning ? 'text-green-500' : 'text-gray-500'}`} />
                        <div>
                          <div className="font-medium">Automated Monitoring</div>
                          <div className="text-sm text-muted-foreground">
                            {monitoringStatus.isRunning ? 'Running' : 'Stopped'}
                          </div>
                        </div>
                      </div>
                      <Badge variant={monitoringStatus.isRunning ? 'default' : 'secondary'}>
                        {monitoringStatus.isRunning ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium mb-1">Last Run</div>
                        <div className="text-sm text-muted-foreground">
                          {monitoringStatus.lastRun ? 
                            new Date(monitoringStatus.lastRun).toLocaleString() : 
                            'Never'
                          }
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium mb-1">Next Run</div>
                        <div className="text-sm text-muted-foreground">
                          {monitoringStatus.nextRun ? 
                            new Date(monitoringStatus.nextRun).toLocaleString() : 
                            'Not scheduled'
                          }
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium mb-2">Monitoring Features:</div>
                      <ul className="text-sm space-y-1">
                        <li>• Real-time security metrics collection</li>
                        <li>• Automated vulnerability detection</li>
                        <li>• Compliance monitoring and reporting</li>
                        <li>• Trend analysis and alerting</li>
                        <li>• Certification readiness assessment</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rate-limits" className="space-y-4">
            <RateLimitDashboard />
          </TabsContent>
        </Tabs>
      )}

      {/* Security Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Security Tests & Reports
          </CardTitle>
          <CardDescription>
            Run comprehensive security tests and generate reports
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
              <span className="text-sm">OWASP Compliance</span>
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
              onClick={() => runSecurityTest('certification')}
              disabled={runningTest === 'certification'}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Certification Report</span>
              {runningTest === 'certification' && (
                <RefreshCw className="h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}