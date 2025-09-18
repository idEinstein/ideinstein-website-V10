/**
 * Vercel API Integration
 * Provides automated project setup and environment synchronization
 */

export interface VercelApiConfig {
  token: string;
  teamId?: string;
}

export interface VercelProject {
  id: string;
  name: string;
  framework: string;
  createdAt: number;
  updatedAt: number;
  link?: {
    type: string;
    repo: string;
    repoId: number;
    org?: string;
  };
  targets?: {
    production?: {
      id: string;
      domain: string;
      url: string;
    };
  };
}

export interface VercelEnvironmentVariableResponse {
  id: string;
  key: string;
  value: string;
  target: string[];
  gitBranch?: string;
  type: string;
  createdAt: number;
  updatedAt: number;
}

export interface VercelDeployment {
  id: string;
  url: string;
  name: string;
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
  type: 'LAMBDAS';
  createdAt: number;
  buildingAt?: number;
  readyAt?: number;
  target: 'production' | 'staging';
  aliasAssigned?: boolean;
  aliasError?: any;
  source: 'git' | 'cli' | 'import';
  creator: {
    uid: string;
    username: string;
  };
}

export class VercelApiClient {
  private baseUrl = 'https://api.vercel.com';
  private token: string;
  private teamId?: string;

  constructor(config: VercelApiConfig) {
    this.token = config.token;
    this.teamId = config.teamId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };

    // Add any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.teamId) {
      headers['X-Vercel-Team-Id'] = this.teamId;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vercel API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  /**
   * Get all projects
   */
  async getProjects(): Promise<{ projects: VercelProject[] }> {
    return this.request('/v9/projects');
  }

  /**
   * Get a specific project
   */
  async getProject(projectId: string): Promise<VercelProject> {
    return this.request(`/v9/projects/${projectId}`);
  }

