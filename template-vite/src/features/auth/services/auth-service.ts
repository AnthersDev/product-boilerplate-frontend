import { queryOptions } from '@tanstack/react-query';

import { env } from '@/libs/env';
import { ApiError, httpClient, type ApiEnvelope } from '@/services/api';

import type { AuthSession, Organization } from '../types';

export const AUTH_ENDPOINTS = {
  signIn: '/auth/sso',
  session: '/auth/session',
  signOut: '/auth/logout',
  organizations: '/auth/organization',
  selectOrganization: (organizationId: string) => `/auth/organization/${encodeURIComponent(organizationId)}`,
  /** Mock API only: stands in for opening the magic link from the email. */
  mockVerify: '/auth/mock/verify',
} as const;

/** Absolute URL for Anthers `LoginPage`, which posts with its own axios call instead of `httpClient`. */
export const signInEndpoint = `${env.apiBaseUrl.replace(/\/+$/, '')}${AUTH_ENDPOINTS.signIn}`;

/**
 * Anthers `LoginPage` redirects away from /login when it finds a JWT under `localStorage.authToken`.
 * This app uses cookies, so a token left there by another app on the same origin would cause a redirect loop.
 */
export const clearAnthersAuthToken = () => {
  try {
    localStorage.removeItem('authToken');
  } catch {
    // Storage can be unavailable (private mode); nothing to clear then.
  }
  return null;
};

export const authQueryKeys = {
  all: ['auth'] as const,
  session: () => [...authQueryKeys.all, 'session'] as const,
  organizations: () => [...authQueryKeys.all, 'organizations'] as const,
};

/** Resolves to `null` when signed out (401) instead of throwing. */
export const fetchSession = async (signal?: AbortSignal): Promise<AuthSession | null> => {
  try {
    const { data } = await httpClient.get<ApiEnvelope<AuthSession>>(AUTH_ENDPOINTS.session, { signal });
    return data.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
};

export const fetchOrganizations = async (signal?: AbortSignal): Promise<Organization[]> => {
  const { data } = await httpClient.get<ApiEnvelope<Organization[]>>(AUTH_ENDPOINTS.organizations, { signal });
  return data.data;
};

/** The backend sets the organization cookies and returns the updated session. */
export const selectOrganization = async (organizationId: string): Promise<AuthSession> => {
  const { data } = await httpClient.post<ApiEnvelope<AuthSession>>(AUTH_ENDPOINTS.selectOrganization(organizationId));
  return data.data;
};

export const signOut = async (): Promise<void> => {
  await httpClient.post(AUTH_ENDPOINTS.signOut);
};

export const completeMockSignIn = async (): Promise<AuthSession> => {
  const { data } = await httpClient.post<ApiEnvelope<AuthSession>>(AUTH_ENDPOINTS.mockVerify);
  return data.data;
};

export const sessionQueryOptions = () =>
  queryOptions({
    queryKey: authQueryKeys.session(),
    queryFn: ({ signal }) => fetchSession(signal),
    // Revalidate so sign-outs and cookie expiration in another tab eventually reach the route guards.
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

export const organizationsQueryOptions = () =>
  queryOptions({
    queryKey: authQueryKeys.organizations(),
    queryFn: ({ signal }) => fetchOrganizations(signal),
  });
