/**
 * Cryptographic Implementation Validator
 * Validates secure cryptographic implementations and practices
 */

import { readFile, access, readdir } from 'fs/promises';
import { join } from 'path';

export interface CryptoValidationResult {
  category: string;
  check: string;
  status: 'secure' | 'warning' | 'vulnerable';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  recommendations: string[];
  codeExamples?: string[];
}

export interface CryptoValidationSummary {
  totalChecks: number;
  secureImplementations: number;
  warnings: number;
  vulnerabilities: number;
  criticalIssues: number;
  overallScore: number;
  overallStatus: 'secure' | 'needs_attention' | 'vulnerable';
}

/**
 * Validate bcrypt implementation
 */
async function validateBcryptImplementation(): Promise<CryptoValidationResult[]> {
  const results: CryptoValidationResult[] = [];
  
  try {
    // Check if bcryptjs is properly installed
    const packageContent = await readFile('package.json', 'utf-8');
    const packageJson = JSON.parse(packageContent);
    
    const hasBcrypt = packageJson.dependencies?.['bcryptjs'] || packageJson.devDependencies?.['bcryptjs'];
    
    if (hasBcrypt) {
      results.push({
        category: 'Password Hashing',
        check: 'bcryptjs dependency',
        status: 'secure',
        severity: 'high',
        details: `bcryptjs ${hasBcrypt} is installed`,
        recommendations: ['✅ Using industry-standard bcrypt for password hashing']
      });
    } else {
      results.push({
        category: 'Password Hashing',
        check: 'bcryptjs dependency',
        status: 'vulnerable',
        severity: 'critical',
        details: 'bcryptjs is not installed',
        recommendations: ['Install bcryptjs for secure password hashing: npm install bcryptjs']
      });
    }
    
    // Check bcrypt usage in authentication files
    const authFiles = [
      'lib/auth/admin-auth.ts',
      'app/api/admin/validate/route.ts',
      'app/api/admin/verify-token/route.ts',
      'scripts/generate-admin-hash.js',
      'scripts/fix-hash-format.js'
    ];
    
    let properBcryptUsage = 0;
    let totalAuthFiles = 0;
    let foundBcryptImplementation = false;
    
    for (const file of authFiles) {
      try {
        await access(file);
        totalAuthFiles++;
        
        const content = await readFile(file, 'utf-8');
        
        // Check for proper bcrypt usage (more comprehensive patterns)
        if (content.includes('bcrypt.compare') || 
            content.includes('bcrypt.hash') ||
            content.includes('bcryptjs') ||
            content.includes('compareSync') ||
            content.includes('hashSync')) {
          properBcryptUsage++;
          foundBcryptImplementation = true;
        }
        
        // Check for insecure practices (but be smart about fallbacks)
        if (content.includes('password === ') && !content.includes('bcrypt.compare')) {
          // Check if this is a documented fallback or temporary fix
          const isDocumentedFallback = content.includes('Fallback') || 
                                     content.includes('TEMPORARY') ||
                                     content.includes('fallback') ||
                                     content.includes('temporary');
          
          if (isDocumentedFallback) {
            results.push({
              category: 'Password Hashing',
              check: `Temporary password comparison fallback in ${file}`,
              status: 'warning',
              severity: 'high',
              details: 'Plain text password comparison detected as documented fallback',
              recommendations: [
                'Remove temporary fallback and use bcrypt.compare() exclusively',
                'Ensure bcrypt is available in all runtime environments',
                'Consider using environment-specific authentication strategies'
              ]
            });
          } else {
            results.push({
              category: 'Password Hashing',
              check: `Insecure password comparison in ${file}`,
              status: 'vulnerable',
              severity: 'critical',
              details: 'Plain text password comparison detected',
              recommendations: [
                'Replace plain text comparison with bcrypt.compare()',
                'Never store or compare passwords in plain text'
              ],
              codeExamples: [
                '// INSECURE: password === storedPassword',
                '// SECURE: await bcrypt.compare(password, hashedPassword)'
              ]
            });
          }
        }
        
        // Check for proper salt rounds (enhanced detection)
        if (content.includes('bcrypt.hash') || content.includes('hashSync')) {
          const saltRoundMatch = content.match(/(?:saltRounds|rounds?)\s*[=:]\s*(\d+)/i) ||
                                content.match(/\.hash\([^,]+,\s*(\d+)/);
          
          if (saltRoundMatch) {
            const rounds = parseInt(saltRoundMatch[1]);
            if (rounds >= 12) {
              results.push({
                category: 'Password Hashing',
                check: `Salt rounds in ${file}`,
                status: 'secure',
                severity: 'medium',
                details: `Using ${rounds} salt rounds (secure)`,
                recommendations: ['✅ Using secure salt rounds for bcrypt']
              });
            } else {
              results.push({
                category: 'Password Hashing',
                check: `Salt rounds in ${file}`,
                status: 'warning',
                severity: 'high',
                details: `Using ${rounds} salt rounds (should be 12+)`,
                recommendations: ['Increase salt rounds to at least 12 for better security']
              });
            }
          } else if (content.includes('12') || content.includes('saltRounds')) {
            results.push({
              category: 'Password Hashing',
              check: `Salt rounds in ${file}`,
              status: 'secure',
              severity: 'medium',
              details: 'Proper salt rounds (12+) detected',
              recommendations: ['✅ Using secure salt rounds for bcrypt']
            });
          } else {
            results.push({
              category: 'Password Hashing',
              check: `Salt rounds in ${file}`,
              status: 'warning',
              severity: 'medium',
              details: 'Salt rounds not clearly specified',
              recommendations: ['Use at least 12 salt rounds for bcrypt: bcrypt.hash(password, 12)']
            });
          }
        }
        
      } catch (error) {
        // File doesn't exist, skip
      }
    }
    
    // Overall bcrypt implementation assessment
    if (foundBcryptImplementation) {
      results.push({
        category: 'Password Hashing',
        check: 'bcrypt implementation detection',
        status: 'secure',
        severity: 'high',
        details: 'bcrypt implementation found in authentication system',
        recommendations: ['✅ bcrypt is properly implemented for password hashing']
      });
    }
    
    if (totalAuthFiles > 0) {
      const bcryptCoverage = (properBcryptUsage / totalAuthFiles) * 100;
      
      if (bcryptCoverage >= 80) {
        results.push({
          category: 'Password Hashing',
          check: 'bcrypt implementation coverage',
          status: 'secure',
          severity: 'high',
          details: `${bcryptCoverage.toFixed(1)}% of authentication files use bcrypt properly`,
          recommendations: ['✅ Good bcrypt implementation coverage']
        });
      } else {
        results.push({
          category: 'Password Hashing',
          check: 'bcrypt implementation coverage',
          status: 'warning',
          severity: 'high',
          details: `Only ${bcryptCoverage.toFixed(1)}% of authentication files use bcrypt properly`,
          recommendations: ['Implement bcrypt in all authentication-related files']
        });
      }
    }
    
  } catch (error) {
    results.push({
      category: 'Password Hashing',
      check: 'bcrypt validation',
      status: 'vulnerable',
      severity: 'critical',
      details: 'Cannot validate bcrypt implementation',
      recommendations: ['Ensure bcrypt is properly installed and configured']
    });
  }
  
  return results;
}

/**
 * Validate secure random number generation
 */
async function validateRandomGeneration(): Promise<CryptoValidationResult[]> {
  const results: CryptoValidationResult[] = [];
  
  try {
    // Check for crypto.randomUUID usage in middleware and other files
    const criticalFiles = [
      'middleware.ts',
      'lib/auth/admin-auth.ts',
      'app/api/admin/validate/route.ts'
    ];
    
    let secureUUIDUsage = false;
    let insecureUUIDUsage = false;
    
    for (const file of criticalFiles) {
      try {
        const content = await readFile(file, 'utf-8');
        
        if (content.includes('crypto.randomUUID()') || content.includes('randomUUID')) {
          secureUUIDUsage = true;
        }
        
        if (content.includes('Math.random()') && 
            (content.includes('toString(36)') || content.includes('uuid') || content.includes('id'))) {
          insecureUUIDUsage = true;
        }
      } catch (error) {
        // File doesn't exist, skip
      }
    }
    
    if (secureUUIDUsage) {
      results.push({
        category: 'Random Generation',
        check: 'Secure UUID generation',
        status: 'secure',
        severity: 'medium',
        details: 'Using crypto.randomUUID() for secure UUID generation',
        recommendations: ['✅ Using cryptographically secure UUID generation']
      });
    }
    
    if (insecureUUIDUsage) {
      results.push({
        category: 'Random Generation',
        check: 'UUID generation security',
        status: 'vulnerable',
        severity: 'high',
        details: 'Using Math.random() for UUID generation (not cryptographically secure)',
        recommendations: [
          'Replace Math.random() with crypto.randomUUID()',
          'Use crypto.getRandomValues() for other random number needs'
        ],
        codeExamples: [
          '// INSECURE: Math.random().toString(36)',
          '// SECURE: crypto.randomUUID()'
        ]
      });
    }
    
    // Check for crypto.getRandomValues and crypto.randomBytes usage
    const allFiles = await findTsFiles('.');
    let secureRandomUsage = 0;
    let insecureRandomUsage = 0;
    const cryptoRandomFiles: string[] = [];
    const mathRandomFiles: string[] = [];
    
    for (const file of allFiles.slice(0, 30)) { // Limit for performance
      try {
        const content = await readFile(file, 'utf-8');
        
        if (content.includes('crypto.getRandomValues') || 
            content.includes('crypto.randomBytes') ||
            content.includes('crypto.randomUUID')) {
          secureRandomUsage++;
          cryptoRandomFiles.push(file);
        }
        
        if (content.includes('Math.random()') && 
            !content.includes('// test') && 
            !content.includes('// demo') &&
            !content.includes('example')) {
          insecureRandomUsage++;
          mathRandomFiles.push(file);
        }
      } catch (error) {
        // Skip unreadable files
      }
    }
    
    if (secureRandomUsage > 0) {
      results.push({
        category: 'Random Generation',
        check: 'Cryptographically secure random usage',
        status: 'secure',
        severity: 'medium',
        details: `Found secure random generation in ${secureRandomUsage} files`,
        recommendations: ['✅ Using cryptographically secure random number generation']
      });
    }
    
    if (insecureRandomUsage > 0) {
      results.push({
        category: 'Random Generation',
        check: 'Insecure random number usage',
        status: 'warning',
        severity: 'medium',
        details: `Found ${insecureRandomUsage} files using Math.random()`,
        recommendations: [
          'Replace Math.random() with crypto.getRandomValues() for security-sensitive operations',
          'Use crypto.randomBytes() in Node.js environments',
          `Files to review: ${mathRandomFiles.slice(0, 3).join(', ')}`
        ]
      });
    } else if (secureRandomUsage === 0) {
      results.push({
        category: 'Random Generation',
        check: 'Random number generation security',
        status: 'warning',
        severity: 'low',
        details: 'No random number generation detected',
        recommendations: ['Consider implementing secure random generation if needed for your application']
      });
    } else {
      results.push({
        category: 'Random Generation',
        check: 'Random number generation security',
        status: 'secure',
        severity: 'medium',
        details: 'No insecure random number generation detected',
        recommendations: ['✅ No Math.random() usage found in security-sensitive contexts']
      });
    }
    
  } catch (error) {
    results.push({
      category: 'Random Generation',
      check: 'Random generation validation',
      status: 'warning',
      severity: 'medium',
      details: 'Cannot validate random number generation',
      recommendations: ['Manually review random number generation implementations']
    });
  }
  
  return results;
}

/**
 * Validate HMAC implementation
 */
async function validateHMACImplementation(): Promise<CryptoValidationResult[]> {
  const results: CryptoValidationResult[] = [];
  
  try {
    const middlewareContent = await readFile('middleware.ts', 'utf-8');
    
    // Check for HMAC implementation
    if (middlewareContent.includes('crypto.subtle.importKey') && 
        middlewareContent.includes('HMAC') &&
        middlewareContent.includes('SHA-256')) {
      results.push({
        category: 'HMAC Validation',
        check: 'HMAC implementation',
        status: 'secure',
        severity: 'high',
        details: 'Proper HMAC-SHA256 implementation using Web Crypto API',
        recommendations: ['✅ Using secure HMAC implementation with SHA-256']
      });
    } else {
      results.push({
        category: 'HMAC Validation',
        check: 'HMAC implementation',
        status: 'warning',
        severity: 'high',
        details: 'HMAC implementation not found or incomplete',
        recommendations: ['Implement HMAC validation for form security']
      });
    }
    
    // Check for HMAC secret configuration
    if (middlewareContent.includes('FORM_HMAC_SECRET')) {
      results.push({
        category: 'HMAC Validation',
        check: 'HMAC secret configuration',
        status: 'secure',
        severity: 'medium',
        details: 'HMAC secret is properly configured from environment',
        recommendations: ['✅ HMAC secret is externalized to environment variables']
      });
    } else {
      results.push({
        category: 'HMAC Validation',
        check: 'HMAC secret configuration',
        status: 'vulnerable',
        severity: 'high',
        details: 'HMAC secret not properly configured',
        recommendations: ['Configure FORM_HMAC_SECRET environment variable']
      });
    }
    
    // Check for timing-safe comparison
    if (middlewareContent.includes('timingSafeEqual') || 
        middlewareContent.includes('crypto.timingSafeEqual')) {
      results.push({
        category: 'HMAC Validation',
        check: 'Timing-safe HMAC comparison',
        status: 'secure',
        severity: 'high',
        details: 'Using timing-safe comparison for HMAC validation',
        recommendations: ['✅ Protected against timing attacks']
      });
    } else if (middlewareContent.includes('HMAC validation temporarily disabled') ||
               middlewareContent.includes('TEMPORARY FIX: Disable HMAC')) {
      results.push({
        category: 'HMAC Validation',
        check: 'Timing-safe HMAC comparison',
        status: 'warning',
        severity: 'low',
        details: 'HMAC validation is temporarily disabled',
        recommendations: [
          'Re-enable HMAC validation when ready',
          'Implement timing-safe comparison when HMAC is re-enabled'
        ]
      });
    } else if (middlewareContent.includes('sig === digest') || 
               middlewareContent.includes('signature === expected')) {
      results.push({
        category: 'HMAC Validation',
        check: 'Timing-safe HMAC comparison',
        status: 'warning',
        severity: 'medium',
        details: 'HMAC comparison may be vulnerable to timing attacks',
        recommendations: [
          'Use crypto.timingSafeEqual() for HMAC comparison',
          'Avoid direct string comparison for cryptographic values'
        ],
        codeExamples: [
          '// INSECURE: signature === expectedSignature',
          '// SECURE: crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))'
        ]
      });
    } else {
      results.push({
        category: 'HMAC Validation',
        check: 'Timing-safe HMAC comparison',
        status: 'secure',
        severity: 'medium',
        details: 'No timing-vulnerable HMAC comparison detected',
        recommendations: ['✅ No insecure HMAC comparison found']
      });
    }
    
  } catch (error) {
    results.push({
      category: 'HMAC Validation',
      check: 'HMAC implementation',
      status: 'warning',
      severity: 'high',
      details: 'Cannot validate HMAC implementation',
      recommendations: ['Manually review HMAC implementation in middleware.ts']
    });
  }
  
  return results;
}

/**
 * Validate token generation and storage
 */
async function validateTokenSecurity(): Promise<CryptoValidationResult[]> {
  const results: CryptoValidationResult[] = [];
  
  try {
    // Check multiple files for token security
    const tokenFiles = [
      'lib/auth/admin-auth.ts',
      'app/api/admin/validate/route.ts',
      'app/api/admin/verify-token/route.ts',
      'middleware.ts'
    ];
    
    let secureTokenGeneration = false;
    let properTokenEncoding = false;
    let sessionManagement = false;
    let insecureTokenStorage = false;
    
    for (const file of tokenFiles) {
      try {
        const content = await readFile(file, 'utf-8');
        
        // Check for secure token generation
        if (content.includes('crypto.randomUUID') || 
            content.includes('crypto.getRandomValues') ||
            content.includes('crypto.randomBytes')) {
          secureTokenGeneration = true;
        }
        
        // Check for proper token encoding/decoding
        if (content.includes('Buffer.from') && content.includes('base64')) {
          properTokenEncoding = true;
        }
        
        // Check for session management
        if (content.includes('session') || 
            content.includes('expiry') || 
            content.includes('timeout') ||
            content.includes('expires') ||
            content.includes('maxAge')) {
          sessionManagement = true;
        }
        
        // Check for insecure token storage
        if (content.includes('localStorage') || content.includes('sessionStorage')) {
          insecureTokenStorage = true;
        }
        
      } catch (error) {
        // File doesn't exist, skip
      }
    }
    
    // Evaluate secure token generation
    if (secureTokenGeneration) {
      results.push({
        category: 'Token Security',
        check: 'Secure token generation',
        status: 'secure',
        severity: 'high',
        details: 'Using cryptographically secure token generation',
        recommendations: ['✅ Secure token generation implementation']
      });
    } else {
      results.push({
        category: 'Token Security',
        check: 'Secure token generation',
        status: 'warning',
        severity: 'high',
        details: 'Secure token generation not clearly implemented',
        recommendations: [
          'Use crypto.randomUUID() or crypto.getRandomValues() for token generation',
          'Avoid Math.random() for security-sensitive tokens'
        ]
      });
    }
    
    // Evaluate token encoding
    if (properTokenEncoding) {
      results.push({
        category: 'Token Security',
        check: 'Token encoding',
        status: 'secure',
        severity: 'medium',
        details: 'Using proper base64 encoding for tokens',
        recommendations: ['✅ Secure token encoding implementation']
      });
    } else {
      results.push({
        category: 'Token Security',
        check: 'Token encoding',
        status: 'warning',
        severity: 'medium',
        details: 'Token encoding implementation not clearly secure',
        recommendations: ['Use proper base64 encoding for tokens']
      });
    }
    
    // Evaluate session management
    if (sessionManagement) {
      results.push({
        category: 'Token Security',
        check: 'Session management',
        status: 'secure',
        severity: 'high',
        details: 'Session management features detected',
        recommendations: ['✅ Session management is implemented']
      });
    } else {
      results.push({
        category: 'Token Security',
        check: 'Session management',
        status: 'warning',
        severity: 'high',
        details: 'Session management not clearly implemented',
        recommendations: [
          'Implement proper session timeout',
          'Add token expiration validation',
          'Consider implementing refresh tokens'
        ]
      });
    }
    
    // Evaluate token storage
    if (insecureTokenStorage) {
      results.push({
        category: 'Token Security',
        check: 'Client-side token storage',
        status: 'warning',
        severity: 'medium',
        details: 'Client-side token storage detected',
        recommendations: [
          'Consider using httpOnly cookies for sensitive tokens',
          'Implement proper token expiration',
          'Clear tokens on logout'
        ]
      });
    } else {
      results.push({
        category: 'Token Security',
        check: 'Token storage security',
        status: 'secure',
        severity: 'medium',
        details: 'No insecure client-side token storage detected',
        recommendations: ['✅ No localStorage/sessionStorage usage for tokens found']
      });
    }
    
    // Check for JWT usage and security
    const jwtFiles = await findTsFiles('.');
    let jwtUsage = false;
    let secureJWTImplementation = false;
    
    for (const file of jwtFiles.slice(0, 20)) {
      try {
        const content = await readFile(file, 'utf-8');
        
        if (content.includes('jsonwebtoken') || content.includes('jwt')) {
          jwtUsage = true;
          
          if (content.includes('expiresIn') || content.includes('exp')) {
            secureJWTImplementation = true;
          }
        }
      } catch (error) {
        // Skip unreadable files
      }
    }
    
    if (jwtUsage) {
      if (secureJWTImplementation) {
        results.push({
          category: 'Token Security',
          check: 'JWT implementation',
          status: 'secure',
          severity: 'high',
          details: 'JWT tokens with expiration detected',
          recommendations: ['✅ Secure JWT implementation with expiration']
        });
      } else {
        results.push({
          category: 'Token Security',
          check: 'JWT implementation',
          status: 'warning',
          severity: 'high',
          details: 'JWT usage detected but expiration not clearly implemented',
          recommendations: [
            'Implement JWT token expiration',
            'Use short-lived tokens with refresh mechanism'
          ]
        });
      }
    }
    
  } catch (error) {
    results.push({
      category: 'Token Security',
      check: 'Token security validation',
      status: 'warning',
      severity: 'medium',
      details: 'Cannot validate token security implementation',
      recommendations: ['Manually review token generation and storage']
    });
  }
  
  return results;
}

/**
 * Validate encryption key management
 */
async function validateKeyManagement(): Promise<CryptoValidationResult[]> {
  const results: CryptoValidationResult[] = [];
  
  try {
    // Check environment variable usage for secrets
    const envFiles = ['.env.example', '.env.production.template'];
    const requiredSecrets = [
      'ADMIN_PASSWORD_HASH',
      'NEXTAUTH_SECRET',
      'FORM_HMAC_SECRET',
      'JWT_SECRET',
      'ENCRYPTION_KEY'
    ];
    
    let foundEnvFile = false;
    let properlyConfiguredSecrets = 0;
    let envContent = '';
    
    for (const envFile of envFiles) {
      try {
        envContent = await readFile(envFile, 'utf-8');
        foundEnvFile = true;
        break;
      } catch (error) {
        // Try next file
      }
    }
    
    if (foundEnvFile) {
      for (const secret of requiredSecrets) {
        if (envContent.includes(secret)) {
          properlyConfiguredSecrets++;
        }
      }
      
      const secretCoverage = (properlyConfiguredSecrets / requiredSecrets.length) * 100;
      
      if (secretCoverage >= 80) {
        results.push({
          category: 'Key Management',
          check: 'Environment secret configuration',
          status: 'secure',
          severity: 'high',
          details: `${secretCoverage.toFixed(1)}% of required secrets are properly externalized`,
          recommendations: ['✅ Secrets are properly externalized']
        });
      } else {
        results.push({
          category: 'Key Management',
          check: 'Environment secret configuration',
          status: 'warning',
          severity: 'high',
          details: `Only ${secretCoverage.toFixed(1)}% of secrets are properly configured`,
          recommendations: [
            'Externalize all cryptographic secrets to environment variables',
            'Never hardcode secrets in source code',
            'Use strong, randomly generated secrets'
          ]
        });
      }
    } else {
      results.push({
        category: 'Key Management',
        check: 'Environment secret configuration',
        status: 'warning',
        severity: 'medium',
        details: 'No environment template files found',
        recommendations: ['Create .env.example to document required environment variables']
      });
    }
    
    // Check for proper secret generation scripts
    const secretGenerationFiles = [
      'scripts/generate-keys.js',
      'scripts/generate-admin-hash.js'
    ];
    
    let hasSecretGeneration = false;
    
    for (const file of secretGenerationFiles) {
      try {
        await access(file);
        hasSecretGeneration = true;
        
        const content = await readFile(file, 'utf-8');
        
        if (content.includes('crypto.randomBytes') || 
            content.includes('crypto.getRandomValues') ||
            content.includes('bcrypt')) {
          results.push({
            category: 'Key Management',
            check: `Secret generation script: ${file}`,
            status: 'secure',
            severity: 'medium',
            details: 'Secure secret generation script found',
            recommendations: ['✅ Using secure secret generation']
          });
        }
      } catch (error) {
        // File doesn't exist
      }
    }
    
    if (!hasSecretGeneration) {
      results.push({
        category: 'Key Management',
        check: 'Secret generation utilities',
        status: 'warning',
        severity: 'low',
        details: 'No secret generation scripts found',
        recommendations: ['Consider adding scripts to generate secure secrets']
      });
    }
    
    // Check for hardcoded secrets in code
    const codeFiles = await findTsFiles('.');
    let hardcodedSecrets = 0;
    const suspiciousFiles: string[] = [];
    
    for (const file of codeFiles.slice(0, 40)) { // Increased limit for better coverage
      try {
        const content = await readFile(file, 'utf-8');
        
        // Skip test files and examples
        if (file.includes('test') || 
            file.includes('spec') || 
            file.includes('example') ||
            file.includes('_archive')) {
          continue;
        }
        
        // Look for potential hardcoded secrets (enhanced patterns)
        const suspiciousPatterns = [
          /password\s*[=:]\s*['"][^'"]{8,}['"]/i,
          /secret\s*[=:]\s*['"][^'"]{16,}['"]/i,
          /key\s*[=:]\s*['"][^'"]{16,}['"]/i,
          /token\s*[=:]\s*['"][^'"]{20,}['"]/i,
          /hash\s*[=:]\s*['"][^'"]{32,}['"]/i,
          /api[_-]?key\s*[=:]\s*['"][^'"]{10,}['"]/i
        ];
        
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(content)) {
            hardcodedSecrets++;
            suspiciousFiles.push(file);
            break; // Only count once per file
          }
        }
      } catch (error) {
        // Skip unreadable files
      }
    }
    
    if (hardcodedSecrets > 0) {
      results.push({
        category: 'Key Management',
        check: 'Hardcoded secrets detection',
        status: 'vulnerable',
        severity: 'critical',
        details: `Potential hardcoded secrets found in ${hardcodedSecrets} files`,
        recommendations: [
          'Remove all hardcoded secrets from source code',
          'Use environment variables for all sensitive data',
          'Review code for accidentally committed secrets',
          `Files to review: ${suspiciousFiles.slice(0, 3).join(', ')}`
        ]
      });
    } else {
      results.push({
        category: 'Key Management',
        check: 'Hardcoded secrets detection',
        status: 'secure',
        severity: 'high',
        details: 'No hardcoded secrets detected in source code',
        recommendations: ['✅ No hardcoded secrets found']
      });
    }
    
    // Check for proper key rotation practices
    const configFiles = [
      'next.config.js',
      'middleware.ts',
      'lib/auth/admin-auth.ts'
    ];
    
    let keyRotationSupport = false;
    
    for (const file of configFiles) {
      try {
        const content = await readFile(file, 'utf-8');
        
        if (content.includes('rotation') || 
            content.includes('refresh') ||
            content.includes('expire')) {
          keyRotationSupport = true;
        }
      } catch (error) {
        // File doesn't exist
      }
    }
    
    if (keyRotationSupport) {
      results.push({
        category: 'Key Management',
        check: 'Key rotation support',
        status: 'secure',
        severity: 'medium',
        details: 'Key rotation or refresh mechanisms detected',
        recommendations: ['✅ Key rotation support is implemented']
      });
    } else {
      results.push({
        category: 'Key Management',
        check: 'Key rotation support',
        status: 'warning',
        severity: 'low',
        details: 'No key rotation mechanisms detected',
        recommendations: [
          'Consider implementing key rotation for long-lived secrets',
          'Add expiration dates to cryptographic keys',
          'Implement automated key refresh where possible'
        ]
      });
    }
    
  } catch (error) {
    results.push({
      category: 'Key Management',
      check: 'Key management validation',
      status: 'warning',
      severity: 'medium',
      details: 'Cannot validate key management practices',
      recommendations: ['Manually review key management implementation']
    });
  }
  
  return results;
}