  /**
   * Create a new project
   */
  async createProject(projectData: {
    name: string;
    framework?: string;
    gitRepository?: {
      type: 'github' | 'gitlab' | 'bitbucket';
      repo: string;
    };
    environmentVariables?: Array<{
      key: string;
      value: string;
      target: string[];
      type?: 'plain' | 'secret';
    }>;
    buildCommand?: string;
    outputDirectory?: string;
    installCommand?: string;
    devCommand?: string;
  }): Promise<VercelProject> {
    return this.request('/v9/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  /**
   * Update project configuration
   */
  async updateProject(
    projectId: string,
    updates: Partial<{
      name: string;
      framework: string;
      buildCommand: string;
      outputDirectory: string;
      installCommand: string;
      devCommand: string;
    }>
  ): Promise<VercelProject> {
    return this.request(`/v9/projects/${projectId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    await this.request(`/v9/projects/${projectId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Get environment variables for a project
   */
  async getEnvironmentVariables(
    projectId: string
  ): Promise<{ envs: VercelEnvironmentVariableResponse[] }> {
    return this.request(`/v9/projects/${projectId}/env`);
  }

  /**
   * Create environment variable
   */
  async createEnvironmentVariable(
    projectId: string,
    envVar: {
      key: string;
      value: string;
      target: ('production' | 'preview' | 'development')[];
      type?: 'plain' | 'secret' | 'system';
      gitBranch?: string;
    }
  ): Promise<VercelEnvironmentVariableResponse> {
    return this.request(`/v9/projects/${projectId}/env`, {
      method: 'POST',
      body: JSON.stringify(envVar)
    });
  }

  /**
   * Update environment variable
   */
  async updateEnvironmentVariable(
    projectId: string,
    envId: string,
    updates: {
      value?: string;
      target?: ('production' | 'preview' | 'development')[];
      gitBranch?: string;
    }
  ): Promise<VercelEnvironmentVariableResponse> {
    return this.request(`/v9/projects/${projectId}/env/${envId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  /**
   * Delete environment variable
   */
  async deleteEnvironmentVariable(
    projectId: string,
    envId: string
  ): Promise<void> {
    await this.request(`/v9/projects/${projectId}/env/${envId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Get deployments for a project
   */
  async getDeployments(
    projectId: string,
    limit: number = 20
  ): Promise<{ deployments: VercelDeployment[] }> {
    return this.request(`/v6/deployments?projectId=${projectId}&limit=${limit}`);
  }

  /**
   * Get a specific deployment
   */
  async getDeployment(deploymentId: string): Promise<VercelDeployment> {
    return this.request(`/v13/deployments/${deploymentId}`);
  }

  /**
   * Create a deployment
   */
  async createDeployment(deploymentData: {
    name: string;
    files: Array<{
      file: string;
      data: string;
    }>;
    projectSettings?: {
      framework?: string;
      buildCommand?: string;
      outputDirectory?: string;
      installCommand?: string;
      devCommand?: string;
    };
    target?: 'production' | 'staging';
    gitSource?: {
      type: 'github' | 'gitlab' | 'bitbucket';
      repo: string;
      ref: string;
    };
  }): Promise<VercelDeployment> {
    return this.request('/v13/deployments', {
      method: 'POST',
      body: JSON.stringify(deploymentData)
    });
  }

  /**
   * Get domains for a project
   */
  async getDomains(projectId: string): Promise<{
    domains: Array<{
      name: string;
      verified: boolean;
      verification?: Array<{
        type: string;
        domain: string;
        value: string;
        reason: string;
      }>;
    }>;
  }> {
    return this.request(`/v9/projects/${projectId}/domains`);
  }

  /**
   * Add domain to project
   */
  async addDomain(
    projectId: string,
    domain: string,
    gitBranch?: string
  ): Promise<{
    name: string;
    verified: boolean;
    verification?: Array<{
      type: string;
      domain: string;
      value: string;
      reason: string;
    }>;
  }> {
    return this.request(`/v9/projects/${projectId}/domains`, {
      method: 'POST',
      body: JSON.stringify({ name: domain, gitBranch })
    });
  }

  /**
   * Remove domain from project
   */
  async removeDomain(projectId: string, domain: string): Promise<void> {
    await this.request(`/v9/projects/${projectId}/domains/${domain}`, {
      method: 'DELETE'
    });
  }

  /**
   * Verify domain
   */
  async verifyDomain(projectId: string, domain: string): Promise<{
    verified: boolean;
    verification?: Array<{
      type: string;
      domain: string;
      value: string;
      reason: string;
    }>;
  }> {
    return this.request(`/v9/projects/${projectId}/domains/${domain}/verify`, {
      method: 'POST'
    });
  }

  /**
   * Get team information
   */
  async getTeam(): Promise<{
    id: string;
    slug: string;
    name: string;
    createdAt: number;
    avatar?: string;
  }> {
    return this.request('/v2/team');
  }

  /**
   * Get user information
   */
  async getUser(): Promise<{
    user: {
      id: string;
      username: string;
      email: string;
      name?: string;
      avatar?: string;
    };
  }> {
    return this.request('/v2/user');
  }
}

/**
 * Sync environment variables from local config to Vercel
 */
export async function syncEnvironmentVariables(
  client: VercelApiClient,
  projectId: string,
  localEnvVars: Array<{
    key: string;
    value: string;
    target: ('production' | 'preview' | 'development')[];
    type?: 'plain' | 'secret';
  }>
): Promise<{
  created: number;
  updated: number;
  deleted: number;
  errors: string[];
}> {
  const result = {
    created: 0,
    updated: 0,
    deleted: 0,
    errors: [] as string[]
  };

  try {
    // Get existing environment variables
    const { envs: existingEnvs } = await client.getEnvironmentVariables(projectId);
    
    // Create a map of existing variables by key
    const existingEnvMap = new Map(
      existingEnvs.map(env => [env.key, env])
    );

    // Process local environment variables
    for (const localEnv of localEnvVars) {
      try {
        const existingEnv = existingEnvMap.get(localEnv.key);
        
        if (existingEnv) {
          // Update existing variable if value or targets changed
          const needsUpdate = 
            existingEnv.value !== localEnv.value ||
            JSON.stringify(existingEnv.target.sort()) !== JSON.stringify(localEnv.target.sort());
          
          if (needsUpdate) {
            await client.updateEnvironmentVariable(projectId, existingEnv.id, {
              value: localEnv.value,
              target: localEnv.target
            });
            result.updated++;
          }
          
          // Remove from map so we know it's been processed
          existingEnvMap.delete(localEnv.key);
        } else {
          // Create new variable
          await client.createEnvironmentVariable(projectId, localEnv);
          result.created++;
        }
      } catch (error) {
        result.errors.push(`Failed to sync ${localEnv.key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Delete variables that exist in Vercel but not in local config
    const keysToDelete = Array.from(existingEnvMap.keys());
    for (const key of keysToDelete) {
      const existingEnv = existingEnvMap.get(key);
      if (existingEnv) {
        try {
          await client.deleteEnvironmentVariable(projectId, existingEnv.id);
          result.deleted++;
        } catch (error) {
          result.errors.push(`Failed to delete ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

  } catch (error) {
    result.errors.push(`Failed to sync environment variables: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

/**
 * Setup complete Vercel project with configuration
 */
export async function setupVercelProject(
  client: VercelApiClient,
  config: {
    name: string;
    gitRepository?: {
      type: 'github' | 'gitlab' | 'bitbucket';
      repo: string;
    };
    domains?: string[];
    environmentVariables: Array<{
      key: string;
      value: string;
      target: ('production' | 'preview' | 'development')[];
      type?: 'plain' | 'secret';
    }>;
    framework?: string;
    buildCommand?: string;
    outputDirectory?: string;
    installCommand?: string;
    devCommand?: string;
  }
): Promise<{
  project: VercelProject;
  environmentSync: Awaited<ReturnType<typeof syncEnvironmentVariables>>;
  domains: string[];
  errors: string[];
}> {
  const errors: string[] = [];
  let project: VercelProject;
  let environmentSync: Awaited<ReturnType<typeof syncEnvironmentVariables>>;
  const domains: string[] = [];

  try {
    // Create project
    project = await client.createProject({
      name: config.name,
      framework: config.framework || 'nextjs',
      gitRepository: config.gitRepository,
      buildCommand: config.buildCommand,
      outputDirectory: config.outputDirectory,
      installCommand: config.installCommand,
      devCommand: config.devCommand
    });

    // Sync environment variables
    environmentSync = await syncEnvironmentVariables(
      client,
      project.id,
      config.environmentVariables
    );

    // Add domains if specified
    if (config.domains && config.domains.length > 0) {
      for (const domain of config.domains) {
        try {
          await client.addDomain(project.id, domain);
          domains.push(domain);
        } catch (error) {
          errors.push(`Failed to add domain ${domain}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

  } catch (error) {
    throw new Error(`Failed to setup Vercel project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    project,
    environmentSync,
    domains,
    errors
  };
}