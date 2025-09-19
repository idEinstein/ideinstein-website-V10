# Security Configuration Guide

Generated: 2025-09-19T15:50:08.984Z

## Environment Variables

### Required Security Variables

```bash
# Admin Authentication
ADMIN_PASSWORD=your_secure_password_here
ADMIN_PASSWORD_HASH=bcrypt_hash_of_password

# Form Security
FORM_HMAC_SECRET=32_character_random_string

# NextAuth.js
NEXTAUTH_SECRET=32_character_random_string
NEXTAUTH_URL=https://yourdomain.com

# Rate Limiting
RATE_PER_MIN=60

# Environment
NODE_ENV=production
```

### Optional Security Variables

```bash
# CSP Reporting
CSP_REPORT_URI=/api/security/csp-report

# Security Headers
SECURITY_HEADERS_ENABLED=true

# Logging
SECURITY_LOG_LEVEL=info
```

## Security Scripts

### Available Commands

```bash
# Security Auditing
npm run security:audit              # Run comprehensive security audit
npm run security:audit:strict       # Fail on warnings

# Dependency Scanning
npm run dependency:scan             # Scan for vulnerabilities
npm run dependency:scan:ci          # CI/CD mode (fail on high+ severity)

# Pre-deployment
npm run pre-deploy:secure           # Run all security checks
npm run validate-env:prod           # Validate production environment
```

## Security Headers Configuration

### Content Security Policy (CSP)

The application implements a strict CSP with the following directives:

- `default-src 'self'` - Only allow resources from same origin
- `script-src 'self' 'nonce-{random}'` - Scripts with nonce validation
- `style-src 'self' 'unsafe-inline'` - Styles from same origin
- `img-src 'self' data: https:` - Images from trusted sources
- `connect-src 'self'` - API calls to same origin only

### Other Security Headers

- **X-Frame-Options**: DENY (prevent clickjacking)
- **X-Content-Type-Options**: nosniff (prevent MIME sniffing)
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Strict-Transport-Security**: max-age=31536000 (HTTPS enforcement)

## Rate Limiting Configuration

### Default Limits

- **API endpoints**: 100 requests per 15 minutes
- **Admin endpoints**: 100 requests per minute (generous for development)
- **Contact forms**: 3 submissions per hour
- **General pages**: 60 requests per minute

### Customizing Rate Limits

Rate limits can be customized in `lib/security/rate-limit.ts`:

```typescript
export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many API requests'
  }
};
```

