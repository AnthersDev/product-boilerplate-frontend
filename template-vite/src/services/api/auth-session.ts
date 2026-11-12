import type { AuthSession } from '../../features/auth/types';

import { env } from '@/libs/env';

import { authClient } from './auth-client';
import { AUTH_ENDPOINTS } from './auth-endpoints';
import { ApiError } from './api-error';
import type { ApiEnvelope } from './api-envelope';

const REFRESH_LOCK = `${env.appName}-auth-refresh`;

const isUnauthorized = (error: unknown): boolean => error instanceof ApiError && error.status === 401;

type SessionExpiredListener = () => void;

const expiredListeners = new Set<SessionExpiredListener>();

/** Subscribe to hard session expiry (refresh cookie gone). Returns an unsubscribe. */
export const onSessionExpired = (listener: SessionExpiredListener) => {
  expiredListeners.add(listener);
  return () => {
    expiredListeners.delete(listener);
  };
};

const notifySessionExpired = () => {
  expiredListeners.forEach((listener) => listener());
};

const requestRefresh = async (): Promise<AuthSession | null> => {
  try {
    const { data } = await authClient.post<ApiEnvelope<AuthSession>>(AUTH_ENDPOINTS.refreshToken);
    return data.data;
  } catch (error) {
    // A 401 means the refresh cookie is gone. Other failures are transient, so
    // callers keep the current session instead of treating them as sign-out.
    if (isUnauthorized(error)) {
      notifySessionExpired();
      return null;
    }
    throw error;
  }
};

let inflightRefresh: Promise<AuthSession | null> | null = null;

/**
 * Rotates the refresh cookie. The refresh token is single-use, so calls are
 * shared within a tab and serialized across tabs with a Web Lock (Ping pattern).
 */
export const refreshSession = (): Promise<AuthSession | null> => {
  if (!inflightRefresh) {
    const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined;
    const run = async () => (locks ? locks.request(REFRESH_LOCK, requestRefresh) : requestRefresh());
    inflightRefresh = run().finally(() => {
      inflightRefresh = null;
    });
  }
  return inflightRefresh;
};