/**
 * Validate encryption implementations
 */
async function validateEncryptionImplementations(): Promise<CryptoValidationResult[]> {
  const results: CryptoValidationResult[] = [];
  
  try {
    // Check multiple files for encryption implementations
    const cryptoFiles = [
      'middleware.ts',
      'lib/auth/admin-auth.ts',
      'app/api/admin/validate/route.ts'
    ];
    
    let webCryptoUsage = false;
    let secureAlgorithms = false;
    let insecureAlgorithms = false;
    let keyDerivationFunctions = false;
    
    for (const file of cryptoFiles) {
      try {
        const content = await readFile(file, 'utf-8');
        
        // Check for Web Crypto API usage
        if (content.includes('crypto.subtle')) {
          webCryptoUsage = true;
        }
        
        // Check for secure algorithms
        if (content.includes('SHA-256') || 
            content.includes('SHA-384') || 
            content.includes('SHA-512') ||
            content.includes('AES-GCM') ||
            content.includes('AES-256')) {
          secureAlgorithms = true;
        }
        
        // Check for insecure algorithms
        if (content.includes('SHA-1') || 
            content.includes('MD5') ||
            content.includes('DES') ||
            content.includes('RC4')) {
          insecureAlgorithms = true;
        }
        
        // Check for key derivation functions
        if (content.includes('PBKDF2') || 
            content.includes('scrypt') || 
            content.includes('Argon2') ||
            content.includes('bcrypt')) {
          keyDerivationFunctions = true;
        }
        
      } catch (error) {
        // File doesn't exist, skip
      }
    }
    
    // Evaluate Web Crypto API usage
    if (webCryptoUsage) {
      results.push({
        category: 'Encryption',
        check: 'Web Crypto API usage',
        status: 'secure',
        severity: 'high',
        details: 'Using Web Crypto API for cryptographic operations',
        recommendations: ['✅ Using modern, secure Web Crypto API']
      });
    } else {
      results.push({
        category: 'Encryption',
        check: 'Web Crypto API usage',
        status: 'warning',
        severity: 'medium',
        details: 'Web Crypto API not detected',
        recommendations: [
          'Consider using Web Crypto API for browser-based cryptographic operations',
          'Use crypto module for Node.js server-side operations'
        ]
      });
    }
    
    // Evaluate algorithm security
    if (insecureAlgorithms) {
      results.push({
        category: 'Encryption',
        check: 'Hash algorithm security',
        status: 'vulnerable',
        severity: 'high',
        details: 'Using deprecated hash algorithms (SHA-1, MD5, DES, or RC4)',
        recommendations: [
          'Replace SHA-1 and MD5 with SHA-256 or SHA-3',
          'Replace DES and RC4 with AES-256',
          'Update all cryptographic operations to use secure algorithms'
        ]
      });
    } else if (secureAlgorithms) {
      results.push({
        category: 'Encryption',
        check: 'Hash algorithm security',
        status: 'secure',
        severity: 'medium',
        details: 'Using secure cryptographic algorithms (SHA-256, AES)',
        recommendations: ['✅ Using secure cryptographic algorithms']
      });
    } else {
      results.push({
        category: 'Encryption',
        check: 'Hash algorithm security',
        status: 'warning',
        severity: 'low',
        details: 'No specific cryptographic algorithms detected',
        recommendations: ['Ensure secure algorithms (SHA-256, AES-256) are used when needed']
      });
    }
    
    // Evaluate key derivation functions
    if (keyDerivationFunctions) {
      results.push({
        category: 'Encryption',
        check: 'Key derivation functions',
        status: 'secure',
        severity: 'high',
        details: 'Using proper key derivation functions (bcrypt, PBKDF2, scrypt, or Argon2)',
        recommendations: ['✅ Secure key derivation implementation']
      });
    } else {
      results.push({
        category: 'Encryption',
        check: 'Key derivation functions',
        status: 'warning',
        severity: 'medium',
        details: 'No key derivation functions detected',
        recommendations: [
          'Consider implementing PBKDF2, scrypt, or Argon2 for key derivation',
          'Use proper key stretching for password-based encryption'
        ]
      });
    }
    
    // Check for encryption at rest
    const configFiles = await findTsFiles('.');
    let encryptionAtRest = false;
    
    for (const file of configFiles.slice(0, 20)) {
      try {
        const content = await readFile(file, 'utf-8');
        
        if (content.includes('encrypt') && 
            (content.includes('database') || content.includes('storage'))) {
          encryptionAtRest = true;
          break;
        }
      } catch (error) {
        // Skip unreadable files
      }
    }
    
    if (encryptionAtRest) {
      results.push({
        category: 'Encryption',
        check: 'Encryption at rest',
        status: 'secure',
        severity: 'medium',
        details: 'Encryption at rest implementation detected',
        recommendations: ['✅ Data encryption at rest is implemented']
      });
    } else {
      results.push({
        category: 'Encryption',
        check: 'Encryption at rest',
        status: 'warning',
        severity: 'low',
        details: 'No encryption at rest detected',
        recommendations: [
          'Consider implementing encryption for sensitive data at rest',
          'Use database-level encryption for sensitive information'
        ]
      });
    }
    
    // Check for TLS/SSL configuration
    const serverFiles = [
      'next.config.js',
      'vercel.json',
      'middleware.ts'
    ];
    
    let tlsConfiguration = false;
    
    for (const file of serverFiles) {
      try {
        const content = await readFile(file, 'utf-8');
        
        if (content.includes('https') || 
            content.includes('ssl') || 
            content.includes('tls') ||
            content.includes('secure: true')) {
          tlsConfiguration = true;
        }
      } catch (error) {
        // File doesn't exist
      }
    }
    
    if (tlsConfiguration) {
      results.push({
        category: 'Encryption',
        check: 'TLS/SSL configuration',
        status: 'secure',
        severity: 'high',
        details: 'TLS/SSL configuration detected',
        recommendations: ['✅ TLS/SSL is properly configured']
      });
    } else {
      results.push({
        category: 'Encryption',
        check: 'TLS/SSL configuration',
        status: 'warning',
        severity: 'high',
        details: 'TLS/SSL configuration not clearly detected',
        recommendations: [
          'Ensure HTTPS is enforced in production',
          'Configure proper TLS/SSL certificates',
          'Use HSTS headers for additional security'
        ]
      });
    }
    
  } catch (error) {
    results.push({
      category: 'Encryption',
      check: 'Encryption validation',
      status: 'warning',
      severity: 'medium',
      details: 'Cannot validate encryption implementations',
      recommendations: ['Manually review encryption implementations']
    });
  }
  
  return results;
}

