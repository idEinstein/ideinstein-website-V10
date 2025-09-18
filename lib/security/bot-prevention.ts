/**
 * Advanced Bot Prevention System
 * Multi-layer protection without user friction
 */

interface BotSignature {
  userAgent: string;
  behaviorPattern: string;
  requestTiming: number[];
  headerFingerprint: string;
}

interface HoneypotResult {
  triggered: boolean;
  suspiciousFields: string[];
}

class AdvancedBotPrevention {
  private suspiciousIPs = new Map<string, number>();
  private behaviorSignatures = new Map<string, BotSignature>();
  
  /**
   * Check if honeypot fields were filled (indicates bot)
   */
  isHoneypotTriggered(formData: any): HoneypotResult {
    const honeypotFields = ['website', 'url', 'address', 'phone2', 'company_url', 'website_url'];
    const suspiciousFields: string[] = [];
    
    for (const field of honeypotFields) {
      if (formData[field] && formData[field].trim() !== '') {
        suspiciousFields.push(field);
      }
    }
    
    return {
      triggered: suspiciousFields.length > 0,
      suspiciousFields
    };
  }
  
  /**
   * Analyze form submission timing patterns
   */
  analyzeSubmissionTiming(submissionTime: number, formDisplayTime: number): {
    isHuman: boolean;
    reason: string;
  } {
    const fillTime = submissionTime - formDisplayTime;
    
    // Too fast (likely bot)
    if (fillTime < 3000) {
      return { isHuman: false, reason: 'form_filled_too_quickly' };
    }
    
    // Too slow (might be abandoned and auto-filled)
    if (fillTime > 30 * 60 * 1000) { // 30 minutes
      return { isHuman: false, reason: 'form_filled_too_slowly' };
    }
    
    // Suspiciously exact timing patterns (bots often have consistent timing)
    if (fillTime % 1000 === 0) {
      return { isHuman: false, reason: 'suspicious_timing_pattern' };
    }
    
    return { isHuman: true, reason: 'normal_timing' };
  }
  
  /**
   * Generate browser fingerprint from headers
   */
  generateHeaderFingerprint(headers: Headers): string {
    const relevantHeaders = [
      'user-agent',
      'accept',
      'accept-language',
      'accept-encoding',
      'sec-fetch-site',
      'sec-fetch-mode',
      'sec-fetch-dest',
      'sec-ch-ua',
      'sec-ch-ua-platform'
    ];
    
    const fingerprint = relevantHeaders
      .map(header => `${header}:${headers.get(header) || ''}`)
      .join('|');
      
    return Buffer.from(fingerprint).toString('base64');
  }
  
  /**
   * Check for common bot patterns in user agent
   */
  isSuspiciousUserAgent(userAgent: string): {
    isSuspicious: boolean;
    reason: string;
  } {
    if (!userAgent) {
      return { isSuspicious: true, reason: 'missing_user_agent' };
    }
    
    // Common bot signatures
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /curl/i, /wget/i, /python/i, /postman/i,
      /axios/i, /fetch/i, /okhttp/i, /apache/i,
      /libwww/i, /winhttp/i
    ];
    
    for (const pattern of botPatterns) {
      if (pattern.test(userAgent)) {
        return { isSuspicious: true, reason: `bot_pattern_matched: ${pattern.source}` };
      }
    }
    
    // Check for missing standard browser components
    if (!userAgent.includes('Mozilla') && !userAgent.includes('Chrome') && !userAgent.includes('Safari')) {
      return { isSuspicious: true, reason: 'non_standard_browser' };
    }
    
