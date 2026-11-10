import React, { useState, type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { createQueryClient } from '@/libs/query-client';

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
