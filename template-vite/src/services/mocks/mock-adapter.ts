import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import type { MockMethod, MockRoute } from './types';

interface CompiledRoute extends MockRoute {
  pattern: RegExp;
  paramNames: string[];
}

const compileRoute = (route: MockRoute): CompiledRoute => {
  const paramNames: string[] = [];
  const source = route.path
    .replace(/\/+$/, '')
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        paramNames.push(segment.slice(1));
        return '([^/]+)';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return { ...route, pattern: new RegExp(`^${source}/?$`), paramNames };
};

const parseBody = (data: unknown): unknown => {
  if (typeof data !== 'string') return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

const MOCK_ORIGIN = 'http://mock.local';

const toBasePath = (baseUrl: string) => new URL(baseUrl, `${MOCK_ORIGIN}/`).pathname.replace(/\/+$/, '');

const stripBasePath = (pathname: string, basePath: string) => {
  if (!basePath || (pathname !== basePath && !pathname.startsWith(`${basePath}/`))) return pathname;
  return pathname.slice(basePath.length) || '/';
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface MockAdapterOptions {
  delayMs?: number;
  /** API base URL. Its path is removed before matching, so routes are written relative to it. */
  baseUrl?: string;
}

export const createMockAdapter = (
  routes: MockRoute[],
  { delayMs = 0, baseUrl = '' }: MockAdapterOptions = {},
): AxiosAdapter => {
  const compiled = routes.map(compileRoute);
  const basePath = toBasePath(baseUrl);

  return async (config: InternalAxiosRequestConfig) => {
    const method = (config.method ?? 'get').toUpperCase() as MockMethod;
    // getUri joins baseURL and url and adds params, the same way a real request would be sent.
    const url = new URL(axios.getUri(config), `${MOCK_ORIGIN}/`);
    const path = stripBasePath(url.pathname, basePath);

    if (delayMs > 0) await wait(delayMs);

    const respond = (status: number, data: unknown): AxiosResponse => {
      const response: AxiosResponse = {
        data,
        status,
        statusText: status < 400 ? 'OK' : 'Error',
        headers: new AxiosHeaders({ 'content-type': 'application/json' }),
        config,
        request: { mocked: true },
      };
      const validateStatus = config.validateStatus ?? ((s: number) => s >= 200 && s < 300);
      if (validateStatus(status)) return response;
      throw new AxiosError(
        `Request failed with status code ${status}`,
        status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
        config,
        response.request,
        response,
      );
    };

    for (const route of compiled) {
      if (route.method !== method) continue;
      const match = route.pattern.exec(path);
      if (!match) continue;

      const params = Object.fromEntries(
        route.paramNames.map((name, index) => [name, decodeURIComponent(match[index + 1])]),
      );
      const result = await route.handler({
        method,
        path,
        params,
        query: url.searchParams,
        body: parseBody(config.data),
      });
      return respond(result.status ?? 200, result.data ?? null);
    }

    return respond(404, { message: `[mock] No handler registered for ${method} ${path}` });
  };
};
