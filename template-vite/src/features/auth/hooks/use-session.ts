import { useQuery } from '@tanstack/react-query';

import { sessionQueryOptions } from '../services';

export const useSession = () => useQuery(sessionQueryOptions());
