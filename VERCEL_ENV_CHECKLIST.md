# Vercel Environment Variables Checklist

## ✅ Required Variables (EXACT names):

- [ ] ZOHO_CRM_REFRESH_TOKEN
- [ ] ZOHO_BOOKINGS_REFRESH_TOKEN  
- [ ] ZOHO_WORKDRIVE_REFRESH_TOKEN
- [ ] ZOHO_CAMPAIGNS_REFRESH_TOKEN
- [ ] ZOHO_BOOKS_REFRESH_TOKEN
- [ ] ZOHO_PROJECTS_REFRESH_TOKEN

## ✅ Also Required:

- [ ] ZOHO_CLIENT_ID
- [ ] ZOHO_CLIENT_SECRET
- [ ] ZOHO_DC (value: "in")
- [ ] BOOKINGS_SERVICE_ID
- [ ] BOOKINGS_STAFF_ID
- [ ] BOOKINGS_WORKSPACE_ID

## ✅ After Adding Variables:

- [ ] Redeploy: vercel --prod
- [ ] Test: node scripts/test-production-env.js
- [ ] Verify: Check dashboard shows all services "Connected"
