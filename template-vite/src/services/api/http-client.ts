import axios, { isAxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { authClient, baseClientConfig } from './auth-client';
import { refreshSession } from './auth-session';
import { toApiError } from './api-error';

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const attachRefreshInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const axiosError = isAxiosError(error) ? error : null;
      const originalRequest = axiosError?.config as RetriableRequest | undefined;
      const status = axiosError?.response?.status;

      // A 401 refreshes once, then retries. Session endpoints stay on `authClient`.
      if (status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const session = await refreshSession();
          if (session) return client.request(originalRequest);
        } catch (refreshError) {
          return Promise.reject(toApiError(refreshError));
        }
      }

      return Promise.reject(toApiError(error));
    },
  );
};

/**
 * App API client. Sends the session cookies and the CSRF header.
 * A 401 refreshes once, then retries. Session endpoints stay on `authClient`.
 *
 * The mock adapter is attached in `installMockApi` when mocks are enabled.
 */
export const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    ...baseClientConfig(),
    // App calls can be slower than session checks; keep the shared timeout from env.
  });
  attachRefreshInterceptor(client);
  return client;
};

export const httpClient = createHttpClient();

/** Clients that need the mock adapter when mocks are on. */
export const getApiClients = (): AxiosInstance[] => [httpClient, authClient];
