import {
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

const buildQuery = (url: URL, params: unknown) => {
  const query = new URLSearchParams(url.search);
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) query.append(key, String(value));
    });
  }
  return query;
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const createMockAdapter = (routes: MockRoute[], { delayMs = 0 } = {}): AxiosAdapter => {
  const compiled = routes.map(compileRoute);

  return async (config: InternalAxiosRequestConfig) => {
    const method = (config.method ?? 'get').toUpperCase() as MockMethod;
    const url = new URL(config.url ?? '/', 'http://mock.local');
    const path = url.pathname;

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
        query: buildQuery(url, config.params),
        body: parseBody(config.data),
      });
      return respond(result.status ?? 200, result.data ?? null);
    }

    return respond(404, { message: `[mock] No handler registered for ${method} ${path}` });
  };
};
