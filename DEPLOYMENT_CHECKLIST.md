# 🎯 Deployment Checklist for Sarva

## Pre-Deployment Preparation ✅

### 1. Generate All Secrets (5 minutes)
```bash
npm run generate:all-keys
```
**What it does:** Creates all security keys, HMAC secrets, admin passwords, and other required secrets
**Result:** Creates `.env.secrets` file with all your passwords and keys

⚠️ **IMPORTANT:** Save the `.env.secrets` file in a secure location (like a password manager)

### 2. Set Up Vercel Configuration (2 minutes)
```bash
npm run setup:vercel
```
**What it does:** Creates vercel.json, updates package.json, and prepares deployment files
**Result:** Your project is ready for Vercel deployment

---

## External Service Setup (20-30 minutes)

### 3. Database Setup - Neon (FREE)
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub/Google
3. Create new project: "ideinstein-production"
4. Copy the connection string (looks like: `postgresql://username:password@...`)
5. **Save this connection string** - you'll need it for Vercel

### 4. Email Setup - Gmail
1. Enable 2FA on your Google account
2. Generate App Password:
   - Google Account → Security → App passwords
   - App: Mail, Device: Computer
   - **Save the 16-character password**

### 5. Zoho Setup (Can be done later)
1. Go to [api-console.zoho.com](https://api-console.zoho.com)
2. Create new app: "IdEinstein Website"
3. Copy Client ID and Client Secret
4. **Note:** Full Zoho setup can be completed after initial deployment

---

## Vercel Deployment (15-20 minutes)

### 6. Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

### 7. Import Project to Vercel
```bash
vercel
```
- Choose "Import" existing project
- Connect your GitHub repository
- Keep all default settings
- **Don't deploy yet** - say "No" when asked

### 8. Set Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project → Settings → Environment Variables
3. Add these variables (get values from your `.env.secrets` file):

**REQUIRED - Add these first:**
- `NODE_ENV` = `production` (Plain Text, Production)
- `NEXTAUTH_URL` = `https://your-domain.com` (Plain Text, Production & Preview)
- `NEXTAUTH_SECRET` = (from .env.secrets) (Secret, Production & Preview)
- `DATABASE_URL` = (your Neon connection string) (Secret, Production & Preview)
- `FORM_HMAC_SECRET` = (from .env.secrets) (Secret, Production & Preview)
- `NEXT_PUBLIC_HMAC_SECRET` = (from .env.secrets) (Plain Text, Production & Preview)
- `ADMIN_PASSWORD` = (from .env.secrets) (Secret, Production & Preview)
- `ENCRYPTION_KEY` = (from .env.secrets) (Secret, Production)

**EMAIL - Add these:**
- `SMTP_HOST` = `smtp.gmail.com` (Plain Text, Production & Preview)
- `SMTP_PORT` = `587` (Plain Text, Production & Preview)
- `SMTP_USER` = (your Gmail address) (Plain Text, Production & Preview)
- `SMTP_PASS` = (your Gmail app password) (Secret, Production & Preview)
- `FROM_EMAIL` = `noreply@your-domain.com` (Plain Text, Production & Preview)

**ZOHO - Add these (use placeholders for now):**
- `ZOHO_CLIENT_ID` = (from Zoho console) (Plain Text, Production & Preview)
- `ZOHO_CLIENT_SECRET` = (from Zoho console) (Secret, Production & Preview)
- `ZOHO_REGION` = `com` (Plain Text, Production & Preview)

**RATE LIMITING:**
- `RATE_PER_MIN` = `60` (Plain Text, Production & Preview)

### 9. Deploy to Production
```bash
vercel --prod
```
**Wait 2-3 minutes for deployment to complete**

---

## Post-Deployment Testing (10 minutes)

### 10. Test Your Website
1. Visit the Vercel URL provided after deployment
2. Check these work:
   - [ ] Homepage loads correctly
   - [ ] Navigation menu works
   - [ ] Contact page loads
   - [ ] Admin panel loads (`/admin` - use ADMIN_PASSWORD from secrets)

### 11. Add Custom Domain (Optional)
1. In Vercel Dashboard → Domains
2. Add your domain
3. Follow DNS instructions
4. Update `NEXTAUTH_URL` to your actual domain
5. Redeploy: `vercel --prod`

---

## Completion Checklist ✅

**Phase 1: Preparation**
- [ ] Generated secrets with `npm run generate:all-keys`
- [ ] Set up Vercel config with `npm run setup:vercel`
- [ ] Created Neon database account
- [ ] Set up Gmail app password

**Phase 2: Deployment**
- [ ] Installed Vercel CLI
- [ ] Imported project to Vercel
- [ ] Added all environment variables
- [ ] Deployed to production

**Phase 3: Verification**
- [ ] Website loads on Vercel URL
- [ ] Admin panel accessible
- [ ] No build errors in Vercel dashboard
- [ ] SSL certificate active (green lock in browser)

**Phase 4: Optional**
- [ ] Custom domain added
- [ ] DNS configured
- [ ] Full Zoho integration completed

---

## Quick Reference Commands

```bash
# Generate all secrets
npm run generate:all-keys

# Set up Vercel configuration
npm run setup:vercel

# Deploy to Vercel
vercel --prod

# Check for issues
npm run deploy:check

# Update environment variables and redeploy
vercel env pull
vercel --prod
```

---

## Support & Troubleshooting

### Common Issues:
1. **Build Fails:** Check all environment variables are set in Vercel
2. **Database Connection Error:** Verify DATABASE_URL is correct
3. **Email Not Working:** Check Gmail app password and 2FA settings
4. **Admin Panel Not Loading:** Verify ADMIN_PASSWORD is set correctly

### Get Help:
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Check Vercel Functions logs for errors
- Use the detailed guide: `docs/VERCEL_DEPLOYMENT_GUIDE.md`

---

## Security Reminders 🔒

- ✅ Generated secrets are cryptographically secure
- ✅ HMAC protection active on all forms
- ✅ Rate limiting configured
- ✅ Admin panel password protected
- ✅ SSL/HTTPS enforced
- ✅ Security headers configured

**🎉 Your website will be production-ready with enterprise-grade security!**