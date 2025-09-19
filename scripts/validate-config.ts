#!/usr/bin/env tsx
/**
 * Configuration Validation Script
 * Validates TypeScript, Next.js, and other configuration files
 */

import { validateConfigurations, getConfigValidationStatus } from '@/lib/security/config-validator';

interface ValidateOptions {
  verbose?: boolean;
  format?: 'table' | 'json' | 'summary';
  failOnWarnings?: boolean;
  fixSuggestions?: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(): ValidateOptions {
  const args = process.argv.slice(2);
  const options: ValidateOptions = {
    verbose: false,
    format: 'table',
    failOnWarnings: false,
    fixSuggestions: true
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
        
      case '--json':
        options.format = 'json';
        break;
        
      case '--summary':
        options.format = 'summary';
        break;
        
      case '--fail-on-warnings':
        options.failOnWarnings = true;
        break;
        
      case '--no-fix-suggestions':
        options.fixSuggestions = false;
        break;
        
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
    }
  }
  
  return options;
}

/**
 * Print help information
 */
function printHelp(): void {
  console.log(`
🔧 Configuration Validation Tool

Usage: npm run validate:config [options]

Options:
  --verbose, -v          Show detailed output
  --json                 Output results in JSON format
  --summary              Show summary only
  --fail-on-warnings     Exit with error code if warnings found
  --no-fix-suggestions   Don't show fix suggestions
  --help, -h             Show this help message

Examples:
  npm run validate:config                    # Basic validation
  npm run validate:config --verbose          # Detailed output
  npm run validate:config --json             # JSON output for CI/CD
  npm run validate:config --fail-on-warnings # Strict mode for CI/CD

Validated Files:
  - tsconfig.json        # TypeScript configuration
  - next.config.js       # Next.js configuration  
  - package.json         # Package and scripts configuration
  - .env.example         # Environment variables template

Exit Codes:
  0 - All configurations valid
  1 - Critical or high priority issues found
  2 - Warnings found (when --fail-on-warnings is used)
  3 - Validation failed due to error
`);
}

/**
 * Format severity with colors
 */
function formatSeverity(severity: string): string {
  switch (severity) {
    case 'critical': return `🚨 ${severity.toUpperCase()}`;
    case 'high': return `⚠️  ${severity.toUpperCase()}`;
    case 'medium': return `📋 ${severity.toUpperCase()}`;
    case 'low': return `ℹ️  ${severity.toUpperCase()}`;
    default: return severity;
  }
}

/**
 * Format file status
 */
function formatFileStatus(status: string): string {
  switch (status) {
    case 'valid': return '✅ VALID';
    case 'warning': return '⚠️  WARNINGS';
    case 'error': return '❌ ERRORS';
    default: return status;
  }
}

/**
 * Print results in table format
 */
function printTableResults(results: any[], summary: any, options: ValidateOptions): void {
  console.log('\n🔧 Configuration Validation Results');
  console.log('===================================');
  
  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`Total files: ${summary.totalFiles}`);
  console.log(`Valid: ${summary.validFiles}`);
  console.log(`Warnings: ${summary.filesWithWarnings}`);
  console.log(`Errors: ${summary.filesWithErrors}`);
  console.log(`Critical issues: ${summary.criticalIssues}`);
  console.log(`High priority issues: ${summary.highIssues}`);
  
  // Overall status
  const status = getConfigValidationStatus(summary);
  console.log(`\n🔒 Overall Status: ${formatFileStatus(status.status)} (Score: ${status.score}/100)`);
  console.log(`Message: ${status.message}`);
  
  // File details
  console.log('\n📁 File Details:');
  console.log('----------------');
  
  for (const result of results) {
    console.log(`\n📄 ${result.file}: ${formatFileStatus(result.status)}`);
    
    if (result.issues.length > 0) {
      console.log('   Issues:');
      for (const issue of result.issues) {
        console.log(`   ${formatSeverity(issue.severity)} ${issue.message}`);
        if (options.fixSuggestions && issue.fix) {
          console.log(`      Fix: ${issue.fix}`);
        }
      }
    }
    
    if (options.verbose && result.recommendations.length > 0) {
      console.log('   Recommendations:');
      for (const rec of result.recommendations) {
        console.log(`   ${rec}`);
      }
    }
  }
  
  // Global recommendations
  if (summary.recommendations.length > 0 && options.verbose) {
    console.log('\n💡 Overall Recommendations:');
    console.log('---------------------------');
    summary.recommendations.forEach((rec: string, index: number) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
}

/**
 * Print results in summary format
 */
function printSummaryResults(summary: any): void {
  const status = getConfigValidationStatus(summary);
  
  console.log(`Status: ${status.status.toUpperCase()}`);
  console.log(`Score: ${status.score}/100`);
  console.log(`Files: ${summary.validFiles}/${summary.totalFiles} valid`);
  console.log(`Issues: ${summary.criticalIssues}C/${summary.highIssues}H`);
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const options = parseArgs();
  
  try {
    if (options.verbose) {
      console.log('🚀 Starting configuration validation...\n');
    }
    
    // Run validation
    const { results, summary } = await validateConfigurations();
    
    // Output results
    switch (options.format) {
      case 'json':
        console.log(JSON.stringify({ results, summary }, null, 2));
        break;
        
      case 'summary':
        printSummaryResults(summary);
        break;
        
      case 'table':
      default:
        printTableResults(results, summary, options);
        break;
    }
    
    // Determine exit code
    if (summary.criticalIssues > 0 || summary.filesWithErrors > 0) {
      console.error(`\n❌ Configuration validation failed with ${summary.criticalIssues} critical and ${summary.filesWithErrors} error(s)`);
      process.exit(1);
    }
    
    if (options.failOnWarnings && summary.filesWithWarnings > 0) {
      console.error(`\n⚠️  Configuration validation failed due to ${summary.filesWithWarnings} warning(s)`);
      process.exit(2);
    }
    
    if (options.verbose) {
      console.log('\n✅ Configuration validation completed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    process.exit(3);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { main as validateConfig };