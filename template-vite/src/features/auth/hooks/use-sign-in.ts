import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authQueryKeys, completeMockSignIn, signOut } from '../services';

export const useCompleteMockSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeMockSignIn,
    onSuccess: (session) => queryClient.setQueryData(authQueryKeys.session(), session),
  });
};

/** Clears cached data even if the request fails, since the cookies may already be gone. */
export const useSignOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSettled: () => {
      queryClient.clear();
      queryClient.setQueryData(authQueryKeys.session(), null);
    },
  });
};
