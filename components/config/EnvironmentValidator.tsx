'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Settings, 
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';

interface ValidationResult {
  environment: string;
  isValid: boolean;
  timestamp: string;
  summary: {
    totalErrors: number;
    totalWarnings: number;
    missingRequired: number;
    suggestions: number;
  };
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
  missing?: string[];
  suggestions?: EnvSuggestion[];
  currentValues?: Record<string, string>;
}

interface ValidationError {
  key: string;
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

interface ValidationWarning {
  key: string;
  message: string;
  suggestion?: string;
}

interface EnvSuggestion {
  key: string;
  suggestion: string;
  reason: string;
}

function EnvironmentValidator() {
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [environment, setEnvironment] = useState('development');
  const [showValues, setShowValues] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEnvironment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get admin token from localStorage
      const authToken = localStorage.getItem('admin_auth_token');
      if (!authToken) {
        throw new Error('Admin authentication required');
      }
      
      const response = await fetch(`/api/config/validate-env?env=${environment}&includeValues=${showValues}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to validate environment');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [environment, showValues]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    validateEnvironment();
  }, [environment, validateEnvironment]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'destructive';
      case 'warning': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
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
          <h2 className="text-2xl font-bold tracking-tight">Environment Validator</h2>
          <p className="text-muted-foreground">
            Validate and manage environment variables for secure deployment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="development">Development</option>
            <option value="production">Production</option>
            <option value="preview">Preview</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowValues(!showValues)}
          >
            {showValues ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showValues ? 'Hide Values' : 'Show Values'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={validateEnvironment}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Validate
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      {result && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              {getStatusIcon(result.isValid)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.isValid ? 'Valid' : 'Invalid'}
              </div>
              <p className="text-xs text-muted-foreground">
                Environment: {result.environment}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {result.summary.totalErrors}
              </div>
              <p className="text-xs text-muted-foreground">
                Critical issues
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
                {result.summary.totalWarnings}
              </div>
              <p className="text-xs text-muted-foreground">
                Potential issues
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Missing</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.summary.missingRequired}
              </div>
              <p className="text-xs text-muted-foreground">
                Required variables
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Results */}
      {result && (
        <Tabs defaultValue="errors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="errors">
              Errors ({result.summary.totalErrors})
            </TabsTrigger>
            <TabsTrigger value="warnings">
              Warnings ({result.summary.totalWarnings})
            </TabsTrigger>
            <TabsTrigger value="missing">
              Missing ({result.summary.missingRequired})
            </TabsTrigger>
            <TabsTrigger value="suggestions">
              Suggestions ({result.summary.suggestions})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Validation Errors</CardTitle>
                <CardDescription>
                  Critical issues that must be resolved before deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.errors && result.errors.length > 0 ? (
                  <div className="space-y-4">
                    {result.errors.map((error, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={getSeverityColor(error.severity)}>
                                {error.key}
                              </Badge>
                              <Badge variant="outline">{error.severity}</Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{error.message}</p>
                            {error.suggestion && (
                              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <p className="text-sm text-blue-800">
                                  💡 <strong>Suggestion:</strong> {error.suggestion}
                                </p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(error.suggestion || error.message)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No validation errors found!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="warnings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Validation Warnings</CardTitle>
                <CardDescription>
                  Potential issues that should be reviewed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.warnings && result.warnings.length > 0 ? (
                  <div className="space-y-4">
                    {result.warnings.map((warning, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="default">{warning.key}</Badge>
                              <Badge variant="outline">warning</Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{warning.message}</p>
                            {warning.suggestion && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                <p className="text-sm text-yellow-800">
                                  💡 <strong>Suggestion:</strong> {warning.suggestion}
                                </p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(warning.suggestion || warning.message)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No warnings found!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Missing Required Variables</CardTitle>
                <CardDescription>
                  Environment variables that must be set for this environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.missing && result.missing.length > 0 ? (
                  <div className="space-y-2">
                    {result.missing.map((key, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">{key}</Badge>
                          <span className="text-sm text-gray-600">Required</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>All required variables are present!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Optional Suggestions</CardTitle>
                <CardDescription>
                  Optional variables that could enhance functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.suggestions && result.suggestions.length > 0 ? (
                  <div className="space-y-4">
                    {result.suggestions.map((suggestion, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{suggestion.key}</Badge>
                              <Badge variant="outline">optional</Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{suggestion.reason}</p>
                            <div className="bg-green-50 border border-green-200 rounded p-3">
                              <p className="text-sm text-green-800">
                                💡 <strong>Suggestion:</strong> {suggestion.suggestion}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(suggestion.suggestion)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No additional suggestions at this time</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default EnvironmentValidator;