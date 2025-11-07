import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration
 * Centralized configuration for data fetching and caching
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 1 time
      retry: 1,
      // Refetch on window focus in production
      refetchOnWindowFocus: typeof window !== 'undefined' && process.env.NODE_ENV === 'production',
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations 0 times
      retry: 0,
    },
  },
});
