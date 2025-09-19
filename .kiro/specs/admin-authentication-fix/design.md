# Design Document

## Overview

This design addresses the admin authentication failure that occurred after switching from plain password to hashed password authentication. The issue stems from cached invalid tokens and potential bcrypt compatibility problems in the Vercel deployment environment. The solution focuses on immediate restoration of admin access while ensuring secure authentication.

## Architecture

### Current Authentication Flow
1. **Frontend**: AdminAuth component collects password and creates base64 token
2. **API Validation**: `/api/admin/validate` endpoint validates password against hash
3. **Token Storage**: Valid tokens stored in localStorage with 24-hour expiration
4. **Token Verification**: `/api/admin/verify-token` endpoint validates stored tokens

### Root Cause Analysis
Based on code analysis and research, the authentication failure has multiple potential causes:

1. **Cache Invalidation**: Old tokens created with plain password are invalid with new hash
2. **Runtime Compatibility**: bcrypt may have issues in Vercel's edge runtime
3. **Environment Variables**: ADMIN_PASSWORD_HASH may not be properly deployed
4. **Hash Format**: Generated hash may be malformed or incompatible
5. **Token Format**: Base64 encoding/decoding issues in token verification

## Components and Interfaces

### 1. Authentication Diagnostic System
**Purpose**: Identify the exact cause of authentication failure

**Interface**:
```typescript
interface DiagnosticResult {
  environmentCheck: {
    hasPasswordHash: boolean;
    hashFormat: 'valid' | 'invalid' | 'missing';
    nodeEnv: string;
  };
  runtimeCheck: {
    bcryptAvailable: boolean;
    runtimeType: 'nodejs' | 'edge';
  };
  cacheCheck: {
    hasStoredToken: boolean;
    tokenExpired: boolean;
    tokenFormat: 'valid' | 'invalid';
  };
}
```

### 2. Cache Management System
**Purpose**: Automatically clear invalid authentication data

**Interface**:
```typescript
interface CacheManager {
  clearAuthenticationCache(): void;
  clearAllBrowserData(): void;
  validateStoredTokens(): boolean;
  forceReauthentication(): void;
}
```

### 3. Enhanced Authentication API
**Purpose**: Robust password validation with fallback mechanisms

**Interface**:
```typescript
interface AuthenticationResponse {
  success: boolean;
  message: string;
  diagnostics?: DiagnosticResult;
  suggestedActions?: string[];
}
```

### 4. Runtime-Safe Password Validation
**Purpose**: Ensure bcrypt works correctly in all deployment environments

**Strategy**:
- Force Node.js runtime for authentication endpoints
- Implement bcrypt error handling and fallbacks
- Add runtime detection and compatibility checks

## Data Models

### Authentication Token Structure
```typescript
interface AuthToken {
  format: 'base64';
  content: string; // base64("admin:${plainPassword}")
  expiry: number; // timestamp
  created: number; // timestamp
}
```

### Environment Configuration
```typescript
interface AuthConfig {
  adminPasswordHash: string; // bcrypt hash from ADMIN_PASSWORD_HASH
  nodeEnv: 'development' | 'production';
  runtimeType: 'nodejs' | 'edge';
  saltRounds: number; // minimum 12 for security
}
```

## Error Handling

### 1. Authentication Errors
- **Invalid Password**: Clear error message with retry option
- **System Error**: Diagnostic information with suggested fixes
- **Rate Limiting**: Clear countdown and retry guidance
- **Cache Issues**: Automatic cache clearing with user notification

### 2. Environment Errors
- **Missing Hash**: Instructions to generate and set ADMIN_PASSWORD_HASH
- **Invalid Hash**: Hash format validation and regeneration guidance
- **Runtime Issues**: Force Node.js runtime configuration

### 3. Deployment Errors
- **Environment Sync**: Verify Vercel environment variables are deployed
- **Build Issues**: Ensure bcrypt is properly bundled for Node.js runtime
- **Cache Persistence**: Handle Vercel deployment cache invalidation

## Testing Strategy

### 1. Authentication Flow Testing
- **Valid Password**: Verify successful authentication with correct hash
- **Invalid Password**: Verify proper error handling and security
- **Token Validation**: Test token creation, storage, and verification
- **Cache Clearing**: Verify automatic and manual cache clearing

### 2. Environment Testing
- **Local Development**: Test with both plain and hashed passwords
- **Production Deployment**: Verify bcrypt works in Vercel Node.js runtime
- **Environment Variables**: Test missing, invalid, and correct configurations
- **Runtime Compatibility**: Ensure Node.js runtime is used for auth endpoints

### 3. Security Testing
- **Hash Validation**: Verify bcrypt comparison with proper salt rounds
- **Token Security**: Test token format and expiration handling
- **Rate Limiting**: Verify authentication attempt limits
- **Error Information**: Ensure no sensitive data leaks in error messages

## Implementation Approach

### Phase 1: Immediate Fix
1. **Diagnostic Endpoint**: Create `/api/admin/diagnose` to identify issues
2. **Cache Clearing**: Add automatic cache clearing to AdminAuth component
3. **Environment Validation**: Verify ADMIN_PASSWORD_HASH is properly set
4. **Runtime Configuration**: Ensure Node.js runtime for auth endpoints

### Phase 2: Robust Authentication
1. **Enhanced Error Handling**: Improve error messages and user guidance
2. **Fallback Mechanisms**: Handle bcrypt failures gracefully
3. **Token Management**: Improve token validation and expiration
4. **Security Hardening**: Implement additional security measures

### Phase 3: Prevention
1. **Deployment Validation**: Pre-deployment authentication checks
2. **Monitoring**: Add authentication success/failure logging
3. **Documentation**: Clear setup and troubleshooting guides
4. **Backup Access**: Emergency access mechanisms for lockout scenarios

## Security Considerations

### Password Security
- **bcrypt Hashing**: Minimum 12 salt rounds for production
- **Constant-Time Comparison**: Prevent timing attacks
- **No Plain Text Storage**: Never store or log plain passwords
- **Secure Token Format**: Base64 encoding with proper validation

### Runtime Security
- **Node.js Runtime**: Force Node.js runtime for bcrypt compatibility
- **Environment Isolation**: Separate development and production configurations
- **Rate Limiting**: Prevent brute force attacks
- **Audit Logging**: Log authentication attempts without exposing credentials

### Deployment Security
- **Environment Variables**: Secure storage of ADMIN_PASSWORD_HASH
- **Build Security**: Ensure bcrypt is properly bundled
- **Cache Security**: Secure token storage with proper expiration
- **Error Security**: No sensitive information in error responses