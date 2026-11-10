import { QueryClient } from '@tanstack/react-query';

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

export const createQueryClient = () =>
  new QueryClient({
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
