'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Download, 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Github,
  Settings,
  Key,
  Globe,
  Shield,
  Zap,
  Database,
  Link,
  Plus,
  Trash2
} from 'lucide-react';

interface VercelConfig {
  project: any;
  vercelJson: any;
  packageJson: any;
  environmentFiles: Record<string, string>;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface VercelProject {
  id: string;
  name: string;
  framework: string;
  createdAt: number;
  targets?: {
    production?: {
      domain: string;
      url: string;
    };
  };
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  html_url: string;
}

interface WebhookConfig {
  id?: number;
  name: string;
  config: {
    url: string;
    content_type: 'json' | 'form';
    secret?: string;
  };
  events: string[];
  active: boolean;
}

export default function EnhancedVercelConfigDashboard() {
  const [config, setConfig] = useState<VercelConfig | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [projects, setProjects] = useState<VercelProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('ideinstein-website');
  const [domains, setDomains] = useState('');
  const [vercelToken, setVercelToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');
  
  // GitHub Integration State
  const [githubToken, setGithubToken] = useState('');
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  
  // Configuration State
  const [deploymentSettings, setDeploymentSettings] = useState({
    autoDeployOnPush: true,
    deployPreviews: true,
    protectedBranches: ['main', 'master'],
    buildCommand: 'npm run build',
    outputDirectory: '.next',
    installCommand: 'npm ci',
    nodeVersion: '18.x'
  });

  const generateConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get admin token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const domainList = domains.split(',').map(d => d.trim()).filter(Boolean);
      const response = await fetch(`/api/deployment/vercel/config?projectName=${encodeURIComponent(projectName)}&domains=${encodeURIComponent(domainList.join(','))}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate configuration');
      }
      
      const data = await response.json();
      setConfig(data.config);
      setValidation(data.validation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [projectName, domains]);

  const loadProjects = async () => {
    if (!vercelToken) return;
    
    try {
      setLoading(true);
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch(`/api/deployment/vercel/sync?token=${encodeURIComponent(vercelToken)}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load projects');
      }
      
      const data = await response.json();
      setProjects(data.projects?.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const syncEnvironmentVariables = async () => {
    if (!vercelToken || !selectedProject || !config) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch('/api/deployment/vercel/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          action: 'sync-env',
          vercelToken,
          projectId: selectedProject,
          environmentVariables: config.project.environmentVariables
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync environment variables');
      }
      
      const data = await response.json();
      alert(`Environment sync completed!\nCreated: ${data.result.created}\nUpdated: ${data.result.updated}\nDeleted: ${data.result.deleted}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync environment variables');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (content: string, filename: string, contentType: string = 'application/json') => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    generateConfig();
  }, [projectName, domains, generateConfig]);

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enhanced Deployment Configuration</h2>
          <p className="text-muted-foreground">
            Comprehensive Vercel and GitHub deployment management for IdEinstein
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateConfig}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Project Configuration</CardTitle>
          <CardDescription>
            Configure your deployment project settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="project-name" className="text-sm font-medium">Project Name</label>
              <input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="ideinstein-website"
              />
            </div>
            <div>
              <label htmlFor="domains" className="text-sm font-medium">Custom Domains (comma-separated)</label>
              <input
                id="domains"
                type="text"
                value={domains}
                onChange={(e) => setDomains(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="example.com, www.example.com"
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="vercel-token" className="text-sm font-medium">Vercel Token (for API operations)</label>
              <div className="flex gap-2">
                <input
                  id="vercel-token"
                  type={showToken ? 'text' : 'password'}
                  value={vercelToken}
                  onChange={(e) => setVercelToken(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder="Enter your Vercel API token"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowToken(!showToken)}
                  aria-label="Toggle token visibility"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                {vercelToken && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadProjects}
                    disabled={loading}
                  >
                    <Cloud className="h-4 w-4 mr-2" />
                    Load Projects
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="github-token" className="text-sm font-medium">GitHub Personal Access Token</label>
              <div className="flex gap-2">
                <input
                  id="github-token"
                  type={showGithubToken ? 'text' : 'password'}
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder="Enter your GitHub PAT"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGithubToken(!showGithubToken)}
                  aria-label="Toggle GitHub token visibility"
                >
                  {showGithubToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {projects.length > 0 && (
            <div>
              <label htmlFor="vercel-project" className="text-sm font-medium">Select Existing Vercel Project</label>
              <select
                id="vercel-project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.framework})
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Overview */}
      {validation && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Configuration Status</CardTitle>
              {getStatusIcon(validation.isValid)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {validation.isValid ? 'Valid' : 'Invalid'}
              </div>
              <p className="text-xs text-muted-foreground">
                Configuration validation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Environment Variables</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {config?.project.environmentVariables.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total variables
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Secrets</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {config?.project.environmentVariables.filter((env: any) => env.type === 'secret').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Secret variables
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validation Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {validation.errors.length + validation.warnings.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Errors & warnings
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Configuration Details */}
      {config && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-blue-500" />
                    Vercel Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Project:</span>
                    <Badge variant="outline">{projectName}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Framework:</span>
                    <Badge>{config.project.framework}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Build Command:</span>
                    <Badge variant="outline">{config.project.buildCommand}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Security Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">HMAC Secret:</span>
                    <Badge variant={config.project.environmentVariables.find((env: any) => env.key === 'FORM_HMAC_SECRET') ? "default" : "secondary"}>
                      {config.project.environmentVariables.find((env: any) => env.key === 'FORM_HMAC_SECRET') ? 'Configured' : 'Missing'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Admin Auth:</span>
                    <Badge variant={config.project.environmentVariables.find((env: any) => env.key === 'ADMIN_PASSWORD') ? "default" : "secondary"}>
                      {config.project.environmentVariables.find((env: any) => env.key === 'ADMIN_PASSWORD') ? 'Configured' : 'Missing'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Encryption:</span>
                    <Badge variant={config.project.environmentVariables.find((env: any) => env.key === 'ENCRYPTION_KEY') ? "default" : "secondary"}>
                      {config.project.environmentVariables.find((env: any) => env.key === 'ENCRYPTION_KEY') ? 'Configured' : 'Missing'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(config.vercelJson, null, 2))}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy vercel.json
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile(JSON.stringify(config.vercelJson, null, 2), 'vercel.json')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Config
                  </Button>
                  {selectedProject && vercelToken && (
                    <Button variant="default" size="sm" onClick={syncEnvironmentVariables} disabled={loading}>
                      <Upload className="h-4 w-4 mr-2" />
                      Sync Environment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>
                  Required environment variables for deployment with enhanced security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {config.project.environmentVariables.map((envVar: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Badge variant={envVar.type === 'secret' ? 'destructive' : 'outline'}>
                          {envVar.key}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {envVar.target.join(', ')}
                        </span>
                        {envVar.type === 'secret' && (
                          <Badge variant="secondary">Secret</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${envVar.key}=${envVar.value || 'your-value-here'}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="github" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  GitHub Integration
                </CardTitle>
                <CardDescription>
                  Connect your GitHub repository for automated deployments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Setup Instructions</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Generate a GitHub Personal Access Token with repo permissions</li>
                    <li>2. Enter the token in the configuration above</li>
                    <li>3. Select your repository from the loaded list</li>
                    <li>4. Configure webhooks for automated deployments</li>
                    <li>5. Connect the repository to your Vercel project</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Configuration</CardTitle>
                <CardDescription>
                  Build and deployment settings for your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(config.vercelJson, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Validation</CardTitle>
                <CardDescription>
                  Validation results for the generated configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {validation?.errors && validation.errors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-destructive mb-2">Errors</h4>
                    <div className="space-y-2">
                      {validation.errors.map((error, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">{error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validation?.warnings && validation.warnings.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-yellow-600 mb-2">Warnings</h4>
                    <div className="space-y-2">
                      {validation.warnings.map((warning, index) => (
                        <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">{warning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validation?.isValid && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <p className="text-sm text-green-800 font-medium">
                        Configuration is valid and ready for deployment!
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* External Links */}
      <Card>
        <CardHeader>
          <CardTitle>External Resources</CardTitle>
          <CardDescription>
            Quick access to deployment platforms and documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                <Cloud className="h-4 w-4 mr-2" />
                Vercel Dashboard
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                GitHub Tokens
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://vercel.com/docs" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Vercel Documentation
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://docs.github.com/en/developers/webhooks-and-events/webhooks" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                GitHub Webhooks
              </a>
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
