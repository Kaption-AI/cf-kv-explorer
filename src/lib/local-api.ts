import type { CloudflareConfig, KVNamespace, KVKey } from '@/types';

// Mock data for local testing
const mockNamespaces: KVNamespace[] = [
  {
    id: 'test-kv-namespace',
    title: 'Test KV Namespace',
    supports_url_encoding: true,
  },
  {
    id: 'demo-namespace',
    title: 'Demo Namespace',
    supports_url_encoding: true,
  },
];

const mockData: Record<string, Record<string, any>> = {
  'test-kv-namespace': {
    'account:1234': {
      id: '1234',
      name: 'John Doe',
      email: 'john@example.com',
      created: '2024-01-01',
    },
    'account:5678': {
      id: '5678',
      name: 'Jane Smith',
      email: 'jane@example.com',
      created: '2024-01-02',
    },
    'client:123': {
      id: '123',
      company: 'Acme Corp',
      status: 'active',
    },
    'client:456': {
      id: '456',
      company: 'Beta Inc',
      status: 'inactive',
    },
    'link:123:1234': {
      clientId: '123',
      accountId: '1234',
      type: 'primary',
      created: '2024-01-01',
    },
    'link:456:5678': {
      clientId: '456',
      accountId: '5678',
      type: 'secondary',
      created: '2024-01-02',
    },
    'config:global': {
      version: '1.0.0',
      features: ['auth', 'billing', 'analytics'],
      maintenance: false,
    },
    'session:user123:abc456': {
      userId: 'user123',
      sessionId: 'abc456',
      expires: '2024-12-31T23:59:59Z',
      permissions: ['read', 'write'],
    },
    'cache:page:/home': {
      html: '<html><body>Home Page</body></html>',
      timestamp: '2024-01-01T12:00:00Z',
      ttl: 3600,
    },
  },
  'demo-namespace': {
    'user:demo123': {
      id: 'demo123',
      username: 'demo_user',
      role: 'admin',
    },
    'product:item456': {
      id: 'item456',
      name: 'Sample Product',
      price: 99.99,
    },
  },
};

export class LocalAPI {
  constructor(_config: CloudflareConfig) {
    // Config not used in local API but kept for interface compatibility
  }

  private async delay(ms: number = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async listNamespaces(): Promise<KVNamespace[]> {
    await this.delay();
    return mockNamespaces;
  }

  async listKeys(namespaceId: string, prefix?: string, limit = 1000): Promise<KVKey[]> {
    await this.delay();
    
    const namespaceData = mockData[namespaceId] || {};
    let keys = Object.keys(namespaceData);
    
    if (prefix) {
      keys = keys.filter(key => key.startsWith(prefix));
    }
    
    return keys.slice(0, limit).map(key => ({
      name: key,
      expiration: undefined,
      metadata: {},
    }));
  }

  async getValue(namespaceId: string, key: string): Promise<any> {
    await this.delay();
    
    const namespaceData = mockData[namespaceId] || {};
    const value = namespaceData[key];
    
    if (value === undefined) {
      throw new Error(`Key "${key}" not found in namespace "${namespaceId}"`);
    }
    
    return JSON.stringify(value);
  }

  async setValue(namespaceId: string, key: string, value: any, _metadata?: Record<string, any>): Promise<void> {
    await this.delay();
    
    if (!mockData[namespaceId]) {
      mockData[namespaceId] = {};
    }
    
    mockData[namespaceId][key] = value;
  }

  async deleteKey(namespaceId: string, key: string): Promise<void> {
    await this.delay();
    
    if (mockData[namespaceId]) {
      delete mockData[namespaceId][key];
    }
  }

  async scanKeysWithPatterns(namespaceId: string, sampleSize = 100): Promise<string[]> {
    await this.delay();
    
    const namespaceData = mockData[namespaceId] || {};
    const keys = Object.keys(namespaceData);
    
    return keys.slice(0, sampleSize);
  }
}

// Check if we should use local API (for development/testing)
export function shouldUseLocalAPI(config: CloudflareConfig): boolean {
  // Use local API if account ID is 'local' or 'test'
  return config.accountId === 'local' || config.accountId === 'test';
}