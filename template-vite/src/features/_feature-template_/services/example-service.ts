import { queryOptions } from '@tanstack/react-query';

import { httpClient, type ApiEnvelope } from '@/services/api';

import type { ExampleItem } from '../types';

/** Path relative to `VITE_API_BASE_URL`. The matching mock is `example-mock.ts`. */
export const EXAMPLES_ENDPOINT = '/examples';

export const exampleQueryKeys = {
  all: ['examples'] as const,
  list: () => [...exampleQueryKeys.all, 'list'] as const,
};

export const fetchExamples = async (signal?: AbortSignal): Promise<ExampleItem[]> => {
  const { data } = await httpClient.get<ApiEnvelope<ExampleItem[]>>(EXAMPLES_ENDPOINT, { signal });
  return data.data;
};

export const examplesQueryOptions = () =>
  queryOptions({
    queryKey: exampleQueryKeys.list(),
    queryFn: ({ signal }) => fetchExamples(signal),
  });
