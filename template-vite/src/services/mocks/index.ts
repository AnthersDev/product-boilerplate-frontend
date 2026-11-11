import axios from 'axios';

import { env } from '@/libs/env';

import { mockRoutes } from './handlers';
import { createMockAdapter } from './mock-adapter';

export * from './types';
export { createMockAdapter } from './mock-adapter';
export { MOCK_AUTH_EMAILS } from './auth-handlers';

export const mockAdapter = createMockAdapter(mockRoutes, {
  delayMs: env.mockApiDelayMs,
  baseUrl: env.apiBaseUrl,
});

/**
 * Routes requests made with the default axios instance through the mocks too.
 * Anthers components such as `LoginPage` call `axios.request` directly instead of `httpClient`.
 */
export const installMockApi = () => {
  axios.defaults.adapter = mockAdapter;
};
