# 🔧 Deployment Troubleshooting Guide

## Common Issues and Solutions

### 🚨 Build Failures

#### Error: "Missing environment variable"
**Symptoms:** Build fails with environment variable errors
**Solution:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Check all required variables are set
3. Ensure correct Environment (Production/Preview)
4. Redeploy after adding variables

#### Error: "Module not found" or dependency issues
**Symptoms:** Build fails during npm install
**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Error: "TypeScript compilation failed"
**Symptoms:** Build fails with TypeScript errors
**Solution:**
```bash
npm run type-check
# Fix any TypeScript errors shown
```

---

### 📧 Email/SMTP Issues

#### Error: "SMTP authentication failed"
**Symptoms:** Contact forms don't send emails
**Solution:**
1. Verify Gmail has 2FA enabled
2. Generate new App Password:
   - Google Account → Security → App passwords
   - Use the 16-character password (not your regular password)
3. Update `SMTP_PASS` in Vercel environment variables

#### Error: "Connection timeout" or "ENOTFOUND"
**Symptoms:** Email sending fails with connection errors
**Solution:**
1. Check SMTP settings:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
2. Ensure firewall/network allows SMTP connections
3. Try alternative SMTP providers (SendGrid, Mailgun)

---

### 🔐 Authentication Issues

#### Error: "NextAuth configuration error"
**Symptoms:** Login/authentication doesn't work
**Solution:**
1. Verify `NEXTAUTH_URL` matches your domain exactly
2. Ensure `NEXTAUTH_SECRET` is set and at least 32 characters
3. Check that your domain has valid SSL certificate

#### Error: "Admin panel not accessible"
**Symptoms:** /admin returns 401 or login fails
**Solution:**
1. Check `ADMIN_PASSWORD` is set correctly
2. Try password from `.env.secrets` file
3. Clear browser cache and cookies
4. Check Vercel Functions logs for auth errors

---

### 🗄️ Database Issues

#### Error: "Database connection failed"
**Symptoms:** App can't connect to database
**Solution:**
1. Verify `DATABASE_URL` format:
   ```
   postgresql://user:password@host:5432/database?sslmode=require
   ```
2. Test connection from Neon/Supabase dashboard
3. Ensure SSL is enabled (`sslmode=require`)
4. Check database provider status

#### Error: "SSL connection required"
**Symptoms:** Database rejects connections
**Solution:**
1. Add `?sslmode=require` to DATABASE_URL
2. For Neon: Use the "Pooled connection" string
3. For Supabase: Use "Connection pooling" URL

---

### 🔗 Zoho Integration Issues

#### Error: "Invalid refresh token"
**Symptoms:** Zoho API calls fail with 401 errors
**Solution:**
1. Regenerate refresh tokens in Zoho Developer Console
2. Check token expiration (refresh tokens expire)
3. Verify correct Zoho region (`ZOHO_REGION=com`)
4. Ensure proper OAuth scopes were granted

#### Error: "Organization not found"
**Symptoms:** Zoho API returns organization errors
**Solution:**
1. Verify `ZOHO_ORG_ID=60046481646` is correct
2. Check user has access to the organization
3. Ensure refresh tokens were generated for correct org

---

### 🌐 Domain and SSL Issues

#### Error: "SSL certificate not valid"
**Symptoms:** Browser shows SSL warnings
**Solution:**
1. Wait 24-48 hours for SSL provisioning
2. Check domain DNS settings are correct
3. Ensure domain points to Vercel (not old hosting)
4. Contact Vercel support if issue persists

#### Error: "Domain not working"
**Symptoms:** Custom domain doesn't load
**Solution:**
1. Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
2. Verify DNS records match Vercel instructions exactly
3. Try accessing via Vercel's .vercel.app URL first
4. Update `NEXTAUTH_URL` after domain is working

---

### ⚡ Performance Issues

#### Error: "Function timeout"
**Symptoms:** API routes time out
**Solution:**
1. Check Vercel Functions logs for specific errors
2. Optimize database queries
3. Increase function timeout in vercel.json:
   ```json
   {
     "functions": {
       "app/api/**": {
         "maxDuration": 30
       }
     }
   }
   ```

#### Error: "Memory limit exceeded"
**Symptoms:** Functions fail with memory errors
**Solution:**
1. Increase memory in vercel.json:
   ```json
   {
     "functions": {
       "app/api/**": {
         "memory": 1024
       }
     }
   }
   ```
2. Optimize code to use less memory
3. Consider splitting large operations

---

### 🔍 Debugging Tools

#### View Vercel Logs
1. Go to Vercel Dashboard → Project → Functions tab
2. Click on any function to see logs
3. Look for error messages and stack traces

#### Test Environment Variables
```bash
# Pull environment variables locally
vercel env pull

# Test specific API endpoints
curl https://your-domain.com/api/health
```

#### Check Build Logs
1. Vercel Dashboard → Project → Deployments
2. Click on latest deployment
3. View build logs for errors

---

### 🚨 Emergency Procedures

#### Site is completely down
1. Check Vercel status: [vercel-status.com](https://vercel-status.com)
2. Verify your domain DNS settings
3. Try accessing via .vercel.app URL
4. Check recent deployments for issues

#### Data loss or corruption
1. Check database provider's backup options
2. Restore from latest backup
3. Review recent changes in git history

#### Security breach suspected
1. Immediately rotate all secrets:
   ```bash
   npm run generate:all-keys
   ```
2. Update all environment variables in Vercel
3. Check access logs for suspicious activity
4. Change admin passwords

---

### 📞 Getting Help

#### Self-Help Resources
- Check Vercel Functions logs first
- Review environment variables in Vercel Dashboard
- Test locally with `npm run dev`
- Check git history for recent changes

#### When to Contact Support
- Vercel platform issues (downtime, billing)
- Domain/DNS issues that persist > 48 hours
- SSL certificate problems after 48 hours
- Suspected security issues

#### Contact Information
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Neon Support:** [neon.tech/docs](https://neon.tech/docs)
- **Zoho Support:** [help.zoho.com](https://help.zoho.com)

---

### 📝 Creating Support Tickets

When contacting support, include:
1. **Error message** (exact text)
2. **Vercel deployment URL**
3. **Steps to reproduce** the issue
4. **When the issue started**
5. **Browser/device information**
6. **Screenshots** if applicable

Example:
```
Subject: Database connection error on production deployment

Error: "Connection timeout to database"
Deployment URL: https://ideinstein-abc123.vercel.app
Started: Today at 2 PM UTC
Steps: Visit /contact page, submit form
Browser: Chrome 119 on Windows 11

Environment variables checked: DATABASE_URL is set correctly
Neon dashboard shows database is running
Issue does not occur in development
```

---

### ✅ Prevention Checklist

**Regular Maintenance:**
- [ ] Test all forms monthly
- [ ] Check SSL certificate expiry
- [ ] Review Vercel Functions logs weekly
- [ ] Update dependencies quarterly
- [ ] Rotate secrets every 90 days

**Monitoring Setup:**
- [ ] Enable Vercel Analytics
- [ ] Set up uptime monitoring
- [ ] Configure error alerts
- [ ] Monitor database performance

**Backup Strategy:**
- [ ] Regular database backups
- [ ] Environment variable backup
- [ ] Git repository maintenance
- [ ] Documentation updates

Remember: Most issues are environment variable or configuration related. Always check those first! 🔧