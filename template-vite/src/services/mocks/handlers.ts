import type { MockRoute } from './types';

export const mockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/health',
    handler: () => ({ data: { status: 'ok', timestamp: new Date().toISOString() } }),
  },
];