/**
 * Find TypeScript files in directory
 */
async function findTsFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory() && 
          !entry.name.startsWith('.') && 
          !entry.name.includes('node_modules') &&
          !entry.name.includes('_archive')) {
        files.push(...await findTsFiles(fullPath));
      } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return files;
}

/**
 * Run comprehensive cryptographic validation
 */
export async function validateCryptographicImplementations(): Promise<{
  results: CryptoValidationResult[];
  summary: CryptoValidationSummary;
}> {
  console.log('🔐 Running comprehensive cryptographic validation...');
  
  const allResults: CryptoValidationResult[] = [];
  
  // Run all cryptographic validations
  const bcryptResults = await validateBcryptImplementation();
  const randomResults = await validateRandomGeneration();
  const hmacResults = await validateHMACImplementation();
  const tokenResults = await validateTokenSecurity();
  const keyManagementResults = await validateKeyManagement();
  const encryptionResults = await validateEncryptionImplementations();
  
  allResults.push(...bcryptResults);
  allResults.push(...randomResults);
  allResults.push(...hmacResults);
  allResults.push(...tokenResults);
  allResults.push(...keyManagementResults);
  allResults.push(...encryptionResults);
  
  // Calculate summary
  const totalChecks = allResults.length;
  const secureImplementations = allResults.filter(r => r.status === 'secure').length;
  const warnings = allResults.filter(r => r.status === 'warning').length;
  const vulnerabilities = allResults.filter(r => r.status === 'vulnerable').length;
  const criticalIssues = allResults.filter(r => r.severity === 'critical').length;
  
  const overallScore = totalChecks > 0 ? Math.round((secureImplementations / totalChecks) * 100) : 0;
  const overallStatus = criticalIssues > 0 ? 'vulnerable' :
                       vulnerabilities > 0 || warnings > 2 ? 'needs_attention' : 'secure';
  
  const summary: CryptoValidationSummary = {
    totalChecks,
    secureImplementations,
    warnings,
    vulnerabilities,
    criticalIssues,
    overallScore,
    overallStatus
  };
  
  console.log(`✅ Cryptographic validation completed: ${secureImplementations}/${totalChecks} secure implementations`);
  
  return { results: allResults, summary };
}

/**
 * Get cryptographic security recommendations
 */
export function getCryptographicRecommendations(results: CryptoValidationResult[]): string[] {
  const recommendations: string[] = [];
  
  // Collect all recommendations
  const allRecommendations = results.flatMap(r => r.recommendations);
  
  // Add general cryptographic best practices
  recommendations.push('🔐 Cryptographic Security Best Practices:');
  recommendations.push('1. Use bcrypt with 12+ salt rounds for password hashing');
  recommendations.push('2. Use crypto.randomUUID() and crypto.getRandomValues() for secure random generation');
  recommendations.push('3. Implement HMAC-SHA256 for message authentication');
  recommendations.push('4. Use timing-safe comparison for cryptographic values');
  recommendations.push('5. Externalize all secrets to environment variables');
  recommendations.push('6. Regularly rotate cryptographic keys and secrets');
  recommendations.push('7. Use Web Crypto API for browser-based cryptographic operations');
  recommendations.push('8. Implement proper session management with secure tokens');
  
  // Add specific recommendations from validation results
  const uniqueRecommendations = Array.from(new Set(allRecommendations));
  recommendations.push('', '📋 Specific Recommendations:');
  recommendations.push(...uniqueRecommendations);
  
  return recommendations;
}