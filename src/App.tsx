import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APIKeyInput } from '@/components/APIKeyInput';
import { TreeExplorer } from '@/components/TreeExplorer';
import { JSONEditor } from '@/components/JSONEditor';
import { TableView } from '@/components/TableView';
import { useCloudflareAPI } from '@/hooks/useCloudflareAPI';
import type { CloudflareConfig } from '@/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function KVExplorer() {
  const [config, setConfig] = useState<CloudflareConfig | null>(null);
  const [selectedNamespace, setSelectedNamespace] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'json' | 'table'>('json');

  const {
    namespaces,
    namespacesLoading,
    usePatternsQuery,
    usePatternKeysQuery,
    useValueQuery,
    useMultipleValuesQuery,
    setValueMutation,
    deleteKeyMutation,
    patternDetector,
  } = useCloudflareAPI(config);

  const patternsQuery = usePatternsQuery(selectedNamespace);
  const patternKeysQuery = usePatternKeysQuery(selectedNamespace, selectedPattern);
  const valueQuery = useValueQuery(selectedNamespace, selectedKey);
  const multipleValuesQuery = useMultipleValuesQuery(
    selectedNamespace,
    viewMode === 'table' ? (patternKeysQuery.data || []) : []
  );

  const handleConfigSubmit = (newConfig: CloudflareConfig) => {
    setConfig(newConfig);
  };

  const handleNamespaceSelect = (namespaceId: string) => {
    setSelectedNamespace(namespaceId);
    setSelectedPattern(null);
    setSelectedKey(null);
  };

  const handlePatternSelect = (pattern: string) => {
    setSelectedPattern(pattern);
    setSelectedKey(null);
    setViewMode('table'); // Switch to table view when selecting a pattern
  };

  const handleKeyEdit = (key: string) => {
    setSelectedKey(key);
    setViewMode('json');
  };

  const handleKeyDelete = async (key: string) => {
    if (selectedNamespace && confirm(`Are you sure you want to delete key "${key}"?`)) {
      try {
        await deleteKeyMutation.mutateAsync({
          namespaceId: selectedNamespace,
          key,
        });
      } catch (error) {
        console.error('Failed to delete key:', error);
      }
    }
  };

  const handleValueSave = async (value: any) => {
    if (selectedNamespace && selectedKey) {
      try {
        await setValueMutation.mutateAsync({
          namespaceId: selectedNamespace,
          key: selectedKey,
          value,
        });
      } catch (error) {
        console.error('Failed to save value:', error);
      }
    }
  };

  if (!config) {
    return <APIKeyInput onConfigSubmit={handleConfigSubmit} />;
  }

  const patternTree = patternsQuery.data
    ? patternDetector.buildTree(patternsQuery.data)
    : [];

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Tree Explorer */}
      <div className="w-80 border-r">
        <TreeExplorer
          namespaces={namespaces}
          selectedNamespace={selectedNamespace}
          onNamespaceSelect={handleNamespaceSelect}
          patternTree={patternTree}
          onPatternSelect={handlePatternSelect}
          selectedPattern={selectedPattern}
          isLoading={namespacesLoading}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Cloudflare KV Explorer</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'table' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'json' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}
              >
                JSON
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {!selectedNamespace ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">Select a namespace</h3>
                <p>Choose a KV namespace from the sidebar to start exploring</p>
              </div>
            </div>
          ) : viewMode === 'table' && selectedPattern ? (
            <TableView
              data={multipleValuesQuery.data || []}
              onEdit={handleKeyEdit}
              onDelete={handleKeyDelete}
              isLoading={multipleValuesQuery.isLoading}
            />
          ) : viewMode === 'json' && selectedKey ? (
            <JSONEditor
              value={valueQuery.data}
              onSave={handleValueSave}
              keyName={selectedKey}
              isLoading={setValueMutation.isPending}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">No data selected</h3>
                <p>
                  {selectedPattern
                    ? 'Switch to table view to see pattern data, or select a specific key'
                    : 'Select a pattern from the sidebar to view data'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <KVExplorer />
    </QueryClientProvider>
  );
}

export default App;
