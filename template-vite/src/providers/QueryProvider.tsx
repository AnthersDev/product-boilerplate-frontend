import React, { useState, type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { authQueryKeys, clearOrganizationCache } from '@/features/auth';
import { createQueryClient } from '@/libs/query-client';

const createAppQueryClient = () =>
  createQueryClient({
    // Drop account-specific data and update route guards when a request confirms the session expired.
    onUnauthorized: (queryClient) => {
      clearOrganizationCache(queryClient);
      queryClient.setQueryData(authQueryKeys.session(), null);
    },
  });

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(createAppQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
