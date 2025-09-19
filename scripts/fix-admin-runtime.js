/**
 * Fix Admin Routes Runtime Configuration
 * Ensures all admin routes using withAdminAuth have Node.js runtime specified
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const WORKSPACE_ROOT = 'c:/Users/sarva/Desktop/3d print website Ideinstein/IdEinstein-V10-Deployment';
const API_ROUTES_PATTERN = path.join(WORKSPACE_ROOT, 'app/api/**/route.ts').replace(/\\/g, '/');

// Runtime configuration to add
const RUNTIME_CONFIG = `
// Ensure Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';`;

async function fixAdminRoutes() {
  console.log('🔧 Fixing admin route runtime configurations...');
  
  try {
    // Find all API route files
    const routeFiles = glob.sync(API_ROUTES_PATTERN);
    console.log(`📁 Found ${routeFiles.length} route files`);
    
    let fixedCount = 0;
    
    for (const filePath of routeFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file uses withAdminAuth
        if (content.includes('withAdminAuth')) {
          console.log(`🔍 Checking: ${path.relative(WORKSPACE_ROOT, filePath)}`);
          
          // Check if already has runtime configuration
          if (!content.includes("export const runtime = 'nodejs'")) {
            console.log(`🔧 Adding runtime config to: ${path.relative(WORKSPACE_ROOT, filePath)}`);
            
            // Add runtime configuration at the end
            const updatedContent = content.trimEnd() + RUNTIME_CONFIG;
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            fixedCount++;
          } else {
            console.log(`✅ Already configured: ${path.relative(WORKSPACE_ROOT, filePath)}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
      }
    }
    
    console.log(`✅ Fixed ${fixedCount} admin route files`);
    
  } catch (error) {
    console.error('❌ Error fixing admin routes:', error);
  }
}

// Run the fix
fixAdminRoutes();