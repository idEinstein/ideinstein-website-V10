# IdEinstein V-10 Production Deployment

This is the clean, production-ready version of the IdEinstein V-10 project with all archive files and unused components removed.

## Quick Start

1. **Environment Setup:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Development:**
   ```bash
   npm run dev
   ```

4. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

5. **Deployment to Vercel:**
   ```bash
   npm run deploy:vercel
   ```

## Important Notes

- All Zoho modules require individual refresh tokens
- ZOHO_ORG_ID must be set to 60046481646 for IdEinstein
- Timezone is configured for Europe/Berlin
- File upload limit is 100MB for CAD files

## Security

- Run security audit before deployment: `npm run security:audit`
- Validate environment: `npm run validate-env:prod`
- Pre-deployment checks: `npm run pre-deploy:secure`

## Scripts Included

Only essential scripts for production:
- `validate-environment.ts` - Environment validation
- `deploy-vercel.ts` - Vercel deployment
- `security-audit.ts` - Security checks
- `pre-deployment-security.ts` - Pre-deployment validation
- `smoke-tests.ts` - Basic functionality tests
- `integration-tests.ts` - Integration testing
- `test-zoho-connection.ts` - Zoho API connectivity

## Excluded from Deployment

- `scripts/archive/` - 400+ old test files
- `Main files for future reference/` - Archive folder
- All `.md` documentation files (except this README)
- Test and debug files
