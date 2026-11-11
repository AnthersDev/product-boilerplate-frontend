import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authQueryKeys, organizationsQueryOptions, selectOrganization } from '../services';

export const useOrganizations = () => useQuery(organizationsQueryOptions());

export const useSelectOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: selectOrganization,
    onSuccess: (session) => queryClient.setQueryData(authQueryKeys.session(), session),
  });
};
