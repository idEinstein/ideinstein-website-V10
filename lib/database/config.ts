interface DatabaseConfig {
  connection: {
    url: string;
    ssl: {
      enabled: boolean;
      mode: string;
      cert?: string;
      key?: string;
      ca?: string;
    };
    pooling: {
      enabled: boolean;
      minConnections: number;
      maxConnections: number;
      idleTimeout: number;
      connectionTimeout: number;
    };
  };
  security: {
    encryption: {
      atRest: boolean;
      inTransit: boolean;
      keyRotation: boolean;
    };
    access: {
      readOnlyUsers: string[];
      adminUsers: string[];
      applicationUsers: string[];
    };
    audit: {
      enabled: boolean;
      logQueries: boolean;
      logConnections: boolean;
      retentionDays: number;
    };
  };
  backup: {
    enabled: boolean;
    frequency: string;
    retention: string;
    encryption: boolean;
    location: string;
    lastBackup?: string;
  };
  monitoring: {
    healthChecks: boolean;
    performanceMetrics: boolean;
    alerting: boolean;
    thresholds: {
      connectionCount: number;
      queryTime: number;
      diskUsage: number;
      cpuUsage: number;
    };
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Get current database configuration
 */
export async function getDatabaseConfig(): Promise<DatabaseConfig> {
  // In a real implementation, this would read from your configuration store
  // For now, we'll return a configuration based on environment variables
  
  const databaseUrl = process.env.DATABASE_URL || '';
  const isSSLEnabled = databaseUrl.includes('sslmode=require') || databaseUrl.includes('ssl=true');
  
  return {
    connection: {
      url: databaseUrl,
      ssl: {
        enabled: isSSLEnabled,
        mode: isSSLEnabled ? 'require' : 'prefer',
        cert: process.env.DATABASE_SSL_CERT,
        key: process.env.DATABASE_SSL_KEY,
        ca: process.env.DATABASE_SSL_CA
      },
      pooling: {
        enabled: true,
        minConnections: parseInt(process.env.DATABASE_MIN_CONNECTIONS || '2'),
        maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '20'),
        idleTimeout: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30'),
        connectionTimeout: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '10')
      }
    },
    security: {
      encryption: {
        atRest: process.env.DATABASE_ENCRYPTION_AT_REST === 'true',
        inTransit: isSSLEnabled,
        keyRotation: process.env.DATABASE_KEY_ROTATION === 'true'
      },
      access: {
        readOnlyUsers: (process.env.DATABASE_READONLY_USERS || '').split(',').filter(Boolean),
        adminUsers: (process.env.DATABASE_ADMIN_USERS || 'postgres,admin').split(',').filter(Boolean),
        applicationUsers: (process.env.DATABASE_APP_USERS || 'app_user').split(',').filter(Boolean)
      },
      audit: {
        enabled: process.env.DATABASE_AUDIT_ENABLED === 'true',
        logQueries: process.env.DATABASE_LOG_QUERIES === 'true',
        logConnections: process.env.DATABASE_LOG_CONNECTIONS === 'true',
        retentionDays: parseInt(process.env.DATABASE_AUDIT_RETENTION_DAYS || '90')
      }
    },
    backup: {
      enabled: process.env.DATABASE_BACKUP_ENABLED === 'true',
      frequency: process.env.DATABASE_BACKUP_FREQUENCY || 'daily',
      retention: process.env.DATABASE_BACKUP_RETENTION || '30 days',
      encryption: process.env.DATABASE_BACKUP_ENCRYPTION === 'true',
      location: process.env.DATABASE_BACKUP_LOCATION || 's3://backups/database',
      lastBackup: process.env.DATABASE_LAST_BACKUP
    },
    monitoring: {
      healthChecks: process.env.DATABASE_HEALTH_CHECKS !== 'false',
      performanceMetrics: process.env.DATABASE_PERFORMANCE_METRICS !== 'false',
      alerting: process.env.DATABASE_ALERTING === 'true',
      thresholds: {
        connectionCount: parseInt(process.env.DATABASE_ALERT_CONNECTION_COUNT || '18'),
        queryTime: parseInt(process.env.DATABASE_ALERT_QUERY_TIME || '1000'),
        diskUsage: parseInt(process.env.DATABASE_ALERT_DISK_USAGE || '80'),
        cpuUsage: parseInt(process.env.DATABASE_ALERT_CPU_USAGE || '80')
      }
    }
  };
}

/**
 * Update database configuration
 */
export async function updateDatabaseConfig(updates: Partial<DatabaseConfig>): Promise<void> {
  // In a real implementation, this would:
  // 1. Validate the updates
  // 2. Update the configuration in your config store
  // 3. Apply changes to the database connection
  // 4. Restart services if necessary
  
  console.log('Database configuration update requested:', updates);
  
  // For now, we'll just log the update
  // In production, you'd want to:
  // - Update environment variables in your deployment platform
  // - Restart the application if connection settings changed
  // - Update database server configuration if needed
}

/**
 * Validate database configuration
 */
