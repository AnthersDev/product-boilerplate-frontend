export type MockMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface MockRequest {
  /** State storage owned by the mock adapter handling this request. */
  adapterStorage: Map<symbol, unknown>;
  method: MockMethod;
  path: string;
  params: Record<string, string>;
  query: URLSearchParams;
  body: unknown;
}

export interface MockResponse<T = unknown> {
  status?: number;
  data?: T;
}

export type MockHandler = (request: MockRequest) => MockResponse | Promise<MockResponse>;

export interface MockRoute {
  method: MockMethod;
  /** Path relative to the API base URL. Supports `:param` segments, e.g. `/users/:id`. */
  path: string;
  handler: MockHandler;
}
