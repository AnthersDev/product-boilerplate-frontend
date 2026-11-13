import { authMockRoutes } from './auth-handlers';
import { homeMockRoutes } from './home-handlers';
import { notificationMockRoutes } from './notification-handlers';
import { reportsMockRoutes } from './reports-handlers';
import { userMockRoutes } from './user-handlers';
import type { MockRoute } from './types';

export const mockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/health',
    handler: () => ({ data: { status: 'ok', timestamp: new Date().toISOString() } }),
  },
  ...authMockRoutes,
  ...userMockRoutes,
  ...notificationMockRoutes,
  ...homeMockRoutes,
  ...reportsMockRoutes,
];
