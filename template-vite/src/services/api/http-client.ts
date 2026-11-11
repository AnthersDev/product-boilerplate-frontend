import axios, { type AxiosInstance } from 'axios';

import { env } from '@/libs/env';
import { mockAdapter } from '@/services/mocks';

import { toApiError } from './api-error';

export const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: env.apiTimeoutMs,
    // The session lives in HttpOnly cookies, which the browser only sends cross-origin with credentials.
    withCredentials: true,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    adapter: env.useMockApi ? mockAdapter : undefined,
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(toApiError(error)),
  );

  return client;
};

export const httpClient = createHttpClient();
