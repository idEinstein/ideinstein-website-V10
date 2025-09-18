# 🔄 Zoho Token Refresh Guide

## **🚨 Current Issue**
Zoho refresh tokens have expired, causing "unauthorized" errors across all Zoho services.

## **✅ Quick Fix Steps**

### **Step 1: Enable OAuth Debug Mode**
In your Vercel dashboard, update this environment variable:
```
ALLOW_OAUTH_DEBUG=true
```

### **Step 2: Access Token Generation Endpoint**
Visit: `https://your-domain.vercel.app/admin/zoho/oauth`

### **Step 3: Generate New Tokens**
1. Select service (start with "CRM")
2. Click "Generate Authorization URL"
3. Open the authorization URL in new tab
4. Login to Zoho and authorize
5. Copy the `code` from redirect URL
6. Paste code and click "Exchange for Tokens"
7. Copy the new refresh token

### **Step 4: Update Environment Variables**
For each service, update these variables in Vercel:
- `ZOHO_CRM_REFRESH_TOKEN`
- `ZOHO_WORKDRIVE_REFRESH_TOKEN`
- `ZOHO_BOOKINGS_REFRESH_TOKEN`
- `ZOHO_CAMPAIGNS_REFRESH_TOKEN`
- `ZOHO_BOOKS_REFRESH_TOKEN`
- `ZOHO_PROJECTS_REFRESH_TOKEN`

### **Step 5: Disable Debug Mode**
Set back to: `ALLOW_OAUTH_DEBUG=false`

## **🔄 Services to Regenerate (Priority Order)**
1. **CRM** - Core lead management
2. **WorkDrive** - File storage
3. **Bookings** - Appointment scheduling
4. **Campaigns** - Email marketing
5. **Books** - Invoicing (optional)
6. **Projects** - Project management (optional)

## **🎯 Expected Results**
After regenerating tokens:
- `/admin/zoho/status` shows all services as "Connected"
- Dashboard Zoho status changes from "down" to "healthy"
- Form submissions work properly
- File uploads to WorkDrive succeed

## **⚠️ Important Notes**
- Refresh tokens expire every 3-6 months
- Always test one service at a time
- Keep `ALLOW_OAUTH_DEBUG=false` in production
- Document new token generation dates

## **🔗 Useful URLs**
- Admin Dashboard: `/admin`
- Zoho Status: `/admin/zoho/status`
- Token Generator: `/admin/zoho/oauth`
- Vercel Dashboard: `https://vercel.com/dashboard`