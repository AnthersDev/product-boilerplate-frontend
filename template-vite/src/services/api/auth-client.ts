import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios';

import { env } from '@/libs/env';

import { toApiError } from './api-error';

/**
 * Must match the backend `APP_NAME`. Cookie-authenticated writes that lack this
 * header are rejected; a cross-site form or image cannot send it.
 */
export const CSRF_HEADER = env.appName ? `X-${env.appName}-Request` : null;

export const baseClientConfig = (): CreateAxiosDefaults => ({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  // The session lives in HttpOnly cookies, which the browser only sends cross-origin with credentials.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(CSRF_HEADER ? { [CSRF_HEADER]: '1' } : {}),
  },
});

/**
 * Session endpoints only (`/auth/session`, `/auth/refresh-token`, `/auth/logout`).
 * Has no 401 refresh interceptor, so a failed refresh cannot trigger another refresh.
 */
export const createAuthClient = (): AxiosInstance => {
  const client = axios.create(baseClientConfig());

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(toApiError(error)),
  );

  return client;
};

export const authClient = createAuthClient();
