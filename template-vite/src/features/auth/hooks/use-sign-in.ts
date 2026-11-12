import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/services/api';

import { authQueryKeys, clearHomeCache, completeMockSignIn, signOut } from '../services';

export const useCompleteMockSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeMockSignIn,
    onSuccess: async (session) => {
      clearHomeCache(queryClient);
      await queryClient.cancelQueries({ queryKey: authQueryKeys.session() });
      queryClient.setQueryData(authQueryKeys.session(), session);
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const clearSession = () => {
    queryClient.clear();
    queryClient.setQueryData(authQueryKeys.session(), null);
  };

  return useMutation({
    mutationFn: signOut,
    onSuccess: clearSession,
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) clearSession();
    },
  });
};
