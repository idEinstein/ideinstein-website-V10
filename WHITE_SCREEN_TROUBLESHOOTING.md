# White Screen Troubleshooting Guide

## Quick Fixes

If you're experiencing a white screen, try these solutions in order:

### 1. Disable CSP Temporarily
Add `?debug=no-csp` to your URL:
```
https://your-site.com/?debug=no-csp
```

### 2. Use Debug Mode
Visit the debug page for diagnostics:
```
https://your-site.com/debug
```

### 3. Try Simple Mode
Use simplified rendering:
```
https://your-site.com/?debug=simple
```

### 4. Production Debug Mode
For production debugging:
```
https://your-site.com/?debug=prod
```

## Automated Fixes

Run these commands to automatically fix common issues:

```bash
# Run comprehensive health check
npm run health:check

# Apply white screen fixes
npm run fix:white-screen

# Full production debugging
npm run debug:production
```

## Common Causes & Solutions

### 1. Content Security Policy (CSP) Issues

**Symptoms:**
- White screen in production
- Console errors about blocked resources
- Scripts not loading

**Solutions:**
- Use `?debug=no-csp` to test if CSP is the issue
- Check browser console for CSP violation reports
- Update CSP configuration in `lib/security/csp.ts`

### 2. Hydration Mismatches

**Symptoms:**
- White screen on client-side navigation
- Console errors about hydration
- Components not rendering

**Solutions:**
- Check components use `useEffect` for client-side only code
- Ensure `localStorage` access is wrapped in hydration checks
- Use `isMounted` state for client-side rendering

### 3. JavaScript Errors

**Symptoms:**
- White screen with console errors
- Components crashing silently
- Error boundaries not showing fallbacks

**Solutions:**
- Check browser console for JavaScript errors
- Review error boundary implementations
- Test with simplified components

### 4. Network/API Issues

**Symptoms:**
- White screen with network errors
- API calls failing
- Resources not loading

**Solutions:**
- Check network tab in browser dev tools
- Verify API endpoints are accessible
- Test with offline/online modes

## Debug Tools

### Health Check Script
```bash
npm run health:check
```
Validates:
- Environment variables
- API connectivity
- Security configuration
- Component loading

### Debug Page
Visit `/debug` for:
- System diagnostics
- CSP status
- Component loading tests
- Browser compatibility checks

### White Screen Fix Script
```bash
npm run fix:white-screen
```
Automatically applies:
- CSP debug parameters
- Hydration safety patterns
- Error boundary improvements
- Debug page creation

## Manual Debugging Steps

### 1. Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Note any CSP violations or JavaScript errors

### 2. Check Network Tab
1. Open Network tab in dev tools
2. Reload the page
3. Look for failed requests (red status codes)
4. Check if CSS/JS files are loading

### 3. Test Different Browsers
- Try Chrome, Firefox, Safari, Edge
- Test in incognito/private mode
- Check mobile browsers

### 4. Clear Browser Data
1. Clear cache and cookies
2. Disable browser extensions
3. Try hard refresh (Ctrl+F5)

## Environment-Specific Issues

### Development
- Check if `npm run dev` starts without errors
- Verify all dependencies are installed
- Check for TypeScript compilation errors

### Production
- Verify environment variables are set
- Check build process completes successfully
- Test with production build locally: `npm run build && npm run start`

### Vercel Deployment
- Check Vercel function logs
- Verify environment variables in Vercel dashboard
- Test with Vercel preview deployments

## Prevention

### Code Quality
- Use TypeScript for type safety
- Implement comprehensive error boundaries
- Test components in isolation
- Use proper hydration patterns

### Security
- Configure CSP to allow necessary resources
- Test CSP configuration in development
- Use nonce-based CSP when possible

### Monitoring
- Implement error tracking (Sentry, LogRocket)
- Monitor Core Web Vitals
- Set up uptime monitoring

## Emergency Fallback

If all else fails, create a simple `index.html` file in the `public` directory:

```html
<!DOCTYPE html>
<html>
<head>
    <title>IdEinstein Engineering</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        .btn { background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>IdEinstein Engineering</h1>
        <p>Professional 3D Printing & CAD Design Services</p>
        <p>We're experiencing technical difficulties. Please contact us directly:</p>
        <a href="mailto:contact@ideinstein.com" class="btn">Contact Us</a>
    </div>
</body>
</html>
```

## Getting Help

If you continue to experience issues:

1. Run `npm run debug:production` and share the output
2. Check browser console and share error messages
3. Test with different browsers and devices
4. Provide steps to reproduce the issue

## Monitoring & Alerts

Set up monitoring for:
- Page load times
- JavaScript errors
- CSP violations
- API response times
- Uptime monitoring

This helps catch white screen issues before users report them.