import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { clearHomeCache } from '@/features/home/services/home-service';

import { authQueryKeys, organizationsQueryOptions, selectOrganization } from '../services';

export const useOrganizations = () => useQuery(organizationsQueryOptions());

export const useSelectOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: selectOrganization,
    onSuccess: async (session) => {
      clearHomeCache(queryClient);
      await queryClient.cancelQueries({ queryKey: authQueryKeys.session() });
      queryClient.setQueryData(authQueryKeys.session(), session);
    },
  });
};
