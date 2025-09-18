'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  Users, 
  Globe, 
  RefreshCw,
  Trash2,
  TrendingUp
} from 'lucide-react';

interface RateLimitStats {
  totalRequests: number;
  uniqueIPs: number;
  violations: number;
  topIPs: Array<{ ip: string; requests: number; violations: number }>;
  endpointStats: Array<{ endpoint: string; requests: number; violations: number }>;
  timeframe: string;
  lastUpdated: string;
}

interface RateLimitViolation {
  ip: string;
  timestamp: number;
  endpoint: string;
  userAgent?: string;
  limit: number;
  attempts: number;
}

export default function RateLimitDashboard() {
  const [stats, setStats] = useState<RateLimitStats | null>(null);
  const [violations, setViolations] = useState<RateLimitViolation[]>([]);
  const [timeframe, setTimeframe] = useState('1h');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get admin token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const [statsResponse, violationsResponse] = await Promise.all([
        fetch(`/api/security/rate-limit?action=stats&timeframe=${timeframe}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }),
        fetch(`/api/security/rate-limit?action=violations&timeframe=${timeframe}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        })
      ]);

      if (!statsResponse.ok || !violationsResponse.ok) {
        throw new Error('Failed to fetch rate limit data');
      }

      const statsData = await statsResponse.json();
      const violationsData = await violationsResponse.json();

      setStats(statsData);
      setViolations(violationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  const clearData = async (target: string) => {
    try {
      // Get admin token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch(`/api/security/rate-limit?target=${target}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear data');
      }

      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear data');
    }
  };

  const resetMiddlewareRateLimits = async (action: string = 'all') => {
    try {
      // Get admin token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch(`/api/admin/reset-rate-limits?action=${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reset middleware rate limits');
      }

      const result = await response.json();
      
      // Show success message
      setError(null);
      
      // Refresh stats after reset
      await fetchStats();
      
      // You could add a success toast here if you have a toast system
      console.log('Middleware rate limits reset successfully:', result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset middleware rate limits');
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeframe, fetchStats]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, timeframe, fetchStats]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getViolationSeverity = (violations: number) => {
    if (violations >= 10) return 'destructive';
    if (violations >= 5) return 'default';
    return 'secondary';
  };

  if (error) {
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
          <h2 className="text-2xl font-bold tracking-tight">Rate Limit Monitoring</h2>
          <p className="text-muted-foreground">
            Monitor rate limiting activity and violations in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="15m">Last 15 minutes</option>
            <option value="1h">Last hour</option>
            <option value="6h">Last 6 hours</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className={`h-4 w-4 mr-2 ${autoRefresh ? 'text-green-500' : 'text-gray-400'}`} />
            Auto Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                in the last {timeframe}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueIPs}</div>
              <p className="text-xs text-muted-foreground">
                distinct IP addresses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Violations</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.violations}</div>
              <p className="text-xs text-muted-foreground">
                rate limit violations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {new Date(stats.lastUpdated).toLocaleTimeString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(stats.lastUpdated).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rate Limit Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Rate Limit Controls
          </CardTitle>
          <CardDescription>
            Two types of controls: Active Rate Limit Reset (unblocks requests) vs. Monitoring Data Cleanup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Active Rate Limit Reset */}
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Active Rate Limit Reset (Unblocks Requests)
              </h4>
              <p className="text-sm text-red-700 mb-3">
                These buttons reset the actual middleware rate limits that are currently blocking requests. 
                Use these if forms/APIs are returning 429 "Too Many Requests" errors.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => resetMiddlewareRateLimits('all')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset ALL Active Limits
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resetMiddlewareRateLimits('contact')}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Contact/Form Limits Only
                </Button>
              </div>
            </div>

            {/* Monitoring Data Cleanup */}
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Monitoring Data Cleanup (Dashboard Only)
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                These buttons only clear the violation history and statistics shown in this dashboard. 
                They do NOT unblock requests - use the red buttons above for that.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearData('violations')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Violation History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearData('all')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Dashboard Data
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Tabs defaultValue="violations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="violations">Recent Violations</TabsTrigger>
          <TabsTrigger value="top-ips">Top IPs</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoint Stats</TabsTrigger>
        </TabsList>



        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Violations</CardTitle>
                <CardDescription>
                  Latest rate limit violations in the selected timeframe
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearData('violations')}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Violations
              </Button>
            </CardHeader>
            <CardContent>
              {violations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No rate limit violations in the selected timeframe</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {violations.slice(0, 20).map((violation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">{violation.ip}</Badge>
                          <span className="text-sm font-medium">{violation.endpoint}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(violation.timestamp)} • 
                          {violation.attempts} attempts (limit: {violation.limit})
                        </div>
                        {violation.userAgent && (
                          <div className="text-xs text-muted-foreground truncate mt-1">
                            UA: {violation.userAgent}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-ips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top IPs by Request Volume</CardTitle>
              <CardDescription>
                IP addresses with the highest request counts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.topIPs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No IP data available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats?.topIPs.map((ip, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{ip.ip}</div>
                          <div className="text-sm text-muted-foreground">
                            {ip.requests} requests
                          </div>
                        </div>
                      </div>
                      {ip.violations > 0 && (
                        <Badge variant={getViolationSeverity(ip.violations)}>
                          {ip.violations} violations
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Endpoint Statistics</CardTitle>
              <CardDescription>
                Request and violation counts by endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.endpointStats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No endpoint data available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats?.endpointStats.map((endpoint, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium truncate">{endpoint.endpoint}</div>
                        <div className="text-sm text-muted-foreground">
                          {endpoint.requests} requests
                        </div>
                      </div>
                      {endpoint.violations > 0 && (
                        <Badge variant={getViolationSeverity(endpoint.violations)}>
                          {endpoint.violations} violations
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
