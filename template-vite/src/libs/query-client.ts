import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/services/api';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
  }
}

const MAX_RETRIES = 2;

const shouldRetry = (failureCount: number, error: ApiError) => {
  if (error.status !== null && error.status >= 400 && error.status < 500) return false;
  return failureCount < MAX_RETRIES;
};

interface CreateQueryClientOptions {
  /** Called when any query or mutation fails with 401, e.g. because the session cookie expired. */
  onUnauthorized?: (queryClient: QueryClient) => void;
}

export const createQueryClient = ({ onUnauthorized }: CreateQueryClientOptions = {}) => {
  const handleError = (error: unknown) => {
    if (error instanceof ApiError && error.status === 401) onUnauthorized?.(queryClient);
  };

  const queryClient: QueryClient = new QueryClient({
    queryCache: new QueryCache({ onError: handleError }),
    mutationCache: new MutationCache({ onError: handleError }),
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: shouldRetry,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return queryClient;
};
