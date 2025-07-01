import type { PatternMatch, TreeNode } from '@/types';

export class PatternDetector {
  private separator: string;

  constructor(separator = ':') {
    this.separator = separator;
  }

  /**
   * Analyzes a list of keys and detects patterns
   */
  detectPatterns(keys: string[]): PatternMatch[] {
    const patterns = new Map<string, PatternMatch>();

    for (const key of keys) {
      const segments = key.split(this.separator);
      if (segments.length < 2) continue;

      // Generate pattern by replacing segments that look like IDs with placeholders
      const pattern = this.generatePattern(segments);
      
      if (!patterns.has(pattern)) {
        patterns.set(pattern, {
          pattern,
          keys: [],
          example: key,
          segments: segments.map(() => '{id}'), // placeholder for now
        });
      }

      patterns.get(pattern)!.keys.push(key);
    }

    // Filter out patterns with only one key (not really patterns)
    return Array.from(patterns.values()).filter(p => p.keys.length > 1);
  }

  /**
   * Generates a pattern from key segments
   */
  private generatePattern(segments: string[]): string {
    return segments.map((segment) => {
      // If segment looks like an ID (numeric, UUID, etc.), replace with placeholder
      if (this.looksLikeId(segment)) {
        return '{id}';
      }
      return segment;
    }).join(this.separator);
  }

  /**
   * Determines if a segment looks like an ID
   */
  private looksLikeId(segment: string): boolean {
    // Check for numeric ID
    if (/^\d+$/.test(segment)) {
      return true;
    }

    // Check for UUID pattern
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
      return true;
    }

    // Check for hex ID
    if (/^[0-9a-f]+$/i.test(segment) && segment.length > 6) {
      return true;
    }

    // Check for alphanumeric ID (common pattern)
    if (/^[a-zA-Z0-9]+$/.test(segment) && segment.length > 8) {
      return true;
    }

    return false;
  }

  /**
   * Builds a tree structure from patterns
   */
  buildTree(patterns: PatternMatch[]): TreeNode[] {
    const tree: TreeNode[] = [];
    const nodeMap = new Map<string, TreeNode>();

    for (const pattern of patterns) {
      const segments = pattern.pattern.split(this.separator);
      let currentPath = '';
      let currentLevel = tree;

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        currentPath += (currentPath ? this.separator : '') + segment;
        
        let node = nodeMap.get(currentPath);
        if (!node) {
          node = {
            id: currentPath,
            label: segment,
            pattern: i === segments.length - 1 ? pattern.pattern : undefined,
            children: [],
            isLeaf: i === segments.length - 1,
            keyCount: i === segments.length - 1 ? pattern.keys.length : undefined,
          };
          
          nodeMap.set(currentPath, node);
          currentLevel.push(node);
        }

        if (node.children) {
          currentLevel = node.children;
        }
      }
    }

    return tree;
  }

  /**
   * Gets all keys matching a specific pattern
   */
  getKeysForPattern(keys: string[], pattern: string): string[] {
    const patternRegex = this.patternToRegex(pattern);
    return keys.filter(key => patternRegex.test(key));
  }

  /**
   * Converts a pattern to a regex
   */
  private patternToRegex(pattern: string): RegExp {
    const escapedPattern = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
      .replace(/\\\{id\\\}/g, '[^:]+'); // Replace {id} with regex for non-separator chars
    
    return new RegExp(`^${escapedPattern}$`);
  }

  /**
   * Extracts the prefix from a pattern (everything before the first {id})
   */
  getPatternPrefix(pattern: string): string {
    const parts = pattern.split(this.separator);
    const prefixParts = [];
    
    for (const part of parts) {
      if (part === '{id}') {
        break;
      }
      prefixParts.push(part);
    }
    
    return prefixParts.join(this.separator);
  }

  /**
   * Groups keys by their common prefixes for efficient scanning
   */
  groupKeysByPrefix(keys: string[]): Map<string, string[]> {
    const groups = new Map<string, string[]>();
    
    for (const key of keys) {
      const segments = key.split(this.separator);
      if (segments.length > 0) {
        const prefix = segments[0];
        if (!groups.has(prefix)) {
          groups.set(prefix, []);
        }
        groups.get(prefix)!.push(key);
      }
    }
    
    return groups;
  }
}