export function validateDatabaseConfig(config: Partial<DatabaseConfig>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate connection settings
  if (config.connection) {
    if (config.connection.url && !isValidDatabaseUrl(config.connection.url)) {
      errors.push('Invalid database URL format');
    }
    
    if (config.connection.pooling) {
      const { minConnections, maxConnections } = config.connection.pooling;
      if (minConnections >= maxConnections) {
        errors.push('Minimum connections must be less than maximum connections');
      }
      if (maxConnections > 100) {
        warnings.push('Very high maximum connection count may impact performance');
      }
    }
    
    if (config.connection.ssl && !config.connection.ssl.enabled) {
      warnings.push('SSL is disabled - consider enabling for production environments');
    }
  }
  
  // Validate security settings
  if (config.security) {
    if (config.security.encryption && !config.security.encryption.inTransit) {
      warnings.push('Encryption in transit is disabled - this may expose sensitive data');
    }
    
    if (config.security.access) {
      const { adminUsers, applicationUsers } = config.security.access;
      if (adminUsers && adminUsers.length === 0) {
        errors.push('At least one admin user must be configured');
      }
      if (applicationUsers && applicationUsers.length === 0) {
        warnings.push('No application users configured - consider creating dedicated app users');
      }
    }
  }
  
  // Validate backup settings
  if (config.backup) {
    if (config.backup.enabled && !config.backup.location) {
      errors.push('Backup location must be specified when backups are enabled');
    }
    
    if (config.backup.enabled && !config.backup.encryption) {
      warnings.push('Backup encryption is disabled - consider enabling for sensitive data');
    }
  }
  
  // Validate monitoring settings
  if (config.monitoring?.thresholds) {
    const { connectionCount, queryTime, diskUsage, cpuUsage } = config.monitoring.thresholds;
    
    if (connectionCount <= 0) {
      errors.push('Connection count threshold must be positive');
    }
    if (queryTime <= 0) {
      errors.push('Query time threshold must be positive');
    }
    if (diskUsage <= 0 || diskUsage > 100) {
      errors.push('Disk usage threshold must be between 1 and 100');
    }
    if (cpuUsage <= 0 || cpuUsage > 100) {
      errors.push('CPU usage threshold must be between 1 and 100');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generate secure database configuration for production
 */
export function generateSecureDatabaseConfig(databaseUrl: string): DatabaseConfig {
  return {
    connection: {
      url: ensureSSLInUrl(databaseUrl),
      ssl: {
        enabled: true,
        mode: 'require'
      },
      pooling: {
        enabled: true,
        minConnections: 2,
        maxConnections: 20,
        idleTimeout: 30,
        connectionTimeout: 10
      }
    },
    security: {
      encryption: {
        atRest: true,
        inTransit: true,
        keyRotation: true
      },
      access: {
        readOnlyUsers: ['readonly_user'],
        adminUsers: ['admin'],
        applicationUsers: ['app_user']
      },
      audit: {
        enabled: true,
        logQueries: true,
        logConnections: true,
        retentionDays: 90
      }
    },
    backup: {
      enabled: true,
      frequency: 'daily',
      retention: '30 days',
      encryption: true,
      location: 's3://your-backup-bucket/database'
    },
    monitoring: {
      healthChecks: true,
      performanceMetrics: true,
      alerting: true,
      thresholds: {
        connectionCount: 18,
        queryTime: 1000,
        diskUsage: 80,
        cpuUsage: 80
      }
    }
  };
}

/**
 * Generate environment variables from database configuration
 */
export function generateEnvironmentVariables(config: DatabaseConfig): Record<string, string> {
  return {
    DATABASE_URL: config.connection.url,
    DATABASE_SSL_MODE: config.connection.ssl.mode,
    DATABASE_MIN_CONNECTIONS: config.connection.pooling.minConnections.toString(),
    DATABASE_MAX_CONNECTIONS: config.connection.pooling.maxConnections.toString(),
    DATABASE_IDLE_TIMEOUT: config.connection.pooling.idleTimeout.toString(),
    DATABASE_CONNECTION_TIMEOUT: config.connection.pooling.connectionTimeout.toString(),
    DATABASE_ENCRYPTION_AT_REST: config.security.encryption.atRest.toString(),
    DATABASE_KEY_ROTATION: config.security.encryption.keyRotation.toString(),
    DATABASE_AUDIT_ENABLED: config.security.audit.enabled.toString(),
    DATABASE_LOG_QUERIES: config.security.audit.logQueries.toString(),
    DATABASE_LOG_CONNECTIONS: config.security.audit.logConnections.toString(),
    DATABASE_AUDIT_RETENTION_DAYS: config.security.audit.retentionDays.toString(),
    DATABASE_BACKUP_ENABLED: config.backup.enabled.toString(),
    DATABASE_BACKUP_FREQUENCY: config.backup.frequency,
    DATABASE_BACKUP_RETENTION: config.backup.retention,
    DATABASE_BACKUP_ENCRYPTION: config.backup.encryption.toString(),
    DATABASE_BACKUP_LOCATION: config.backup.location,
    DATABASE_HEALTH_CHECKS: config.monitoring.healthChecks.toString(),
    DATABASE_PERFORMANCE_METRICS: config.monitoring.performanceMetrics.toString(),
    DATABASE_ALERTING: config.monitoring.alerting.toString(),
    DATABASE_ALERT_CONNECTION_COUNT: config.monitoring.thresholds.connectionCount.toString(),
    DATABASE_ALERT_QUERY_TIME: config.monitoring.thresholds.queryTime.toString(),
    DATABASE_ALERT_DISK_USAGE: config.monitoring.thresholds.diskUsage.toString(),
    DATABASE_ALERT_CPU_USAGE: config.monitoring.thresholds.cpuUsage.toString()
  };
}

// Helper functions
function isValidDatabaseUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['postgres:', 'postgresql:', 'mysql:', 'mongodb:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function ensureSSLInUrl(url: string): string {
  if (url.includes('sslmode=') || url.includes('ssl=')) {
    return url;
  }
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}sslmode=require`;
}