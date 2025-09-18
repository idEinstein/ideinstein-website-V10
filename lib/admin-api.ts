/**
 * Admin API utility functions
 * Handles authenticated API calls for admin components
 */

/**
 * Make an authenticated API call with admin token
 */
export async function adminApiCall(url: string, options: RequestInit = {}): Promise<Response> {
  // Get admin token from localStorage
  const authToken = localStorage.getItem('admin_auth_token');
  const authExpiry = localStorage.getItem('admin_auth_expiry');
  
  // Check if token exists and is not expired
  if (!authToken || !authExpiry || Date.now() >= parseInt(authExpiry)) {
    throw new Error('Admin authentication required');
  }
  
  // Add authorization header
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Make an authenticated GET request
 */
export async function adminGet(url: string): Promise<Response> {
  return adminApiCall(url, { method: 'GET' });
}

/**
 * Make an authenticated POST request
 */
export async function adminPost(url: string, data?: any): Promise<Response> {
  return adminApiCall(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Make an authenticated DELETE request
 */
export async function adminDelete(url: string): Promise<Response> {
  return adminApiCall(url, { method: 'DELETE' });
}