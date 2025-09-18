# Quick Vercel Deployment Instructions

## Prerequisites
1. ✅ Run: npm run generate:all-keys
2. ✅ Set up PostgreSQL database (Neon/Supabase)
3. ✅ Configure Gmail SMTP (app password)
4. ✅ Create Zoho OAuth app

## Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

### 2. Import Project to Vercel
```bash
vercel
```
- Choose "Import" project
- Connect GitHub repository
- Keep default settings

### 3. Set Environment Variables
1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add all variables from .env.production.template
4. Use "Secret" type for sensitive values

### 4. Deploy to Production
```bash
vercel --prod
```

### 5. Add Custom Domain (Optional)
1. Vercel Dashboard → Domains
2. Add your domain
3. Configure DNS records as shown
4. Update NEXTAUTH_URL environment variable

## Testing Checklist
- [ ] Homepage loads
- [ ] Contact form works
- [ ] Admin panel accessible (/admin)
- [ ] Newsletter subscription works
- [ ] SSL certificate active

## Troubleshooting
- Build failures: Check environment variables
- Email issues: Verify Gmail app password
- Zoho errors: Check refresh tokens
- Admin access: Verify ADMIN_PASSWORD

For detailed instructions, see docs/VERCEL_DEPLOYMENT_GUIDE.md
