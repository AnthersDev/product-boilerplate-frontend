import React, { useState, type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { authQueryKeys } from '@/features/auth';
import { createQueryClient } from '@/libs/query-client';

const createAppQueryClient = () =>
  createQueryClient({
    // Route guards watch the session query, so clearing it sends the user to /login.
    onUnauthorized: (queryClient) => queryClient.setQueryData(authQueryKeys.session(), null),
  });

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(createAppQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
