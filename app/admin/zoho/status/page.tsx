'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Database,
  FileText,
  FolderOpen,
  Users,
  Key,
  Activity,
  Plus
} from 'lucide-react';

interface ServiceStatus {
  status: 'connected' | 'error' | 'warning';
  message: string;
  lastChecked: string;
  responseTime?: number;
  details?: any;
}

interface ZohoStatus {
  crm: ServiceStatus;
  campaigns: ServiceStatus;
  bookings: ServiceStatus;
  books: ServiceStatus;
  projects: ServiceStatus;
  workdrive: ServiceStatus;
  token: ServiceStatus;
  overall: 'healthy' | 'degraded' | 'down';
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'connected':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-400" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    connected: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    healthy: 'bg-green-100 text-green-800 border-green-200',
    degraded: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    down: 'bg-red-100 text-red-800 border-red-200'
  };

  // Handle undefined or null status
  if (!status || typeof status !== 'string') {
    return (
      <Badge className="bg-gray-100 text-gray-800">
        Unknown
      </Badge>
    );
  }

  return (
    <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function ZohoStatusDashboard() {
  const [status, setStatus] = useState<ZohoStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [showTokenGenerator, setShowTokenGenerator] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching Zoho status from /api/zoho/status...');
      
      // Get admin auth token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
        console.log('🔑 Using stored auth token for request');
      } else {
        console.warn('⚠️ No auth token found in localStorage');
        // Try with query parameter as fallback for testing
        const adminPassword = 'admin123'; // Default password
        headers['X-Admin-Fallback'] = adminPassword;
      }
      
      // Construct URL with fallback authentication
      let apiUrl = '/api/zoho/status';
      if (!authToken) {
        // If no auth token, use query parameter as fallback
        apiUrl += '?admin_password=admin123';
        console.log('🔍 Using query parameter fallback authentication');
      }
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
        cache: 'no-cache' // Prevent caching issues
      });
      
      console.log('📊 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Received data:', data);
      
      setStatus(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('❌ Failed to fetch Zoho status:', error);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const formatResponseTime = (time?: number) => {
    if (!time) return 'N/A';
    return `${time}ms`;
  };

  const formatLastChecked = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getOverallStatusColor = (overall: string) => {
    switch (overall) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'down': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Zoho Integration Status</h1>
            <p className="text-muted-foreground text-lg">
              Monitor your Zoho One India integration health and performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowTokenGenerator(!showTokenGenerator)} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              {showTokenGenerator ? 'Hide' : 'Generate'} Tokens
            </Button>
            <Button 
              onClick={fetchStatus} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </div>
        </div>

        {/* Overall Status */}
        {status && (
          <Card className={`mb-8 border-2 ${getOverallStatusColor(status.overall)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8" />
                  <div>
                    <CardTitle className="text-2xl">Overall Status</CardTitle>
                    <p className="text-sm opacity-75">
                      Last updated: {lastRefresh?.toLocaleTimeString() || 'Never'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold capitalize">{status.overall}</div>
                  <StatusBadge status={status.overall} />
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Token Generation Section */}
        {showTokenGenerator && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Key className="h-6 w-6 text-orange-600" />
                <div>
                  <CardTitle className="text-xl text-orange-800">Generate Refresh Tokens</CardTitle>
                  <p className="text-sm text-orange-700">
                    Generate refresh tokens for your Zoho integration. Use this if you're getting authentication errors.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold mb-2 text-orange-800">Quick Setup Instructions:</h4>
                <ol className="text-sm text-orange-700 space-y-1 list-decimal list-inside">
                  <li>Make sure you have ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET in your environment</li>
                  <li>Click the button below to open the token generator</li>
                  <li>Follow the 3-step wizard to get your refresh token</li>
                  <li>Copy the token to your .env.Production file</li>
                  <li>Restart your application to apply the new token</li>
                </ol>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.open('/admin/zoho/oauth', '_blank')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Open Token Generator
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowTokenGenerator(false)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Status Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* CRM Status */}
          {status?.crm && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Zoho CRM</CardTitle>
                      <p className="text-sm text-muted-foreground">Leads Only</p>
                    </div>
                  </div>
                  <StatusIcon status={status.crm.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusBadge status={status.crm.status} />
                <p className="text-sm">{status.crm.message}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Response: {formatResponseTime(status.crm.responseTime)}</div>
                  <div>Last checked: {formatLastChecked(status.crm.lastChecked)}</div>
                  {status.crm.details && (
                    <>
                      {status.crm.details.recordCount !== undefined && (
                        <div>Records: {status.crm.details.recordCount}</div>
                      )}
                      {status.crm.details.endpoint && (
                        <div>Endpoint: {status.crm.details.endpoint}</div>
                      )}
                      {status.crm.details.permissions && (
                        <div className="text-orange-600 font-medium">Access: {status.crm.details.permissions}</div>
                      )}
                      {status.crm.details.error && (
                        <div className="text-red-600 font-medium">Error: {status.crm.details.error}</div>
                      )}
                      {status.crm.details.troubleshooting && (
                        <div className="text-blue-600 text-xs mt-2 p-2 bg-blue-50 rounded">
                          💡 {status.crm.details.troubleshooting}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campaigns Status */}
          {status?.campaigns && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <FileText className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Zoho Campaigns</CardTitle>
                      <p className="text-sm text-muted-foreground">Contact Access Only</p>
                    </div>
                  </div>
                  <StatusIcon status={status.campaigns.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusBadge status={status.campaigns.status} />
                <p className="text-sm">{status.campaigns.message}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Response: {formatResponseTime(status.campaigns.responseTime)}</div>
                  <div>Last checked: {formatLastChecked(status.campaigns.lastChecked)}</div>
                  {status.campaigns.details && (
                    <>
                      {status.campaigns.details.listCount !== undefined && (
                        <div>Lists: {status.campaigns.details.listCount}</div>
                      )}
                      {status.campaigns.details.endpoint && (
                        <div>Endpoint: {status.campaigns.details.endpoint}</div>
                      )}
                      {status.campaigns.details.permissions && (
                        <div className="text-orange-600 font-medium">Access: {status.campaigns.details.permissions}</div>
                      )}
                      {status.campaigns.details.listId && (
                        <div>List ID: {status.campaigns.details.listId}</div>
                      )}
                      {status.campaigns.details.error && (
                        <div className="text-red-600 font-medium">Error: {status.campaigns.details.error}</div>
                      )}
                      {status.campaigns.details.troubleshooting && (
                        <div className="text-blue-600 text-xs mt-2 p-2 bg-blue-50 rounded">
                          💡 {status.campaigns.details.troubleshooting}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bookings Status */}
          {status?.bookings && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Clock className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Zoho Bookings</CardTitle>
                      <p className="text-sm text-muted-foreground">Create Access Only</p>
                    </div>
                  </div>
                  <StatusIcon status={status.bookings.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusBadge status={status.bookings.status} />
                <p className="text-sm">{status.bookings.message}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Response: {formatResponseTime(status.bookings.responseTime)}</div>
                  <div>Last checked: {formatLastChecked(status.bookings.lastChecked)}</div>
                  {status.bookings.details && (
                    <>
                      {status.bookings.details.serviceCount !== undefined && (
                        <div>Services: {status.bookings.details.serviceCount}</div>
                      )}
                      {status.bookings.details.endpoint && (
                        <div>Endpoint: {status.bookings.details.endpoint}</div>
                      )}
                      {status.bookings.details.permissions && (
                        <div className="text-orange-600 font-medium">Access: {status.bookings.details.permissions}</div>
                      )}
                      {status.bookings.details.workspaceId && (
                        <div>Workspace: {status.bookings.details.workspaceId}</div>
                      )}
                      {status.bookings.details.serviceId && (
                        <div>Service ID: {status.bookings.details.serviceId}</div>
                      )}
                      {status.bookings.details.error && (
                        <div className="text-red-600 font-medium">Error: {status.bookings.details.error}</div>
                      )}
                      {status.bookings.details.troubleshooting && (
                        <div className="text-blue-600 text-xs mt-2 p-2 bg-blue-50 rounded">
                          💡 {status.bookings.details.troubleshooting}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Books Status */}
          {status?.books && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Zoho Books</CardTitle>
                      <p className="text-sm text-muted-foreground">Accounting & Invoicing</p>
                    </div>
                  </div>
                  <StatusIcon status={status.books.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusBadge status={status.books.status} />
                <p className="text-sm">{status.books.message}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Response: {formatResponseTime(status.books.responseTime)}</div>
                  <div>Last checked: {formatLastChecked(status.books.lastChecked)}</div>
                  {status.books.details && (
                    <>
                      {status.books.details.orgId && (
                        <div>Org ID: {status.books.details.orgId}</div>
                      )}
                      {status.books.details.missingConfig && (
                        <div className="text-yellow-600 font-medium">Missing: {status.books.details.missingConfig}</div>
                      )}
                      {status.books.details.error && (
                        <div className="text-red-600 font-medium">Error: {status.books.details.error}</div>
                      )}
                      {status.books.details.troubleshooting && (
                        <div className="text-blue-600 text-xs mt-2 p-2 bg-blue-50 rounded">
                          💡 {status.books.details.troubleshooting}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects Status */}
          {status?.projects && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Database className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Zoho Projects</CardTitle>
                      <p className="text-sm text-muted-foreground">Project Management</p>
                    </div>
                  </div>
                  <StatusIcon status={status.projects.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusBadge status={status.projects.status} />
                <p className="text-sm">{status.projects.message}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Response: {formatResponseTime(status.projects.responseTime)}</div>
                  <div>Last checked: {formatLastChecked(status.projects.lastChecked)}</div>
                  {status.projects.details && (
                    <>
                      {status.projects.details.portalId && (
                        <div>Portal ID: {status.projects.details.portalId}</div>
                      )}
                      {status.projects.details.missingConfig && (
                        <div className="text-yellow-600 font-medium">Missing: {status.projects.details.missingConfig}</div>
                      )}
                      {status.projects.details.error && (
                        <div className="text-red-600 font-medium">Error: {status.projects.details.error}</div>
                      )}
                      {status.projects.details.troubleshooting && (
                        <div className="text-blue-600 text-xs mt-2 p-2 bg-blue-50 rounded">
                          💡 {status.projects.details.troubleshooting}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* WorkDrive Status */}
          {status?.workdrive && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FolderOpen className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Zoho WorkDrive</CardTitle>
                      <p className="text-sm text-muted-foreground">File Storage</p>
                    </div>
                  </div>
                  <StatusIcon status={status.workdrive.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusBadge status={status.workdrive.status} />
                <p className="text-sm">{status.workdrive.message}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Response: {formatResponseTime(status.workdrive.responseTime)}</div>
                  <div>Last checked: {formatLastChecked(status.workdrive.lastChecked)}</div>
                  {status.workdrive.details && (
                    <>
                      {status.workdrive.details.fileCount !== undefined && (
                        <div>Files: {status.workdrive.details.fileCount}</div>
                      )}
                      {status.workdrive.details.endpoint && (
                        <div>Endpoint: {status.workdrive.details.endpoint}</div>
                      )}
                      {status.workdrive.details.error && (
                        <div className="text-red-600 font-medium">Error: {status.workdrive.details.error}</div>
                      )}
                      {status.workdrive.details.troubleshooting && (
                        <div className="text-blue-600 text-xs mt-2 p-2 bg-blue-50 rounded">
                          💡 {status.workdrive.details.troubleshooting}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Token Status */}
          {status?.token && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Key className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Authentication</CardTitle>
                      <p className="text-sm text-muted-foreground">Token Management</p>
                    </div>
                  </div>
                  <StatusIcon status={status.token.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusBadge status={status.token.status} />
                <p className="text-sm">{status.token.message}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Response: {formatResponseTime(status.token.responseTime)}</div>
                  <div>Last checked: {formatLastChecked(status.token.lastChecked)}</div>
                  {status.token.details && (
                    <>
                      {status.token.details.region && (
                        <div>Region: {status.token.details.region}</div>
                      )}
                      {status.token.details.tokenRefresh && (
                        <div>Token Refresh: {status.token.details.tokenRefresh}</div>
                      )}
                      {status.token.details.errors && status.token.details.errors.length > 0 && (
                        <div className="text-red-600 font-medium">
                          Config Errors: {status.token.details.errors.join(', ')}
                        </div>
                      )}
                      {status.token.details.troubleshooting && (
                        <div className="text-blue-600 text-xs mt-2 p-2 bg-blue-50 rounded">
                          💡 {status.token.details.troubleshooting}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Debug Information */}
        {status && (
          <Card className="mb-8 border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Debug Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <details className="cursor-pointer">
                <summary className="text-sm font-medium mb-2">Raw API Response (Click to expand)</summary>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                  {JSON.stringify(status, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && !status && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="text-lg">Checking Zoho service status...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && !status && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-8">
              <div className="text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Status</h3>
                <p className="text-red-600 mb-4">
                  Unable to fetch Zoho integration status. This could be due to authentication issues or server problems.
                </p>
                <Button onClick={fetchStatus} className="flex items-center gap-2 mx-auto">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
