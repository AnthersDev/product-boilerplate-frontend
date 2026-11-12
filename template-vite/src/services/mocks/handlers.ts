import { authMockRoutes } from './auth-handlers';
import { homeMockRoutes } from './home-handlers';
import { reportsMockRoutes } from './reports-handlers';
import type { MockRoute } from './types';

export const mockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/health',
    handler: () => ({ data: { status: 'ok', timestamp: new Date().toISOString() } }),
  },
  ...authMockRoutes,
  ...homeMockRoutes,
  ...reportsMockRoutes,
];
