import { getUnauthorizedSessionResponse } from '@/services/mocks/auth-handlers';
import type { MockResponse, MockRoute } from '@/services/mocks/types';

import type { ExampleItem } from '../types';

const ok = (data: ExampleItem[], message = 'Examples fetched successfully'): MockResponse => ({
  data: { status: true, message, data },
});

const fail = (status: number, message: string): MockResponse => ({
  status,
  data: { status: false, message },
});

const EXAMPLES: ExampleItem[] = [
  { id: 'example-1', name: 'First example' },
  { id: 'example-2', name: 'Second example' },
];

/**
 * Mock for `GET /examples`.
 * Registered from `src/services/mocks/handlers.ts`. When you copy this feature,
 * keep that registration pointed at your renamed routes.
 */
export const exampleMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/examples',
    handler: ({ query, adapterStorage }) => {
      const unauthorizedResponse = getUnauthorizedSessionResponse(adapterStorage);
      if (unauthorizedResponse) return unauthorizedResponse;

      if (query.get('scenario') === 'error') {
        return fail(500, 'Could not load examples.');
      }

      return ok(EXAMPLES);
    },
  },
];
