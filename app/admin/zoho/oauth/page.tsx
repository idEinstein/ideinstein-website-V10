'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface TokenResponse {
  success: boolean;
  service: string;
  tokens?: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
  instructions?: {
    message: string;
    envVariable: string;
    refreshToken: string;
    expiresIn: string;
  };
  error?: string;
  message?: string;
}

interface AuthUrlResponse {
  success: boolean;
  service: string;
  authorizationUrl?: string;
  instructions?: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    redirectUri: string;
  };
  error?: string;
  message?: string;
}

export default function ZohoOAuthPage() {
  const [selectedService, setSelectedService] = useState<string>('crm');
  const [authCode, setAuthCode] = useState<string>('');
  const [authUrl, setAuthUrl] = useState<string>('');
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const services = [
    { value: 'crm', label: 'Zoho CRM', envVar: 'ZOHO_REFRESH_TOKEN' },
    { value: 'books', label: 'Zoho Books', envVar: 'ZOHO_BOOKS_REFRESH_TOKEN' },
    { value: 'projects', label: 'Zoho Projects', envVar: 'ZOHO_PROJECTS_REFRESH_TOKEN' },
    { value: 'workdrive', label: 'Zoho WorkDrive', envVar: 'ZOHO_WORKDRIVE_REFRESH_TOKEN' },
  ];

  const generateAuthUrl = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/zoho/oauth/generate-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service: selectedService }),
      });

      const data: AuthUrlResponse = await response.json();
      
      if (data.success && data.authorizationUrl) {
        setAuthUrl(data.authorizationUrl);
        setStep(2);
      } else {
        alert(`Error: ${data.message || 'Failed to generate authorization URL'}`);
      }
    } catch (error) {
      console.error('Error generating auth URL:', error);
      alert('Failed to generate authorization URL');
    } finally {
      setLoading(false);
    }
  };

  const exchangeCodeForTokens = async () => {
    if (!authCode.trim()) {
      alert('Please enter the authorization code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/zoho/oauth/generate-tokens?code=${encodeURIComponent(authCode)}&service=${selectedService}`
      );

      const data: TokenResponse = await response.json();
      setTokenResponse(data);
      
      if (data.success) {
        setStep(3);
      }
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      alert('Failed to exchange code for tokens');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const openAuthUrl = () => {
    if (authUrl) {
      window.open(authUrl, '_blank');
    }
  };

  const resetFlow = () => {
    setStep(1);
    setAuthCode('');
    setAuthUrl('');
    setTokenResponse(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Zoho OAuth Token Generator</h1>
        <p className="text-gray-600">
          Generate refresh tokens for Zoho services integration. This tool helps you get the tokens needed for your environment variables.
        </p>
      </div>

      {/* Step 1: Select Service and Generate Auth URL */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Select Zoho Service
            </CardTitle>
            <CardDescription>
              Choose which Zoho service you want to generate tokens for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="service">Zoho Service</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Make sure you have configured the CLIENT_ID and CLIENT_SECRET for{' '}
                <strong>{services.find(s => s.value === selectedService)?.label}</strong> in your environment variables.
              </AlertDescription>
            </Alert>

            <Button onClick={generateAuthUrl} disabled={loading} className="w-full">
              {loading ? 'Generating...' : 'Generate Authorization URL'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Authorize and Get Code */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Authorize Application
            </CardTitle>
            <CardDescription>
              Click the button below to authorize the application and get the authorization code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={openAuthUrl} className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Zoho Authorization
              </Button>
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(authUrl)}
                title="Copy URL to clipboard"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                After authorizing, you'll be redirected to a page that may show an error. 
                That's normal! Just copy the <strong>code</strong> parameter from the URL.
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="authCode">Authorization Code</Label>
              <Input
                id="authCode"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="Paste the authorization code here"
                className="font-mono"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={exchangeCodeForTokens} disabled={loading || !authCode.trim()} className="flex-1">
                {loading ? 'Exchanging...' : 'Generate Tokens'}
              </Button>
              <Button variant="outline" onClick={resetFlow}>
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Display Tokens */}
      {step === 3 && tokenResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {tokenResponse.success ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  Tokens Generated Successfully!
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">!</span>
                  Token Generation Failed
                </>
              )}
            </CardTitle>
            <CardDescription>
              {tokenResponse.success 
                ? 'Copy the refresh token to your environment variables'
                : 'There was an error generating the tokens'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tokenResponse.success && tokenResponse.instructions ? (
              <>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    {tokenResponse.instructions.message}
                  </AlertDescription>
                </Alert>

                <div>
                  <Label>Environment Variable</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tokenResponse.instructions.envVariable}
                      readOnly
                      className="font-mono bg-gray-50"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => copyToClipboard(tokenResponse.instructions!.envVariable)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Refresh Token (Copy this to your .env file)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tokenResponse.instructions.refreshToken}
                      readOnly
                      className="font-mono bg-gray-50 text-sm"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => copyToClipboard(tokenResponse.instructions!.refreshToken)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Add to your .env file:</h4>
                  <code className="text-sm">
                    {tokenResponse.instructions.envVariable}="{tokenResponse.instructions.refreshToken}"
                  </code>
                </div>
              </>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {tokenResponse.message || 'Unknown error occurred'}
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={resetFlow} variant="outline" className="w-full">
              Generate Another Token
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}