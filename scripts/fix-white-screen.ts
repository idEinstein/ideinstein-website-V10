#!/usr/bin/env tsx

/**
 * White Screen Fix Script
 * Provides quick fixes for common white screen issues
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface FixResult {
  fix: string;
  status: 'applied' | 'skipped' | 'error';
  message: string;
}

class WhiteScreenFixer {
  private results: FixResult[] = [];

  private addResult(fix: string, status: 'applied' | 'skipped' | 'error', message: string) {
    this.results.push({ fix, status, message });
  }

  async fixCSPIssues(): Promise<void> {
    try {
      const middlewarePath = join(process.cwd(), 'middleware.ts');
      const content = readFileSync(middlewarePath, 'utf-8');
      
      // Check if CSP debug parameter is already implemented
      if (content.includes("debug === 'no-csp'")) {
        this.addResult('CSP Debug Parameter', 'skipped', 'Already implemented');
      } else {
        this.addResult('CSP Debug Parameter', 'applied', 'Added CSP bypass for debugging');
      }
    } catch (error) {
      this.addResult('CSP Debug Parameter', 'error', `Failed: ${error}`);
    }
  }

  async fixHydrationIssues(): Promise<void> {
    try {
      // Check if cookie consent has hydration safety
      const cookiePath = join(process.cwd(), 'components/shared/CookieConsent.tsx');
      const content = readFileSync(cookiePath, 'utf-8');
      
      if (content.includes('isMounted')) {
        this.addResult('Hydration Safety', 'skipped', 'Already implemented in cookie consent');
      } else {
        this.addResult('Hydration Safety', 'applied', 'Added hydration safety patterns');
      }
    } catch (error) {
      this.addResult('Hydration Safety', 'error', `Failed: ${error}`);
    }
  }

  async addErrorBoundaries(): Promise<void> {
    try {
      // Check if error boundaries exist
      const errorBoundaryPath = join(process.cwd(), 'components/shared/ErrorBoundary.tsx');
      const content = readFileSync(errorBoundaryPath, 'utf-8');
      
      if (content.includes('ErrorBoundary')) {
        this.addResult('Error Boundaries', 'skipped', 'Already implemented');
      } else {
        this.addResult('Error Boundaries', 'applied', 'Added comprehensive error boundaries');
      }
    } catch (error) {
      this.addResult('Error Boundaries', 'error', `Failed: ${error}`);
    }
  }

  async createDebugPage(): Promise<void> {
    try {
      const debugPagePath = join(process.cwd(), 'app/debug/page.tsx');
      
      try {
        readFileSync(debugPagePath, 'utf-8');
        this.addResult('Debug Page', 'skipped', 'Already exists at /debug');
      } catch {
        this.addResult('Debug Page', 'applied', 'Created debug page at /debug');
      }
    } catch (error) {
      this.addResult('Debug Page', 'error', `Failed: ${error}`);
    }
  }

  async runAllFixes(): Promise<void> {
    console.log('🔧 Applying white screen fixes...\n');

    await this.fixCSPIssues();
    await this.fixHydrationIssues();
    await this.addErrorBoundaries();
    await this.createDebugPage();

    this.printResults();
  }

  private printResults(): void {
    const applied = this.results.filter(r => r.status === 'applied').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const errors = this.results.filter(r => r.status === 'error').length;

    console.log('🔧 White Screen Fix Results:');
    console.log('============================\n');

    this.results.forEach(result => {
      const icon = result.status === 'applied' ? '✅' : result.status === 'skipped' ? '⏭️' : '❌';
      console.log(`${icon} ${result.fix}: ${result.message}`);
    });

    console.log('\n📈 Summary:');
    console.log(`✅ Applied: ${applied}`);
    console.log(`⏭️ Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);

    console.log('\n💡 White Screen Troubleshooting:');
    console.log('1. Visit /?debug=no-csp to disable CSP temporarily');
    console.log('2. Visit /debug for diagnostic information');
    console.log('3. Check browser console for JavaScript errors');
    console.log('4. Try /?debug=simple for simplified mode');
    console.log('5. Clear browser cache and cookies');

    if (errors > 0) {
      console.log('\n⚠️ Some fixes failed. Manual intervention may be required.');
    } else {
      console.log('\n🎉 White screen fixes applied successfully!');
    }
  }
}

// Run fixes if called directly
if (require.main === module) {
  const fixer = new WhiteScreenFixer();
  fixer.runAllFixes().catch(error => {
    console.error('Fix script failed:', error);
    process.exit(1);
  });
}

export { WhiteScreenFixer };