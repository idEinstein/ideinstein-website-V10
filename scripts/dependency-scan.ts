#!/usr/bin/env tsx
/**
 * Standalone Dependency Security Scanner
 * Comprehensive vulnerability scanning with multiple fallback methods
 */

import { scanDependencies, generateFixRecommendations, isDependencyScanningAvailable } from '@/lib/security/dependency-scanner';

interface ScanOptions {
  verbose?: boolean;
  format?: 'json' | 'table' | 'summary';
  failOnVulns?: boolean;
  severity?: 'critical' | 'high' | 'moderate' | 'low' | 'info';
}

/**
 * Parse command line arguments
 */
function parseArgs(): ScanOptions {
  const args = process.argv.slice(2);
  const options: ScanOptions = {
    verbose: false,
    format: 'table',
    failOnVulns: false,
    severity: 'moderate'
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
        
      case '--fail-on-vulns':
        options.failOnVulns = true;
        break;
        
      case '--severity':
        const severity = args[i + 1];
        if (['critical', 'high', 'moderate', 'low', 'info'].includes(severity)) {
          options.severity = severity as any;
          i++; // Skip next argument
        }
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
🔍 Dependency Security Scanner

Usage: npm run dependency:scan [options]

Options:
  --verbose, -v          Show detailed output
  --json                 Output results in JSON format
  --summary              Show summary only
  --fail-on-vulns        Exit with error code if vulnerabilities found
  --severity <level>     Minimum severity to report (critical|high|moderate|low|info)
  --help, -h             Show this help message

Examples:
  npm run dependency:scan                    # Basic scan with table output
  npm run dependency:scan --verbose          # Detailed scan output
  npm run dependency:scan --json             # JSON output for CI/CD
  npm run dependency:scan --fail-on-vulns   # Fail build on vulnerabilities
  npm run dependency:scan --severity high   # Only show high+ severity issues

Exit Codes:
  0 - No vulnerabilities found or scan completed successfully
  1 - Vulnerabilities found (when --fail-on-vulns is used)
  2 - Scan failed due to error
`);
}

/**
 * Format vulnerability severity with colors
 */
function formatSeverity(severity: string): string {
  switch (severity) {
    case 'critical': return `🚨 ${severity.toUpperCase()}`;
    case 'high': return `⚠️  ${severity.toUpperCase()}`;
    case 'moderate': return `📋 ${severity.toUpperCase()}`;
    case 'low': return `ℹ️  ${severity.toUpperCase()}`;
    case 'info': return `💡 ${severity.toUpperCase()}`;
    default: return severity;
  }
}

/**
 * Print scan results in table format
 */
function printTableResults(result: any, options: ScanOptions): void {
  console.log('\n🔍 Dependency Security Scan Results');
  console.log('=====================================');
  
  // Summary
  console.log(`\n📊 Summary (scanned via ${result.method}):`);
  console.log(`Total vulnerabilities: ${result.summary.total}`);
  console.log(`Critical: ${result.summary.critical}`);
  console.log(`High: ${result.summary.high}`);
  console.log(`Moderate: ${result.summary.moderate}`);
  console.log(`Low: ${result.summary.low}`);
  console.log(`Info: ${result.summary.info}`);
  console.log(`Scan time: ${result.scanTime}ms`);
  
  // Vulnerabilities
  if (result.vulnerabilities.length > 0) {
    console.log('\n🚨 Vulnerabilities Found:');
    console.log('-------------------------');
    
    const filteredVulns = result.vulnerabilities.filter((vuln: any) => {
      const severityLevels = ['info', 'low', 'moderate', 'high', 'critical'];
      const minLevel = severityLevels.indexOf(options.severity || 'moderate');
      const vulnLevel = severityLevels.indexOf(vuln.severity);
      return vulnLevel >= minLevel;
    });
    
    for (const vuln of filteredVulns) {
      console.log(`\n📦 ${vuln.name}@${vuln.version}`);
      console.log(`   Severity: ${formatSeverity(vuln.severity)}`);
      console.log(`   Range: ${vuln.range}`);
      
      if (vuln.via && vuln.via.length > 0) {
        console.log(`   Issue: ${vuln.via[0].title}`);
        if (options.verbose && vuln.via[0].overview) {
          console.log(`   Details: ${vuln.via[0].overview}`);
        }
        if (vuln.via[0].recommendation) {
          console.log(`   Fix: ${vuln.via[0].recommendation}`);
        }
      }
      
      if (vuln.fixAvailable) {
        console.log(`   ✅ Fix available`);
      }
    }
  } else {
    console.log('\n✅ No vulnerabilities found!');
  }
  
  // Recommendations
  if (result.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    console.log('-------------------');
    result.recommendations.forEach((rec: string, index: number) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
}

/**
 * Print scan results in summary format
 */
function printSummaryResults(result: any): void {
  const status = result.summary.critical > 0 ? '🚨 CRITICAL' :
                result.summary.high > 0 ? '⚠️ HIGH' :
                result.summary.moderate > 0 ? '📋 MODERATE' :
                result.summary.total > 0 ? 'ℹ️ LOW' : '✅ SECURE';
  
  console.log(`Status: ${status}`);
  console.log(`Vulnerabilities: ${result.summary.total} (${result.summary.critical}C/${result.summary.high}H/${result.summary.moderate}M/${result.summary.low}L)`);
  console.log(`Method: ${result.method}`);
  console.log(`Time: ${result.scanTime}ms`);
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const options = parseArgs();
  
  try {
    if (options.verbose) {
      console.log('🚀 Starting dependency security scan...\n');
    }
    
    // Check availability
    const availability = await isDependencyScanningAvailable();
    
    if (options.verbose) {
      console.log('📋 Scan Methods Available:');
      availability.methods.forEach(method => console.log(`  ✅ ${method}`));
      
      if (availability.limitations.length > 0) {
        console.log('\n⚠️ Limitations:');
        availability.limitations.forEach(limitation => console.log(`  ❌ ${limitation}`));
      }
      console.log();
    }
    
    if (!availability.available) {
      console.error('❌ No dependency scanning methods available');
      process.exit(2);
    }
    
    // Run scan
    const result = await scanDependencies();
    
    if (!result.success) {
      console.error(`❌ Dependency scan failed: ${result.error}`);
      process.exit(2);
    }
    
    // Generate recommendations
    const recommendations = generateFixRecommendations(result);
    result.recommendations = recommendations;
    
    // Output results
    switch (options.format) {
      case 'json':
        console.log(JSON.stringify(result, null, 2));
        break;
        
      case 'summary':
        printSummaryResults(result);
        break;
        
      case 'table':
      default:
        printTableResults(result, options);
        break;
    }
    
    // Exit with appropriate code
    if (options.failOnVulns && result.summary.total > 0) {
      const severityLevels = ['info', 'low', 'moderate', 'high', 'critical'];
      const minLevel = severityLevels.indexOf(options.severity || 'moderate');
      
      const hasRelevantVulns = result.vulnerabilities.some((vuln: any) => {
        const vulnLevel = severityLevels.indexOf(vuln.severity);
        return vulnLevel >= minLevel;
      });
      
      if (hasRelevantVulns) {
        console.error(`\n❌ Exiting with error due to ${options.severity}+ vulnerabilities`);
        process.exit(1);
      }
    }
    
    if (options.verbose) {
      console.log('\n✅ Dependency scan completed successfully');
    }
    
  } catch (error) {
    console.error('❌ Dependency scan failed:', error);
    process.exit(2);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { main as runDependencyScan };