import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { ApiError } from '@/services/api';

import {
  authQueryKeys,
  clearAnthersAuthToken,
  clearHomeCache,
  clearOrganizationCache,
  completeMockSignIn,
  signOut,
} from '../services';

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clearSession = async () => {
    clearAnthersAuthToken();
    clearOrganizationCache(queryClient);
    clearHomeCache(queryClient);
    // Cancel in-flight session fetches so they cannot restore a signed-in cache after logout.
    await queryClient.cancelQueries({ queryKey: authQueryKeys.session() });
    queryClient.setQueryData(authQueryKeys.session(), null);
    navigate('/login', { replace: true });
  };

  return useMutation({
    mutationFn: signOut,
    onSuccess: clearSession,
    onError: (error) => {
      // Already signed out on the server — still drop local session and send the user to login.
      if (error instanceof ApiError && error.status === 401) void clearSession();
    },
  });
};
