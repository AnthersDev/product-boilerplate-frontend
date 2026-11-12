import axios, { type AxiosInstance } from 'axios';

import { env } from '@/libs/env';

import { toApiError } from './api-error';

/**
 * Shared axios client. The mock adapter is attached in `installMockApi` when
 * mocks are enabled, so this module never imports the mock layer.
 */
export const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: env.apiTimeoutMs,
    // The session lives in HttpOnly cookies, which the browser only sends cross-origin with credentials.
    withCredentials: true,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(toApiError(error)),
  );

  return client;
};

export const httpClient = createHttpClient();
