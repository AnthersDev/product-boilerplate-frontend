import React, { useEffect, useState, type PropsWithChildren } from 'react';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';

import { authQueryKeys, clearHomeCache, clearOrganizationCache } from '@/features/auth';
import { createQueryClient } from '@/libs/query-client';
import { onSessionExpired } from '@/services/api';

const clearExpiredSession = async (queryClient: QueryClient) => {
  clearOrganizationCache(queryClient);
  clearHomeCache(queryClient);
  await queryClient.cancelQueries({ queryKey: authQueryKeys.session() });
  queryClient.setQueryData(authQueryKeys.session(), null);
};

const createAppQueryClient = () =>
  createQueryClient({
    // Drop account-specific data and update route guards when a request confirms the session expired.
    onUnauthorized: clearExpiredSession,
  });

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(createAppQueryClient);

  useEffect(() => onSessionExpired(() => void clearExpiredSession(queryClient)), [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
