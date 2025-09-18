'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Shield, 
  Activity, 
  Clock, 
  HardDrive,
  Lock,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  BarChart3,
  Zap,
  Archive,
  Eye,
  EyeOff
} from 'lucide-react';

interface DatabaseConfig {
  connection: {
    url: string;
    ssl: {
      enabled: boolean;
      mode: string;
      cert?: string;
      key?: string;
      ca?: string;
    };
    pooling: {
      enabled: boolean;
      minConnections: number;
      maxConnections: number;
      idleTimeout: number;
      connectionTimeout: number;
    };
  };
  security: {
    encryption: {
      atRest: boolean;
      inTransit: boolean;
      keyRotation: boolean;
    };
    access: {
      readOnlyUsers: string[];
      adminUsers: string[];
      applicationUsers: string[];
    };
    audit: {
      enabled: boolean;
      logQueries: boolean;
      logConnections: boolean;
      retentionDays: number;
    };
  };
  backup: {
    enabled: boolean;
    frequency: string;
    retention: string;
    encryption: boolean;
    location: string;
    lastBackup?: string;
  };
  monitoring: {
    healthChecks: boolean;
    performanceMetrics: boolean;
    alerting: boolean;
    thresholds: {
      connectionCount: number;
      queryTime: number;
      diskUsage: number;
      cpuUsage: number;
    };
  };
}

interface DatabaseHealth {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  connections: {
    active: number;
    idle: number;
    total: number;
    max: number;
  };
  performance: {
    avgQueryTime: number;
    slowQueries: number;
    queriesPerSecond: number;
  };
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime: number;
  lastCheck: string;
}

interface SecurityAudit {
  sslEnabled: boolean;
  encryptionAtRest: boolean;
  encryptionInTransit: boolean;
  weakPasswords: number;
  unusedUsers: number;
  privilegedUsers: number;
  lastAudit: string;
  recommendations: string[];
}

