interface RateLimitEntry {
  ip: string;
  count: number;
  resetTime: number;
  violations: number;
  lastViolation?: number;
}

interface RateLimitViolation {
  ip: string;
  timestamp: number;
  endpoint: string;
  userAgent?: string;
  limit: number;
  attempts: number;
}

interface RateLimitStats {
  totalRequests: number;
  uniqueIPs: number;
  violations: number;
  topIPs: Array<{ ip: string; requests: number; violations: number }>;
  endpointStats: Array<{ endpoint: string; requests: number; violations: number }>;
  timeframe: string;
  lastUpdated: string;
}

// In-memory storage for monitoring data - persist across module reloads
declare global {
  // eslint-disable-next-line no-var
  var __rateLimitMonitorData: {
    rateLimitData: Map<string, RateLimitEntry>;
    violationHistory: RateLimitViolation[];
  } | undefined;
}

// Initialize or retrieve persistent data
if (!globalThis.__rateLimitMonitorData) {
  globalThis.__rateLimitMonitorData = {
    rateLimitData: new Map<string, RateLimitEntry>(),
    violationHistory: []
  };
  console.log(`🔄 MONITOR MODULE: First initialization at ${new Date().toISOString()}`);
} else {
  console.log(`🔄 MONITOR MODULE: Reinitialized at ${new Date().toISOString()}, Existing violations: ${globalThis.__rateLimitMonitorData.violationHistory.length}`);
}

const rateLimitData = globalThis.__rateLimitMonitorData.rateLimitData;
const violationHistory = globalThis.__rateLimitMonitorData.violationHistory;

export function recordRateLimitAttempt(
  ip: string, 
  endpoint: string, 
  isViolation: boolean = false,
  userAgent?: string,
  limit?: number,
  attempts?: number
) {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  
  // Debug logging
  console.log(`📊 MONITOR: Recording attempt - IP: ${ip}, Endpoint: ${endpoint}, Violation: ${isViolation}`);
  
  // Update rate limit entry
  const entry = rateLimitData.get(key) || {
    ip,
    count: 0,
    resetTime: now + (60 * 1000), // 1 minute from now
    violations: 0
  };
  
  entry.count++;
  
  if (isViolation) {
    entry.violations++;
    entry.lastViolation = now;
    
    // Record violation in history
    const violation = {
      ip,
      timestamp: now,
      endpoint,
      userAgent,
      limit: limit || 60,
      attempts: attempts || entry.count
    };
    
    violationHistory.push(violation);
    
    console.log(`🚨 MONITOR: Violation recorded! Total violations: ${violationHistory.length}`, violation);
    console.log(`🕐 MONITOR: Current time: ${now}, Violation time: ${new Date(now).toISOString()}`);
    
    // Keep only last 1000 violations
    if (violationHistory.length > 1000) {
      violationHistory.splice(0, violationHistory.length - 1000);
    }
  }
  
  rateLimitData.set(key, entry);
  
  // Clean up expired entries
  cleanupExpiredEntries();
}

