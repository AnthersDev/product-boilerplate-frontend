import { env } from '@/libs/env';

import { mockRoutes } from './handlers';
import { createMockAdapter } from './mock-adapter';

export * from './types';
export { createMockAdapter } from './mock-adapter';

export const mockAdapter = createMockAdapter(mockRoutes, { delayMs: env.mockApiDelayMs });
