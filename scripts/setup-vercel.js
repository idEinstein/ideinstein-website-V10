#!/usr/bin/env node

/**
 * Vercel Deployment Setup Script
 * Prepares the project for Vercel deployment with proper configuration
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function print(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function printHeader(title) {
  print('\n' + '='.repeat(60), 'cyan');
  print(`  ${title}`, 'bright');
  print('='.repeat(60), 'cyan');
}

function createVercelJson() {
  printHeader('Creating vercel.json Configuration');
  
  const vercelConfig = {
    "version": 2,
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "installCommand": "npm ci",
    "outputDirectory": ".next",
    "regions": ["iad1", "fra1"],
    "functions": {
      "app/api/**": {
        "runtime": "nodejs18.x",
        "memory": 1024,
        "maxDuration": 30
      }
    },
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "Permissions-Policy",
            "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()"
          }
        ]
      },
      {
        "source": "/api/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-store, no-cache, must-revalidate"
          }
        ]
      }
    ],
    "redirects": [
      {
        "source": "/admin",
        "destination": "/admin/dashboard",
        "permanent": false
      }
    ],
    "rewrites": [
      {
        "source": "/sitemap.xml",
        "destination": "/api/sitemap"
      },
      {
        "source": "/robots.txt", 
        "destination": "/api/robots"
      }
    ],
    "crons": [
      {
        "path": "/api/cron/cleanup",
        "schedule": "0 2 * * *"
      },
      {
        "path": "/api/cron/health-check",
        "schedule": "*/5 * * * *"
      }
    ]
  };
  
  const filepath = path.join(process.cwd(), 'vercel.json');
  fs.writeFileSync(filepath, JSON.stringify(vercelConfig, null, 2));
  
  print(`✅ Created vercel.json configuration`, 'green');
  return filepath;
}

function updatePackageJsonForVercel() {
  printHeader('Updating package.json for Vercel');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    print('❌ package.json not found!', 'red');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add/update Vercel-specific scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'vercel-build': 'npm run validate-env:prod && npm run build',
    'postinstall': 'prisma generate || echo "No Prisma schema found"'
  };
  
  // Ensure proper engines
  packageJson.engines = {
    node: '>=18.0.0',
    npm: '>=8.0.0'
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  print(`✅ Updated package.json for Vercel deployment`, 'green');
}

function createProductionEnvTemplate() {
  printHeader('Creating Production Environment Template');
  
  const envTemplate = `# Production Environment Variables for Vercel
# Copy these to Vercel Dashboard > Project Settings > Environment Variables

# Core Application
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret-from-generate-keys

# Database (PostgreSQL with SSL)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
DIRECT_URL=postgresql://user:password@host:5432/database?sslmode=require

# Security Configuration
FORM_HMAC_SECRET=your-form-hmac-secret-from-generate-keys
NEXT_PUBLIC_HMAC_SECRET=your-public-hmac-secret-from-generate-keys
ENCRYPTION_KEY=your-encryption-key-from-generate-keys
ADMIN_PASSWORD=your-admin-password-from-generate-keys

# Email Configuration (Gmail recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=noreply@your-domain.com

# Zoho Integration
ZOHO_CLIENT_ID=1000.XXXXXXXXXXXXXXXXXXXXXXXXXX
ZOHO_CLIENT_SECRET=your-zoho-client-secret
ZOHO_CRM_REFRESH=1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ZOHO_BOOKINGS_REFRESH=1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ZOHO_WORKDRIVE_REFRESH=1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ZOHO_CAMPAIGNS_REFRESH=1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ZOHO_REGION=com

# Rate Limiting
RATE_PER_MIN=60

# Optional: Analytics & Monitoring
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Optional: GitHub Integration
GITHUB_WEBHOOK_SECRET=your-github-webhook-secret-from-generate-keys
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

# Optional: Vercel API Integration
VERCEL_TOKEN=your-vercel-api-token
VERCEL_PROJECT_ID=your-vercel-project-id
VERCEL_TEAM_ID=your-vercel-team-id
`;

  const filepath = path.join(process.cwd(), '.env.production.template');
  fs.writeFileSync(filepath, envTemplate);
  
  print(`✅ Created .env.production.template`, 'green');
  print('💡 Use this template to set up environment variables in Vercel Dashboard', 'blue');
  
  return filepath;
}

