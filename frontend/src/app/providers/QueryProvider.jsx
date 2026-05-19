import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const DEFAULT_STALE_TIME_MS = 60 * 1000;
const DEFAULT_GC_TIME_MS = 5 * 60 * 1000;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME_MS,
        gcTime: DEFAULT_GC_TIME_MS,
        retry: 2,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

export function QueryProvider({ children }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
