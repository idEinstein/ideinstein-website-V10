#!/usr/bin/env tsx
/**
 * Security Documentation Generator Script
 * Generates comprehensive security documentation
 */

import { mkdir } from 'fs/promises';
import { generateSecurityDocumentation } from '@/lib/security/documentation-generator';

interface GenerateOptions {
  outputDir?: string;
  includeCompliance?: boolean;
  includeImplementation?: boolean;
  verbose?: boolean;
  format?: 'markdown' | 'html' | 'json';
}

/**
 * Parse command line arguments
 */
function parseArgs(): GenerateOptions {
  const args = process.argv.slice(2);
  const options: GenerateOptions = {
    outputDir: 'docs/security',
    includeCompliance: true,
    includeImplementation: true,
    verbose: false,
    format: 'markdown'
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--output-dir':
      case '-o':
        options.outputDir = args[i + 1];
        i++; // Skip next argument
        break;
        
      case '--no-compliance':
        options.includeCompliance = false;
        break;
        
      case '--no-implementation':
        options.includeImplementation = false;
        break;
        
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
        
      case '--format':
        const format = args[i + 1];
        if (['markdown', 'html', 'json'].includes(format)) {
          options.format = format as any;
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
📚 Security Documentation Generator

Usage: npm run security:docs [options]

Options:
  --output-dir, -o <dir>     Output directory (default: docs/security)
  --no-compliance            Skip OWASP compliance documentation
  --no-implementation        Skip implementation guides
  --verbose, -v              Show detailed output
  --format <format>          Output format: markdown|html|json (default: markdown)
  --help, -h                 Show this help message

Examples:
  npm run security:docs                           # Generate all documentation
  npm run security:docs --verbose                # Detailed output
  npm run security:docs --output-dir docs/sec    # Custom output directory
  npm run security:docs --no-compliance          # Skip OWASP compliance docs

Generated Files:
  - README.md                    # Security implementation overview
  - OWASP-2024-Compliance.md    # OWASP Top 10 compliance report
  - Configuration-Guide.md      # Security configuration guide
  - Incident-Response-Guide.md  # Security incident procedures
  - Dependency-Security-Report.md # Current dependency vulnerabilities
`);
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const options = parseArgs();
  
  try {
    if (options.verbose) {
      console.log('🚀 Starting security documentation generation...');
      console.log(`📁 Output directory: ${options.outputDir}`);
      console.log(`📋 Include compliance: ${options.includeCompliance}`);
      console.log(`📖 Include implementation: ${options.includeImplementation}`);
      console.log(`📄 Format: ${options.format}\n`);
    }
    
    // Ensure output directory exists
    try {
      await mkdir(options.outputDir!, { recursive: true });
      if (options.verbose) {
        console.log(`✅ Created output directory: ${options.outputDir}`);
      }
    } catch (error) {
      // Directory might already exist
    }
    
    // Generate documentation
    const result = await generateSecurityDocumentation({
      outputDir: options.outputDir!,
      includeCodeExamples: true,
      includeCompliance: options.includeCompliance!,
      includeImplementationGuides: options.includeImplementation!,
      format: options.format!
    });
    
    if (!result.success) {
      console.error(`❌ Documentation generation failed: ${result.error}`);
      process.exit(1);
    }
    
    // Display results
    console.log('\n📚 Security Documentation Generated Successfully!');
    console.log('================================================');
    
    console.log(`\n📊 Summary:`);
    console.log(`- Features analyzed: ${result.summary.featuresAnalyzed}`);
    console.log(`- Features implemented: ${result.summary.implementedFeatures}`);
    console.log(`- Implementation coverage: ${result.summary.compliancePercentage.toFixed(1)}%`);
    console.log(`- Files generated: ${result.files.length}`);
    
    console.log(`\n📁 Generated Files:`);
    result.files.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });
    
    // Security status assessment
    console.log(`\n🔒 Security Status Assessment:`);
    if (result.summary.compliancePercentage >= 80) {
      console.log('🟢 EXCELLENT - Strong security implementation');
    } else if (result.summary.compliancePercentage >= 60) {
      console.log('🟡 GOOD - Solid security foundation');
    } else {
      console.log('🔴 NEEDS ATTENTION - Security gaps require attention');
    }
    
    console.log(`\n💡 Next Steps:`);
    console.log('1. Review the generated documentation');
    console.log('2. Share with your team and stakeholders');
    console.log('3. Address any identified security gaps');
    console.log('4. Set up regular documentation updates');
    console.log('5. Use the incident response guide for security procedures');
    
    if (options.verbose) {
      console.log(`\n🔍 Detailed Analysis:`);
      console.log(`- OWASP compliance documentation: ${options.includeCompliance ? 'Generated' : 'Skipped'}`);
      console.log(`- Implementation guides: ${options.includeImplementation ? 'Generated' : 'Skipped'}`);
      console.log(`- Output format: ${options.format}`);
    }
    
    console.log('\n✅ Documentation generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Documentation generation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { main as generateSecurityDocs };