function createGitIgnoreForSecrets() {
  printHeader('Updating .gitignore for Security');
  
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  const secretPatterns = [
    '',
    '# Security - Never commit these files',
    '.env.secrets',
    '.env.production',
    '.env.local',
    '*.pem',
    '*.p12',
    '*.key',
    '*-key.json',
    'vercel-env-import.json',
    '',
    '# Vercel deployment files',
    '.vercel',
    ''
  ];
  
  let gitignoreContent = '';
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  }
  
  // Add security patterns if not already present
  const newPatterns = secretPatterns.filter(pattern => 
    pattern === '' || !gitignoreContent.includes(pattern)
  );
  
  if (newPatterns.length > 0) {
    gitignoreContent += '\n' + newPatterns.join('\n');
    fs.writeFileSync(gitignorePath, gitignoreContent);
    print(`✅ Updated .gitignore with security patterns`, 'green');
  } else {
    print(`✅ .gitignore already contains security patterns`, 'green');
  }
}

function createVercelDeploymentInstructions() {
  printHeader('Creating Quick Deployment Instructions');
  
  const instructions = `# Quick Vercel Deployment Instructions

## Prerequisites
1. ✅ Run: npm run generate:all-keys
2. ✅ Set up PostgreSQL database (Neon/Supabase)
3. ✅ Configure Gmail SMTP (app password)
4. ✅ Create Zoho OAuth app

## Deployment Steps

### 1. Install Vercel CLI
\`\`\`bash
npm install -g vercel
vercel login
\`\`\`

### 2. Import Project to Vercel
\`\`\`bash
vercel
\`\`\`
- Choose "Import" project
- Connect GitHub repository
- Keep default settings

### 3. Set Environment Variables
1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add all variables from .env.production.template
4. Use "Secret" type for sensitive values

### 4. Deploy to Production
\`\`\`bash
vercel --prod
\`\`\`

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
`;

  const filepath = path.join(process.cwd(), 'DEPLOYMENT_QUICK_START.md');
  fs.writeFileSync(filepath, instructions);
  
  print(`✅ Created DEPLOYMENT_QUICK_START.md`, 'green');
  return filepath;
}

function validateProjectStructure() {
  printHeader('Validating Project Structure');
  
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'middleware.ts',
    'app/layout.tsx',
    'app/page.tsx'
  ];
  
  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length > 0) {
    print('❌ Missing required files:', 'red');
    missingFiles.forEach(file => print(`   • ${file}`, 'red'));
    return false;
  }
  
  print('✅ All required files present', 'green');
  return true;
}

function printFinalInstructions() {
  printHeader('Setup Complete - Next Steps');
  
  print('📋 Your project is now ready for Vercel deployment!', 'bright');
  print('');
  
  print('🔑 NEXT STEPS:', 'yellow');
  print('1. Generate secrets: npm run generate:all-keys', 'blue');
  print('2. Set up external services (database, email, Zoho)', 'blue');
  print('3. Follow VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions', 'blue');
  print('4. Or use DEPLOYMENT_QUICK_START.md for quick deployment', 'blue');
  print('');
  
  print('📁 FILES CREATED:', 'yellow');
  print('• vercel.json - Vercel configuration', 'blue');
  print('• .env.production.template - Environment variables template', 'blue');
  print('• DEPLOYMENT_QUICK_START.md - Quick deployment guide', 'blue');
  print('• Updated .gitignore - Security patterns added', 'blue');
  print('');
  
  print('⚠️  SECURITY REMINDERS:', 'red');
  print('• Never commit .env files to Git', 'red');
  print('• Keep your secrets secure', 'red');
  print('• Use different secrets for different environments', 'red');
  print('');
  
  print('🚀 Ready to deploy? Run: vercel', 'green');
}

function main() {
  print('🔧 Vercel Deployment Setup', 'bright');
  print('Configuring your project for Vercel deployment...', 'cyan');
  
  // Validate project structure
  if (!validateProjectStructure()) {
    print('\n❌ Project structure validation failed. Please fix missing files.', 'red');
    process.exit(1);
  }
  
  // Create configuration files
  createVercelJson();
  updatePackageJsonForVercel();
  createProductionEnvTemplate();
  createGitIgnoreForSecrets();
  createVercelDeploymentInstructions();
  
  // Show final instructions
  printFinalInstructions();
}

// Error handling
process.on('uncaughtException', (error) => {
  print('\n❌ Setup error:', 'red');
  print(error.message, 'red');
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };