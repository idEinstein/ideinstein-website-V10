'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already authenticated on component mount
  useEffect(() => {
    const authToken = localStorage.getItem('admin_auth_token');
    const authExpiry = localStorage.getItem('admin_auth_expiry');
    
    if (authToken && authExpiry) {
      const expiryTime = parseInt(authExpiry);
      if (Date.now() < expiryTime) {
        // Verify token is still valid with server
        fetch('/api/admin/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: authToken })
        })
        .then(res => res.json())
        .then(data => {
          if (data.isAuthenticated) {
            setIsAuthenticated(true);
            console.log('✅ Existing token is valid');
          } else {
            console.log('❌ Existing token is invalid, clearing cache');
            clearAllCache();
          }
        })
        .catch(() => {
          console.log('❌ Token verification failed, clearing cache');
          clearAllCache();
        });
      } else {
        // Token expired, clear storage
        console.log('⏰ Token expired, clearing cache');
        clearAllCache();
      }
    }
  }, []);

  const clearAllCache = () => {
    // Clear localStorage
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_auth_expiry');
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear any other admin-related storage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('admin_') || key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('✅ Cleared all authentication cache');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clear any existing invalid tokens before attempting login
      clearAllCache();
      
      // Try to authenticate with server to get proper validation
      const response = await fetch('/api/admin/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Set authentication token with 24-hour expiry
          const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
          const authToken = btoa(`admin:${password}`); // Token format expected by server
          
          localStorage.setItem('admin_auth_token', authToken);
          localStorage.setItem('admin_auth_expiry', expiryTime.toString());
          
          setIsAuthenticated(true);
          setPassword('');
          console.log('✅ Authentication successful');
        } else {
          setError('Invalid password. Please check your password and try again.');
          console.log('❌ Authentication failed: Invalid password');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(`Authentication failed: ${errorData.message || 'Server error'}`);
        console.log('❌ Authentication failed: Server error', response.status);
      }
    } catch (err) {
      setError('Authentication failed. Please check your connection and try again.');
      console.log('❌ Authentication failed: Network error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_auth_expiry');
    setIsAuthenticated(false);
    setPassword('');
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <CardDescription>
                Enter the admin password to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Admin Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !password.trim()}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Access Dashboard
                    </>
                  )}
                </Button>

                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full mt-2" 
                  onClick={() => {
                    clearAllCache();
                    setError('');
                    alert('Cache cleared! Please try logging in again.');
                  }}
                  disabled={loading}
                >
                  Clear All Cache
                </Button>
              </form>

              {process.env.NODE_ENV !== 'production' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Default Password</h4>
                  <p className="text-sm text-blue-700">
                    For development: <code className="bg-blue-100 px-2 py-1 rounded">admin123</code>
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    ⚠️ Change this password before going to production!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show authenticated content with logout option
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logout button in top right */}
      <div className="absolute top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="bg-white shadow-sm"
        >
          <Lock className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      {children}
    </div>
  );
}