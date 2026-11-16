import { useQuery } from '@tanstack/react-query';

import { examplesQueryOptions } from '../services/example-service';

/** `GET /examples` through React Query. Rename with the feature. */
export const useExample = () => useQuery(examplesQueryOptions());
