import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CloudflareAPI } from '@/lib/cloudflare-api';
import { LocalAPI, shouldUseLocalAPI } from '@/lib/local-api';
import { PatternDetector } from '@/lib/pattern-detector';
import type { CloudflareConfig } from '@/types';

export function useCloudflareAPI(config: CloudflareConfig | null) {
  const queryClient = useQueryClient();
  const api = config 
    ? shouldUseLocalAPI(config) 
      ? new LocalAPI(config) 
      : new CloudflareAPI(config) 
    : null;
  const patternDetector = new PatternDetector();

  // Query for listing namespaces
  const namespacesQuery = useQuery({
    queryKey: ['namespaces', config?.accountId],
    queryFn: () => api!.listNamespaces(),
    enabled: !!api,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for listing keys in a namespace
  const useKeysQuery = (namespaceId: string | null) => {
    return useQuery({
      queryKey: ['keys', namespaceId],
      queryFn: () => api!.listKeys(namespaceId!),
      enabled: !!api && !!namespaceId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Query for pattern detection
  const usePatternsQuery = (namespaceId: string | null) => {
    return useQuery({
      queryKey: ['patterns', namespaceId],
      queryFn: async () => {
        const keys = await api!.scanKeysWithPatterns(namespaceId!);
        return patternDetector.detectPatterns(keys);
      },
      enabled: !!api && !!namespaceId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Query for getting keys matching a pattern
  const usePatternKeysQuery = (namespaceId: string | null, pattern: string | null) => {
    return useQuery({
      queryKey: ['pattern-keys', namespaceId, pattern],
      queryFn: async () => {
        const allKeys = await api!.scanKeysWithPatterns(namespaceId!);
        return patternDetector.getKeysForPattern(allKeys, pattern!);
      },
      enabled: !!api && !!namespaceId && !!pattern,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Query for getting a specific key value
  const useValueQuery = (namespaceId: string | null, key: string | null) => {
    return useQuery({
      queryKey: ['value', namespaceId, key],
      queryFn: async () => {
        const value = await api!.getValue(namespaceId!, key!);
        try {
          // Try to parse as JSON
          return JSON.parse(value);
        } catch {
          // Return as string if not JSON
          return value;
        }
      },
      enabled: !!api && !!namespaceId && !!key,
      staleTime: 1 * 60 * 1000, // 1 minute
    });
  };

  // Query for getting multiple values
  const useMultipleValuesQuery = (namespaceId: string | null, keys: string[]) => {
    return useQuery({
      queryKey: ['multiple-values', namespaceId, keys],
      queryFn: async () => {
        const values = await Promise.all(
          keys.map(async (key) => {
            try {
              const value = await api!.getValue(namespaceId!, key);
              try {
                return { key, value: JSON.parse(value) };
              } catch {
                return { key, value };
              }
            } catch (error) {
              return { key, value: null, error: error instanceof Error ? error.message : 'Unknown error' };
            }
          })
        );
        return values;
      },
      enabled: !!api && !!namespaceId && keys.length > 0,
      staleTime: 1 * 60 * 1000, // 1 minute
    });
  };

  // Mutation for setting a value
  const setValueMutation = useMutation({
    mutationFn: ({ namespaceId, key, value, metadata }: {
      namespaceId: string;
      key: string;
      value: any;
      metadata?: Record<string, any>;
    }) => api!.setValue(namespaceId, key, value, metadata),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['keys', variables.namespaceId] });
      queryClient.invalidateQueries({ queryKey: ['value', variables.namespaceId, variables.key] });
      queryClient.invalidateQueries({ queryKey: ['multiple-values', variables.namespaceId] });
      queryClient.invalidateQueries({ queryKey: ['pattern-keys', variables.namespaceId] });
    },
  });

  // Mutation for deleting a key
  const deleteKeyMutation = useMutation({
    mutationFn: ({ namespaceId, key }: { namespaceId: string; key: string }) =>
      api!.deleteKey(namespaceId, key),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['keys', variables.namespaceId] });
      queryClient.invalidateQueries({ queryKey: ['value', variables.namespaceId, variables.key] });
      queryClient.invalidateQueries({ queryKey: ['multiple-values', variables.namespaceId] });
      queryClient.invalidateQueries({ queryKey: ['pattern-keys', variables.namespaceId] });
    },
  });

  return {
    namespaces: namespacesQuery.data || [],
    namespacesLoading: namespacesQuery.isLoading,
    namespacesError: namespacesQuery.error,
    useKeysQuery,
    usePatternsQuery,
    usePatternKeysQuery,
    useValueQuery,
    useMultipleValuesQuery,
    setValueMutation,
    deleteKeyMutation,
    patternDetector,
  };
}