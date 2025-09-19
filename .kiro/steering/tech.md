# Technology Stack

## Framework & Runtime
- **Next.js 15.4.7** - React framework with App Router
- **React 19.1.1** - UI library
- **TypeScript 5.2.2** - Type safety
- **Node.js >=18.0.0** - Runtime requirement

## Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **Framer Motion 11.15.0** - Animations
- **Lucide React** - Icon library
- **shadcn/ui** - Component system (via components.json)

## Authentication & Security
- **NextAuth.js 4.24.11** - Authentication
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **Helmet** - Security headers
- **HMAC validation** - Form security
- **CSP (Content Security Policy)** - XSS protection

## Forms & Validation
- **React Hook Form 7.54.2** - Form management
- **Zod 3.23.8** - Schema validation
- **@hookform/resolvers** - Form validation integration

## External Integrations
- **Zoho CRM** - Lead management (Org ID: 60046481646)
- **Zoho WorkDrive** - File storage
- **Zoho Bookings** - Appointment scheduling
- **Zoho Campaigns** - Email marketing
- **Nodemailer** - Email sending

## Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **tsx** - TypeScript execution
- **Jest** - Testing framework

## Deployment
- **Vercel** - Primary hosting platform
- **Docker support** - Via standalone output
- **Environment validation** - Pre-deployment checks

## Common Commands

### Development
```bash
npm run dev              # Start development server
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript validation
```

### Security & Validation
```bash
npm run security:audit          # Security audit
npm run validate-env:prod       # Validate production env
npm run pre-deploy:secure       # Pre-deployment security checks
```

### Testing
```bash
npm run test:smoke             # Basic functionality tests
npm run test:integration       # Integration tests
npm run test:production:ready  # Full production readiness
```

### Deployment
```bash
npm run deploy:vercel          # Deploy to Vercel
npm run deploy:check          # Pre-deployment validation
npm run vercel-build          # Vercel build command
```

### Zoho Integration Testing
```bash
npm run test:zoho             # Test Zoho connection
npm run test:crm              # Test CRM integration
npm run test:bookings         # Test booking system
npm run zoho:refresh          # Refresh Zoho tokens
```

## Architecture Notes
- **App Router** - Uses Next.js 13+ app directory structure
- **Server Components** - Default to server-side rendering
- **Middleware** - Enterprise-grade security layer
- **Standalone output** - Optimized for serverless deployment
- **GDPR compliance** - Built-in privacy controls
- **Rate limiting** - 60 requests per minute default
- **File uploads** - 100MB limit for CAD files