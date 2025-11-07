'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/react-query-client';

/**
 * Providers component
 * Wraps the app with React Query and other providers
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
