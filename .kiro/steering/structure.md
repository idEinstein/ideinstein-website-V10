# Project Structure

## Root Directory Organization

### Core Application
- **`app/`** - Next.js App Router directory structure
- **`components/`** - Reusable React components organized by feature
- **`lib/`** - Utility functions, services, and business logic
- **`hooks/`** - Custom React hooks
- **`config/`** - Application configuration files

### Static Assets & Styles
- **`public/`** - Static assets (images, icons, files)
- **`styles/`** - Global CSS and animation files

### Development & Deployment
- **`scripts/`** - Build, deployment, and utility scripts
- **`docs/`** - Documentation and guides
- **`.kiro/`** - Kiro AI assistant configuration and specs

## App Directory Structure (Next.js App Router)

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx           # Homepage
├── globals.css        # Global styles
├── loading.tsx        # Global loading UI
├── not-found.tsx      # 404 page
├── robots.ts          # SEO robots.txt
├── sitemap.ts         # SEO sitemap
├── about/             # About page
├── admin/             # Admin dashboard (protected)
├── api/               # API routes
│   ├── admin/         # Admin API endpoints
│   ├── auth/          # Authentication endpoints
│   ├── consultation/  # Consultation form API
│   ├── contact/       # Contact form API
│   └── security/      # Security monitoring
├── auth/              # Authentication pages
├── blog/              # Blog pages
├── contact/           # Contact page
├── portal/            # Client portal (protected)
├── services/          # Service pages
└── solutions/         # Solution pages
```

## Components Organization

```
components/
├── about/             # About page components
├── admin/             # Admin dashboard components
├── analytics/         # Analytics and tracking
├── blog/              # Blog-related components
├── forms/             # Form components
├── home/              # Homepage sections
├── layout/            # Layout components (Header, Footer)
├── providers/         # Context providers
├── security/          # Security-related components
├── services/          # Service page components
├── shared/            # Reusable UI components
└── ui/                # shadcn/ui components
```

## Library Structure

```
lib/
├── auth/              # Authentication utilities
├── config/            # Configuration management
├── contexts/          # React contexts
├── data/              # Static data and content
├── database/          # Database utilities
├── helpers/           # Helper functions
├── security/          # Security utilities
├── services/          # External service integrations
├── types/             # TypeScript type definitions
├── utils/             # General utilities
├── validations/       # Form validation schemas
└── zoho/              # Zoho integration modules
```

## Key Files & Conventions

### Configuration Files
- **`middleware.ts`** - Security middleware (rate limiting, CSP, HMAC)
- **`next.config.js`** - Next.js configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`components.json`** - shadcn/ui configuration

### Environment Files
- **`.env.local`** - Local development environment
- **`.env.production`** - Production environment template
- **`.env.secrets`** - Sensitive production variables

### Security & Deployment
- **`vercel.json`** - Vercel deployment configuration
- **`scripts/security-audit.ts`** - Security validation
- **`scripts/validate-environment.ts`** - Environment validation

## Naming Conventions

### Files & Directories
- **PascalCase** for React components (`AdminAuth.tsx`)
- **kebab-case** for pages and API routes (`contact-form/`)
- **camelCase** for utilities and services (`authService.ts`)

### Components
- **Descriptive names** indicating purpose (`FloatingContactHub`)
- **Feature-based organization** (group by domain, not type)
- **Barrel exports** in index files for clean imports

### API Routes
- **RESTful conventions** (`/api/consultation`, `/api/admin/users`)
- **Nested routes** for related functionality
- **Protected routes** under `/api/admin/`

## Import Patterns

### Path Aliases
- **`@/`** - Root directory alias
- **`@/components/`** - Component imports
- **`@/lib/`** - Library imports
- **`@/hooks/`** - Custom hooks

### Import Order
1. External libraries (React, Next.js)
2. Internal components (`@/components/`)
3. Internal utilities (`@/lib/`, `@/hooks/`)
4. Relative imports (`./`, `../`)

## Archive & Exclusions

### Excluded from Build
- **`_archive/`** - Archived files (excluded in tsconfig)
- **`scripts/archive/`** - Old test files
- **`node_modules/`** - Dependencies
- **`.next/`** - Build output

### Development Only
- **`docs/`** - Documentation files
- **`.kiro/`** - AI assistant configuration
- **Test files** - Development and debugging scripts