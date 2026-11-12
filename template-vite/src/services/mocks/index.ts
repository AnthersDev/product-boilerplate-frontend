import axios from 'axios';

import { env } from '@/libs/env';
import { httpClient } from '@/services/api/http-client';

import { mockRoutes } from './handlers';
import { createMockAdapter } from './mock-adapter';

export * from './types';
export { createMockAdapter } from './mock-adapter';
export { MOCK_AUTH_EMAILS } from './auth-handlers';

/**
 * Routes requests through the mocks. Sets the adapter on both the shared axios
 * default (Anthers `LoginPage`) and the app `httpClient`.
 *
 * Import this module only when mocks are on (see `main.tsx`) so production
 * builds that leave mocks off do not ship the handler code.
 */
export const installMockApi = () => {
  const mockAdapter = createMockAdapter(mockRoutes, {
    delayMs: env.mockApiDelayMs,
    baseUrl: env.apiBaseUrl,
  });
  axios.defaults.adapter = mockAdapter;
  httpClient.defaults.adapter = mockAdapter;
};
