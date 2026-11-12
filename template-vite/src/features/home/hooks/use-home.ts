import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { homePageQueryOptions } from '../services/home-service';
import { parseHomeDemoScenario, type HomeDemoScenarioProps } from '../types';

/** Reads `?home=empty|error` so mock states are easy to demo without a backend. */
export const useHomeDemoScenario = (): HomeDemoScenarioProps => {
  const [params] = useSearchParams();
  return parseHomeDemoScenario(params.get('home'));
};

export const useHomePage = () => {
  const scenario = useHomeDemoScenario();
  return useQuery(homePageQueryOptions(scenario));
};