export default function DatabaseSecurityDashboard() {
  const [config, setConfig] = useState<DatabaseConfig | null>(null);
  const [health, setHealth] = useState<DatabaseHealth | null>(null);
  const [audit, setAudit] = useState<SecurityAudit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSensitive, setShowSensitive] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const loadDatabaseConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get admin token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch('/api/database/config', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load database configuration');
      }
      
      const data = await response.json();
      setConfig(data.config);
      setHealth(data.health);
      setAudit(data.audit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const runSecurityAudit = async () => {
    try {
      setLoading(true);
      
      // Get admin token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch('/api/database/security-audit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to run security audit');
      }
      
      const data = await response.json();
      setAudit(data.audit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run security audit');
    } finally {
      setLoading(false);
    }
  };

  const updateConfiguration = async (updates: Partial<DatabaseConfig>) => {
    try {
      setLoading(true);
      
      // Get admin token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch('/api/database/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update configuration');
      }
      
      await loadDatabaseConfig();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      
      // Get admin token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch('/api/database/test-connection', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Connection test failed');
      }
      
      const data = await response.json();
      alert(`Connection test ${data.success ? 'successful' : 'failed'}!\n${data.message}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseConfig();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDatabaseConfig, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Database className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (error && !config) {
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Database Security Configuration</h2>
          <p className="text-muted-foreground">
            Monitor and configure database security, performance, and backup settings
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSensitive(!showSensitive)}
            className="whitespace-nowrap"
          >
            {showSensitive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            <span className="hidden sm:inline">{showSensitive ? 'Hide Sensitive' : 'Show Sensitive'}</span>
            <span className="sm:hidden">{showSensitive ? 'Hide' : 'Show'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={testConnection}
            disabled={loading}
            className="whitespace-nowrap"
          >
            <Wifi className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Test Connection</span>
            <span className="sm:hidden">Test</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDatabaseConfig}
            disabled={loading}
            className="whitespace-nowrap"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">↻</span>
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      {health && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Status</CardTitle>
              {getStatusIcon(health.status)}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(health.status)}`}>
                {health.status.toUpperCase()}
              </div>
              <p className="text-xs text-muted-foreground">
                Uptime: {formatUptime(health.uptime)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connections</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {health.connections.active}/{health.connections.max}
              </div>
              <p className="text-xs text-muted-foreground">
                {health.connections.idle} idle connections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {health.performance.avgQueryTime}ms
              </div>
              <p className="text-xs text-muted-foreground">
                {health.performance.queriesPerSecond} queries/sec
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {health.storage.percentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                {formatBytes(health.storage.used)} / {formatBytes(health.storage.total)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Configuration Tabs */}
      {config && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="audit">Security Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>SSL/TLS Encryption</span>
                    <Badge variant={config.connection.ssl.enabled ? 'default' : 'destructive'}>
                      {config.connection.ssl.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Connection Pooling</span>
                    <Badge variant={config.connection.pooling.enabled ? 'default' : 'secondary'}>
                      {config.connection.pooling.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Audit Logging</span>
                    <Badge variant={config.security.audit.enabled ? 'default' : 'secondary'}>
                      {config.security.audit.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Automated Backups</span>
                    <Badge variant={config.backup.enabled ? 'default' : 'destructive'}>
                      {config.backup.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {health && (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Average Query Time</span>
                        <span className="font-mono">{health.performance.avgQueryTime}ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Slow Queries</span>
                        <span className="font-mono">{health.performance.slowQueries}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Queries/Second</span>
                        <span className="font-mono">{health.performance.queriesPerSecond}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Connection Usage</span>
                        <span className="font-mono">
                          {Math.round((health.connections.active / health.connections.max) * 100)}%
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Configuration</CardTitle>
                <CardDescription>
                  Configure database security settings and encryption
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Encryption Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Encryption at Rest</div>
                        <div className="text-sm text-gray-600">Encrypt data stored on disk</div>
                      </div>
                      <Badge variant={config.security.encryption.atRest ? 'default' : 'destructive'}>
                        {config.security.encryption.atRest ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Encryption in Transit</div>
                        <div className="text-sm text-gray-600">Encrypt data during transmission</div>
                      </div>
                      <Badge variant={config.security.encryption.inTransit ? 'default' : 'destructive'}>
                        {config.security.encryption.inTransit ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Key Rotation</div>
                        <div className="text-sm text-gray-600">Automatic encryption key rotation</div>
                      </div>
                      <Badge variant={config.security.encryption.keyRotation ? 'default' : 'secondary'}>
                        {config.security.encryption.keyRotation ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Access Control</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium mb-2">Admin Users</div>
                      <div className="flex flex-wrap gap-2">
                        {config.security.access.adminUsers.map((user, index) => (
                          <Badge key={index} variant="destructive">{user}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium mb-2">Application Users</div>
                      <div className="flex flex-wrap gap-2">
                        {config.security.access.applicationUsers.map((user, index) => (
                          <Badge key={index} variant="default">{user}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium mb-2">Read-Only Users</div>
                      <div className="flex flex-wrap gap-2">
                        {config.security.access.readOnlyUsers.map((user, index) => (
                          <Badge key={index} variant="secondary">{user}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Connection Configuration</CardTitle>
                <CardDescription>
                  Configure database connection settings and SSL
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Connection String</h4>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <code className="text-sm font-mono">
                      {showSensitive ? config.connection.url : config.connection.url.replace(/:[^:@]*@/, ':***@')}
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">SSL Configuration</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">SSL Mode</div>
                        <div className="text-sm text-gray-600">{config.connection.ssl.mode}</div>
                      </div>
                      <Badge variant={config.connection.ssl.enabled ? 'default' : 'destructive'}>
                        {config.connection.ssl.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Connection Pooling</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Min Connections</div>
                      <div className="text-2xl font-bold">{config.connection.pooling.minConnections}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Max Connections</div>
                      <div className="text-2xl font-bold">{config.connection.pooling.maxConnections}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Idle Timeout</div>
                      <div className="text-2xl font-bold">{config.connection.pooling.idleTimeout}s</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Connection Timeout</div>
                      <div className="text-2xl font-bold">{config.connection.pooling.connectionTimeout}s</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  Backup Configuration
                </CardTitle>
                <CardDescription>
                  Configure automated database backups and recovery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-2">Backup Status</div>
                    <Badge variant={config.backup.enabled ? 'default' : 'destructive'}>
                      {config.backup.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-2">Frequency</div>
                    <div className="text-lg font-semibold">{config.backup.frequency}</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-2">Retention Period</div>
                    <div className="text-lg font-semibold">{config.backup.retention}</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-2">Encryption</div>
                    <Badge variant={config.backup.encryption ? 'default' : 'secondary'}>
                      {config.backup.encryption ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Backup Location</h4>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <code className="text-sm font-mono">{config.backup.location}</code>
                  </div>
                </div>

                {config.backup.lastBackup && (
                  <div>
                    <h4 className="font-medium mb-3">Last Backup</h4>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(config.backup.lastBackup).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring & Alerting</CardTitle>
                <CardDescription>
                  Configure database monitoring and alert thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-2">Health Checks</div>
                    <Badge variant={config.monitoring.healthChecks ? 'default' : 'secondary'}>
                      {config.monitoring.healthChecks ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-2">Performance Metrics</div>
                    <Badge variant={config.monitoring.performanceMetrics ? 'default' : 'secondary'}>
                      {config.monitoring.performanceMetrics ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Alert Thresholds</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Max Connections</div>
                      <div className="text-2xl font-bold">{config.monitoring.thresholds.connectionCount}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Query Time (ms)</div>
                      <div className="text-2xl font-bold">{config.monitoring.thresholds.queryTime}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Disk Usage (%)</div>
                      <div className="text-2xl font-bold">{config.monitoring.thresholds.diskUsage}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">CPU Usage (%)</div>
                      <div className="text-2xl font-bold">{config.monitoring.thresholds.cpuUsage}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Security Audit</CardTitle>
                  <CardDescription>
                    Review database security configuration and recommendations
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runSecurityAudit}
                  disabled={loading}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Run Audit
                </Button>
              </CardHeader>
              <CardContent>
                {audit ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium mb-2">SSL Status</div>
                        <Badge variant={audit.sslEnabled ? 'default' : 'destructive'}>
                          {audit.sslEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium mb-2">Weak Passwords</div>
                        <div className="text-2xl font-bold text-red-500">{audit.weakPasswords}</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium mb-2">Privileged Users</div>
                        <div className="text-2xl font-bold">{audit.privilegedUsers}</div>
                      </div>
                    </div>

                    {audit.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Security Recommendations</h4>
                        <div className="space-y-2">
                          {audit.recommendations.map((recommendation, index) => (
                            <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                <p className="text-sm text-yellow-800">{recommendation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-gray-500">
                      Last audit: {new Date(audit.lastAudit).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No security audit data available</p>
                    <p className="text-sm text-gray-400">Run a security audit to see recommendations</p>
                  </div>
                )}
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