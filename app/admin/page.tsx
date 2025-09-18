import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Rocket, 
  Shield, 
  Settings, 
  BarChart3,
  Globe,
  AlertTriangle,
  CheckCircle,
  Activity,
  Lock,
  Zap,
  Eye
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard | IdEinstein',
  description: 'Administrative dashboard for managing security, deployments, and configurations',
};

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your website's security, deployments, and configurations
          </p>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              🛡️ Enterprise Security Status: <span className="text-green-600">ACTIVE</span>
            </p>
            <p className="text-green-700 text-sm mt-1">
              ✅ HMAC Protection: All Forms | ✅ Rate Limiting: Global | ✅ CSP: Enforced | ✅ GDPR: Compliant
            </p>
          </div>
        </div>

        {/* Quick Status Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-lg font-bold text-green-500">Healthy</span>
              </div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Form Security</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-lg font-bold">HMAC Active</span>
              </div>
              <p className="text-xs text-muted-foreground">All 4 forms protected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rate Limiting</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-lg font-bold">Protected</span>
              </div>
              <p className="text-xs text-muted-foreground">60 req/min per IP</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">GDPR Status</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-lg font-bold">Compliant</span>
              </div>
              <p className="text-xs text-muted-foreground">Cookie consent ready</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {/* Security Monitoring Dashboard */}
          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Security Dashboard</CardTitle>
                  <CardDescription>
                    OWASP 2024 compliance, security audits, and threat monitoring
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• OWASP 2024 compliance monitoring</p>
                <p>• Enterprise-grade form protection</p>
                <p>• Real-time bot detection & prevention</p>
                <p>• GDPR compliance verification</p>
              </div>
              <Link href="/admin/security">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Open Security Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Database Security</CardTitle>
                  <CardDescription>
                    Monitor database health, security, and performance
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• Test database connections</p>
                <p>• Run security audits</p>
                <p>• Monitor performance metrics</p>
                <p>• Configure backup settings</p>
              </div>
              <Link href="/admin/database/security">
                <Button className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Open Database Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Vercel Deployment Dashboard */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Rocket className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Deployment Management</CardTitle>
                  <CardDescription>
                    Manage Vercel deployments and environment variables
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• Deploy to production</p>
                <p>• Sync environment variables</p>
                <p>• Monitor deployment status</p>
                <p>• Configure domains</p>
              </div>
              <Link href="/admin/deployment/vercel">
                <Button className="w-full">
                  <Rocket className="h-4 w-4 mr-2" />
                  Open Deployment Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Security Monitoring Dashboard */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Security Dashboard</CardTitle>
                  <CardDescription>
                    OWASP 2024 compliance, security audits, and threat monitoring
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• OWASP 2024 compliance monitoring</p>
                <p>• Run weekly/monthly security audits</p>
                <p>• Next.js security best practices</p>
                <p>• Rate limiting and threat analysis</p>
              </div>
              <Link href="/admin/security">
                <Button className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Open Security Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Environment Configuration Dashboard */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Environment Configuration</CardTitle>
                  <CardDescription>
                    Validate and manage environment variables and integrations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• Validate environment variables</p>
                <p>• Test service integrations</p>
                <p>• Generate configuration templates</p>
                <p>• Troubleshoot setup issues</p>
              </div>
              <Link href="/admin/config/environment">
                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Open Config Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Zoho Integration Dashboard */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Zoho Integration</CardTitle>
                  <CardDescription>
                    Monitor CRM, Books, Projects, and WorkDrive connections
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• CRM contact synchronization</p>
                <p>• Books invoice management</p>
                <p>• Projects integration</p>
                <p>• WorkDrive file storage</p>
              </div>
              <Link href="/admin/zoho/status">
                <Button className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  Open Zoho Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common administrative tasks and system checks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Database className="h-6 w-6" />
                  <span className="text-sm">Test Database</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Shield className="h-6 w-6" />
                  <span className="text-sm">Security Scan</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Globe className="h-6 w-6" />
                  <span className="text-sm">Deploy Site</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Settings className="h-6 w-6" />
                  <span className="text-sm">Validate Config</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="mt-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <AlertTriangle className="h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700">
              <p className="mb-4">
                New to these dashboards? Check out our comprehensive user guide that explains 
                how to use each dashboard and what all the indicators mean.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  📖 View User Guide
                </Button>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  🆘 Troubleshooting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}