import { queryOptions, type QueryClient } from '@tanstack/react-query';

import { httpClient, type ApiEnvelope } from '@/services/api';

import type { HomeDemoScenarioProps, HomePageDataProps } from '../types';

export const HOME_ENDPOINT = '/home';

export const homeQueryKeys = {
  all: ['home'] as const,
  page: (scenario: HomeDemoScenarioProps) => [...homeQueryKeys.all, scenario] as const,
};

export const clearHomeCache = (queryClient: QueryClient) =>
  queryClient.removeQueries({ queryKey: homeQueryKeys.all });

export const fetchHomePage = async (scenario: HomeDemoScenarioProps = 'default') => {
  const { data } = await httpClient.get<ApiEnvelope<HomePageDataProps>>(HOME_ENDPOINT, {
    params: scenario === 'default' ? undefined : { scenario },
  });
  return data.data;
};

export const homePageQueryOptions = (scenario: HomeDemoScenarioProps = 'default') =>
  queryOptions({
    queryKey: homeQueryKeys.page(scenario),
    queryFn: () => fetchHomePage(scenario),
  });
