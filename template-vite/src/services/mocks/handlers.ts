import { exampleMockRoutes } from '@/features/_feature-template_';

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
  // Sample for new features. When you copy `_feature-template_`, point this at your routes.
  ...exampleMockRoutes,
];
