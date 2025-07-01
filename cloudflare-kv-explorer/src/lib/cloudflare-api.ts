import type { CloudflareConfig, KVNamespace, KVKey } from '@/types';

export class CloudflareAPI {
  private config: CloudflareConfig;
  private baseUrl = 'https://api.cloudflare.com/client/v4';

  constructor(config: CloudflareConfig) {
    this.config = config;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.config.apiToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async listNamespaces(): Promise<KVNamespace[]> {
    const response = await this.makeRequest(
      `/accounts/${this.config.accountId}/storage/kv/namespaces`
    );
    return response.result;
  }

  async listKeys(namespaceId: string, prefix?: string, limit = 1000): Promise<KVKey[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    
    if (prefix) {
      params.append('prefix', prefix);
    }

    const response = await this.makeRequest(
      `/accounts/${this.config.accountId}/storage/kv/namespaces/${namespaceId}/keys?${params}`
    );
    return response.result;
  }

  async getValue(namespaceId: string, key: string): Promise<any> {
    const response = await this.makeRequest(
      `/accounts/${this.config.accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`
    );
    return response;
  }

  async setValue(namespaceId: string, key: string, value: any, metadata?: Record<string, any>): Promise<void> {
    const body: any = { value: JSON.stringify(value) };
    if (metadata) {
      body.metadata = metadata;
    }

    await this.makeRequest(
      `/accounts/${this.config.accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      }
    );
  }

  async deleteKey(namespaceId: string, key: string): Promise<void> {
    await this.makeRequest(
      `/accounts/${this.config.accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // Method to scan keys with intelligent pattern detection
  async scanKeysWithPatterns(namespaceId: string, sampleSize = 100): Promise<string[]> {
    const keys = await this.listKeys(namespaceId, undefined, sampleSize);
    return keys.map(key => key.name);
  }
}