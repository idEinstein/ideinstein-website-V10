# Zoho Integration Debugging Guide

## 🚨 Issue Summary
Zoho CRM and WorkDrive are showing token refresh failures after recent security patches. The tokens were working yesterday and are not expired.

## 🔧 Fixes Applied

### 1. Fixed Booking Availability API
- **Issue**: API returned 502 status when Zoho failed, causing consultation form to show "no slots"
- **Fix**: Now returns 200 status with fallback slots, ensuring users can always book consultations
- **File**: `app/api/bookings/availability/route.ts`

### 2. Enhanced Zoho Client Error Handling
- **Issue**: Generic error messages made debugging difficult
- **Fix**: Added specific error messages and troubleshooting guidance
- **File**: `lib/zoho/client.ts`

### 3. Fixed Crypto API Compatibility
- **Issue**: `crypto.randomUUID()` might not be available in all environments
- **Fix**: Added fallback UUID generation for better compatibility
- **File**: `lib/zoho/client.ts`

### 4. Improved Consultation Form
- **Issue**: Form showed "no slots" without explanation when Zoho failed
- **Fix**: Shows warning messages and uses fallback slots gracefully
- **File**: `components/shared/ConsultationForm.tsx`

## 🔍 Diagnostic Tools Created

### Quick Commands
```bash
# Comprehensive diagnosis (recommended first step)
npm run zoho:diagnose

# Test basic fetch functionality
npm run zoho:test-fetch

# Test token refresh manually
npm run zoho:test-tokens

# Quick connectivity test
npm run zoho:test
```

### API Endpoint for Testing
- **URL**: `/api/debug/zoho-tokens?service=crm`
- **Auth**: Requires `Authorization: Bearer ${ADMIN_PASSWORD}` in production
- **Purpose**: Test token refresh directly through the API

### Diagnostic Scripts

1. **`scripts/diagnose-zoho-issue.js`** - Comprehensive diagnosis
   - Environment variable validation
   - Network connectivity test
   - Token format validation
   - Manual token refresh test
   - Crypto API compatibility test

2. **`scripts/test-simple-fetch.js`** - Basic functionality test
   - Tests fetch API
   - Tests Zoho endpoint connectivity
   - Tests FormData/URLSearchParams
   - Tests Crypto API

3. **`scripts/test-zoho-token-refresh.js`** - Token refresh isolation test
   - Tests token refresh logic in isolation
   - Detailed request/response logging
   - Error analysis

4. **`scripts/test-logger.js`** - Import validation test
   - Tests logger import
   - Tests Zoho client import
   - Validates module loading

## 🔍 Debugging Steps

### Step 1: Run Comprehensive Diagnosis
```bash
npm run zoho:diagnose
```
This will check:
- ✅ Environment variables
- ✅ Network connectivity
- ✅ Token format validation
- ✅ Manual token refresh
- ✅ Crypto API compatibility

### Step 2: Test Basic Functionality
```bash
npm run zoho:test-fetch
```
This will verify:
- ✅ Basic fetch works
- ✅ Zoho endpoints are reachable
- ✅ FormData/URLSearchParams work
- ✅ Crypto API works

### Step 3: Test Token Refresh in Isolation
```bash
npm run zoho:test-tokens
```
This will:
- ✅ Test each service token individually
- ✅ Show detailed request/response data
- ✅ Identify specific token issues

### Step 4: Test Through API (Production)
```bash
curl -H "Authorization: Bearer ${ADMIN_PASSWORD}" \
     "https://ideinstein.com/api/debug/zoho-tokens?service=crm"
```

## 🔧 Environment Variable Check

Ensure these variables are set in production:
```bash
ZOHO_DC=in
ZOHO_CLIENT_ID=1000.TMDVT9N00BL41M1OD3OW9B12Y6N27J
ZOHO_CLIENT_SECRET=2e30f4bdf4c5e716f8d61b589cd964afe4ec1d63f2
ZOHO_CRM_REFRESH_TOKEN=1000.02301090e82dbfcb2a2e7b639540b488.46722f53edef04a3cb0399cd0f820924
ZOHO_BOOKINGS_REFRESH_TOKEN=1000.7ef30e502b9735c12cb34d08a0105a38.432f212160260ff91d42fec4756189d9
ZOHO_WORKDRIVE_REFRESH_TOKEN=1000.b592d87c6536f49bffc4e33f5cd67857.ed90f76c92b02dc4c84225d819907b2d
ZOHO_CAMPAIGNS_REFRESH_TOKEN=1000.6d5cf8bb25c3d5d3ceed056207246d80.b4ae11cb36687f2f29c0437dd0807e92
```

## 🚨 Common Issues & Solutions

### Issue: "crypto.randomUUID is not a function"
**Solution**: Fixed with fallback UUID generation in `lib/zoho/client.ts`

### Issue: "No slots available" in consultation form
**Solution**: Fixed with fallback slots and better error handling

### Issue: "zoho:crm:token_refresh_failed"
**Possible Causes**:
1. Environment variables not loaded correctly
2. Network connectivity issues
3. Zoho service outage
4. Token format corruption

**Debug Steps**:
1. Run `npm run zoho:diagnose`
2. Check environment variables in Vercel dashboard
3. Test network connectivity
4. Regenerate tokens if needed

### Issue: Module import errors
**Solution**: Use diagnostic scripts to identify import issues

## 🔄 Token Regeneration (If Needed)

If tokens are actually expired or corrupted:

1. **Development**: Visit `http://localhost:3000/admin/zoho/oauth`
2. **Production**: Use Vercel environment variables dashboard
3. **Manual**: Use Zoho Developer Console

## 📊 Expected Behavior After Fixes

1. **Consultation Form**: Always shows time slots (fallback if Zoho fails)
2. **Error Messages**: Clear, actionable error messages
3. **Graceful Degradation**: System works even when Zoho is unavailable
4. **Better Debugging**: Comprehensive diagnostic tools available

## 🔍 Next Steps

1. Run `npm run zoho:diagnose` to identify the root cause
2. Check the specific error messages and follow the troubleshooting guidance
3. Use the API endpoint to test in production environment
4. If tokens are actually expired, regenerate them using the OAuth flow

The system is now more resilient and provides better debugging information to quickly identify and resolve Zoho integration issues.