    return { isSuspicious: false, reason: 'normal_user_agent' };
  }
  
  /**
   * Analyze request headers for bot indicators
   */
  analyzeRequestHeaders(headers: Headers): {
    risk: 'low' | 'medium' | 'high';
    indicators: string[];
  } {
    const indicators: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    
    // Check for missing standard headers
    const standardHeaders = ['accept', 'accept-language', 'accept-encoding'];
    const missingHeaders = standardHeaders.filter(header => !headers.get(header));
    
    if (missingHeaders.length > 0) {
      indicators.push(`missing_headers: ${missingHeaders.join(', ')}`);
      riskLevel = 'medium';
    }
    
    // Check for suspicious referer
    const referer = headers.get('referer');
    if (referer && !referer.includes(process.env.NEXT_PUBLIC_BASE_URL || 'localhost')) {
      indicators.push('external_referer');
      riskLevel = 'medium';
    }
    
    // Check for automated tools signatures
    const userAgent = headers.get('user-agent') || '';
    const automatedSignatures = ['headless', 'phantom', 'selenium', 'webdriver'];
    for (const signature of automatedSignatures) {
      if (userAgent.toLowerCase().includes(signature)) {
        indicators.push(`automated_tool: ${signature}`);
        riskLevel = 'high';
      }
    }
    
    return { risk: riskLevel, indicators };
  }
  
  /**
   * Comprehensive bot detection analysis
   */
  analyzeRequest(request: Request, formData?: any): {
    isBot: boolean;
    confidence: number; // 0-100
    reasons: string[];
    recommendation: 'allow' | 'challenge' | 'block';
  } {
    const reasons: string[] = [];
    let botScore = 0; // Higher score = more likely to be a bot
    
    // User Agent Analysis
    const userAgent = request.headers.get('user-agent') || '';
    const uaAnalysis = this.isSuspiciousUserAgent(userAgent);
    if (uaAnalysis.isSuspicious) {
      botScore += 40;
      reasons.push(uaAnalysis.reason);
    }
    
    // Header Analysis
    const headerAnalysis = this.analyzeRequestHeaders(request.headers);
    switch (headerAnalysis.risk) {
      case 'high':
        botScore += 30;
        break;
      case 'medium':
        botScore += 15;
        break;
    }
    reasons.push(...headerAnalysis.indicators);
    
    // Honeypot Analysis (if form data provided)
    if (formData) {
      const honeypotResult = this.isHoneypotTriggered(formData);
      if (honeypotResult.triggered) {
        botScore += 50; // High confidence bot indicator
        reasons.push(`honeypot_triggered: ${honeypotResult.suspiciousFields.join(', ')}`);
      }
    }
    
    // Determine recommendation
    let recommendation: 'allow' | 'challenge' | 'block' = 'allow';
    if (botScore >= 70) {
      recommendation = 'block';
    } else if (botScore >= 40) {
      recommendation = 'challenge';
    }
    
    return {
      isBot: botScore >= 50,
      confidence: Math.min(botScore, 100),
      reasons,
      recommendation
    };
  }
  
  /**
   * Log bot detection results for monitoring
   */
  logDetection(analysis: ReturnType<typeof this.analyzeRequest>, ip: string) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🤖 Bot Detection [${ip}]:`, {
        isBot: analysis.isBot,
        confidence: analysis.confidence,
        recommendation: analysis.recommendation,
        reasons: analysis.reasons
      });
    }
    
    // In production, send to monitoring service
    // This helps improve the detection algorithms over time
  }
}

export const botPrevention = new AdvancedBotPrevention();

/**
 * Honeypot form fields component
 * These should be included in all forms but hidden from users
 */
export function getHoneypotFields(): Record<string, string> {
  return {
    website: '', // Bots often fill this
    phone2: '', // Backup phone field
    address: '', // Address field bots might fill
    company_url: '', // Company website
    website_url: '', // Website URL
  };
}

/**
 * Validate that honeypot fields are empty (human user)
 */
export function validateHoneypot(formData: any): boolean {
  const honeypotFields = Object.keys(getHoneypotFields());
  
  for (const field of honeypotFields) {
    if (formData[field] && formData[field].trim() !== '') {
      return false; // Honeypot triggered = likely bot
    }
  }
  
  return true; // All honeypot fields empty = likely human
}