function cleanupExpiredEntries() {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  rateLimitData.forEach((entry, key) => {
    if (entry.resetTime < now) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => {
    rateLimitData.delete(key);
  });
}

export async function getRateLimitStats(timeframe: string = '1h'): Promise<RateLimitStats> {
  const now = Date.now();
  const timeframeMs = parseTimeframe(timeframe);
  const cutoff = now - timeframeMs;
  
  cleanupExpiredEntries();
  
  // Calculate stats
  const entries = Array.from(rateLimitData.values());
  const recentViolations = violationHistory.filter(v => v.timestamp > cutoff);
  
  const totalRequests = entries.reduce((sum, entry) => sum + entry.count, 0);
  const uniqueIPs = new Set(entries.map(entry => entry.ip)).size;
  const violations = recentViolations.length;
  
  // Top IPs by request count
  const ipStats = new Map<string, { requests: number; violations: number }>();
  entries.forEach(entry => {
    const existing = ipStats.get(entry.ip) || { requests: 0, violations: 0 };
    existing.requests += entry.count;
    existing.violations += entry.violations;
    ipStats.set(entry.ip, existing);
  });
  
  const topIPs: Array<{ ip: string; requests: number; violations: number }> = [];
  ipStats.forEach((stats, ip) => {
    topIPs.push({ ip, ...stats });
  });
  topIPs.sort((a, b) => b.requests - a.requests);
  const topIPsSliced = topIPs.slice(0, 10);
  
  // Endpoint stats
  const endpointStats = new Map<string, { requests: number; violations: number }>();
  recentViolations.forEach(violation => {
    const existing = endpointStats.get(violation.endpoint) || { requests: 0, violations: 0 };
    existing.violations++;
    endpointStats.set(violation.endpoint, existing);
  });
  
  // Add request counts from rate limit data
  rateLimitData.forEach((entry, key) => {
    const endpoint = key.split(':')[1] || '/';
    const existing = endpointStats.get(endpoint) || { requests: 0, violations: 0 };
    existing.requests += entry.count;
    endpointStats.set(endpoint, existing);
  });
  
  const endpointStatsArray: Array<{ endpoint: string; requests: number; violations: number }> = [];
  endpointStats.forEach((stats, endpoint) => {
    endpointStatsArray.push({ endpoint, ...stats });
  });
  endpointStatsArray.sort((a, b) => b.requests - a.requests);
  
  return {
    totalRequests,
    uniqueIPs,
    violations,
    topIPs: topIPsSliced,
    endpointStats: endpointStatsArray,
    timeframe,
    lastUpdated: new Date().toISOString()
  };
}

export async function getRateLimitViolations(timeframe: string = '1h'): Promise<RateLimitViolation[]> {
  const now = Date.now();
  const timeframeMs = parseTimeframe(timeframe);
  const cutoff = now - timeframeMs;
  
  console.log(`🔍 VIOLATIONS: Now: ${now}, Cutoff: ${cutoff}, Timeframe: ${timeframe} (${timeframeMs}ms)`);
  console.log(`🔍 VIOLATIONS: Total violations in history: ${violationHistory.length}`);
  
  violationHistory.forEach((v, i) => {
    console.log(`  ${i}: timestamp=${v.timestamp}, time=${new Date(v.timestamp).toISOString()}, inRange=${v.timestamp > cutoff}`);
  });
  
  const filtered = violationHistory.filter(violation => violation.timestamp > cutoff);
  console.log(`🔍 VIOLATIONS: Filtered violations: ${filtered.length}`);
  
  return filtered.sort((a, b) => b.timestamp - a.timestamp);
}

export async function clearRateLimitData(target: string = 'violations') {
  switch (target) {
    case 'violations':
      violationHistory.length = 0;
      break;
    case 'stats':
      rateLimitData.clear();
      break;
    case 'all':
      rateLimitData.clear();
      violationHistory.length = 0;
      break;
    default:
      throw new Error(`Invalid target: ${target}`);
  }
}

function parseTimeframe(timeframe: string): number {
  const match = timeframe.match(/^(\d+)([hmsd])$/);
  if (!match) {
    return 60 * 60 * 1000; // Default to 1 hour
  }
  
  const [, amount, unit] = match;
  const value = parseInt(amount, 10);
  
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 60 * 60 * 1000;
  }
}

export function getRateLimitAlert(ip: string, endpoint: string): string | null {
  const key = `${ip}:${endpoint}`;
  const entry = rateLimitData.get(key);
  
  if (!entry) return null;
  
  if (entry.violations > 5) {
    return `HIGH: IP ${ip} has ${entry.violations} violations on ${endpoint}`;
  } else if (entry.violations > 2) {
    return `MEDIUM: IP ${ip} has ${entry.violations} violations on ${endpoint}`;
  }
  
  return null;
}
