export interface CloudflareConfig {
  accountId: string;
  apiToken: string;
  email?: string;
}

export interface KVNamespace {
  id: string;
  title: string;
  supports_url_encoding?: boolean;
}

export interface KVKey {
  name: string;
  expiration?: number;
  metadata?: Record<string, any>;
}

export interface KVValue {
  key: string;
  value: any;
  metadata?: Record<string, any>;
}

export interface PatternMatch {
  pattern: string;
  keys: string[];
  example: string;
  segments: string[];
}

export interface TreeNode {
  id: string;
  label: string;
  pattern?: string;
  children?: TreeNode[];
  isLeaf: boolean;
  keyCount?: number;
}