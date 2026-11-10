import { isAxiosError } from 'axios';

export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string | undefined;
  readonly data: unknown;

  constructor(
    message: string,
    options: { status?: number | null; code?: string; data?: unknown; cause?: unknown } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = 'ApiError';
    this.status = options.status ?? null;
    this.code = options.code;
    this.data = options.data;
  }
}

const extractMessage = (data: unknown): string | undefined => {
  if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
    return data.message;
  }
  return undefined;
};

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    const data: unknown = error.response?.data;
    return new ApiError(extractMessage(data) ?? error.message, {
      status: error.response?.status ?? null,
      code: error.code,
      data,
      cause: error,
    });
  }

  return new ApiError(error instanceof Error ? error.message : 'Unknown error', { cause: error });
};
