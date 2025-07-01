import { useState } from 'react';
import { ChevronRight, ChevronDown, Database, Folder, FolderOpen, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { KVNamespace, TreeNode } from '@/types';

interface TreeExplorerProps {
  namespaces: KVNamespace[];
  selectedNamespace: string | null;
  onNamespaceSelect: (namespaceId: string) => void;
  patternTree: TreeNode[];
  onPatternSelect: (pattern: string) => void;
  selectedPattern: string | null;
  isLoading?: boolean;
}

export function TreeExplorer({
  namespaces,
  selectedNamespace,
  onNamespaceSelect,
  patternTree,
  onPatternSelect,
  selectedPattern,
  isLoading
}: TreeExplorerProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTreeNode = (node: TreeNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedPattern === node.pattern;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-accent ${
            isSelected ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            }
            if (node.pattern) {
              onPatternSelect(node.pattern);
            }
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )
          ) : (
            <div className="w-5 mr-1" />
          )}
          
          {node.isLeaf ? (
            <Key className="h-4 w-4 mr-2 text-blue-500" />
          ) : (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 mr-2 text-amber-500" />
            ) : (
              <Folder className="h-4 w-4 mr-2 text-amber-500" />
            )
          )}
          
          <span className="text-sm">
            {node.label}
            {node.keyCount && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({node.keyCount} keys)
              </span>
            )}
          </span>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">KV Explorer</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          {/* Namespaces Section */}
          <div className="px-4 py-2 border-b">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Namespaces
            </h3>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              <div className="space-y-1">
                {namespaces.map((namespace) => (
                  <Button
                    key={namespace.id}
                    variant={selectedNamespace === namespace.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-8 px-2"
                    onClick={() => onNamespaceSelect(namespace.id)}
                    data-testid="namespace"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    <span className="text-sm truncate">{namespace.title}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Patterns Section */}
          {selectedNamespace && (
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Key Patterns
              </h3>
              {patternTree.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No patterns detected
                </div>
              ) : (
                <div className="space-y-1">
                  {patternTree.map(node => renderTreeNode(node))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}