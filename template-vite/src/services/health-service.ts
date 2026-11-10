import { queryOptions } from '@tanstack/react-query';

import { httpClient } from '@/services/api';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
}

export const fetchHealth = async (signal?: AbortSignal) => {
  const { data } = await httpClient.get<HealthStatus>('/health', { signal });
  return data;
};

export const healthQueryOptions = () =>
  queryOptions({
    queryKey: ['health'],
    queryFn: ({ signal }) => fetchHealth(signal),
  });
