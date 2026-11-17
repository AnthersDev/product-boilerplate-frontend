import posthog from 'posthog-js';

import { env } from '@/libs/env';

let hasInitialized = false;

export const isPostHogEnabled = (): boolean => Boolean(env.posthogProjectToken);

/** Init once when a project token is set. No-ops when the key is missing. */
export const ensurePostHog = (): boolean => {
  if (!isPostHogEnabled() || typeof window === 'undefined') return false;
  if (hasInitialized) return true;

  try {
    posthog.init(env.posthogProjectToken!, {
      api_host: env.posthogHost,
      autocapture: true,
      capture_pageview: false,
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
    });
    hasInitialized = true;
    return true;
  } catch (error) {
    console.warn('[Analytics] PostHog failed to initialize.', error);
    return false;
  }
};

export const identifyPostHogUser = (user: {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}): void => {
  if (!ensurePostHog()) return;
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
  posthog.identify(user.id, {
    email: user.email,
    ...(name ? { name } : {}),
  });
};

export const capturePostHogPageview = (pathname: string, search = ''): void => {
  if (!ensurePostHog()) return;
  posthog.capture('$pageview', {
    $current_url: `${window.location.origin}${pathname}${search}`,
  });
};

export const resetPostHog = (): void => {
  if (!hasInitialized || !isPostHogEnabled()) return;
  try {
    posthog.capture('user_signed_out');
    posthog.reset();
  } catch (error) {
    console.warn('[Analytics] PostHog reset failed.', error);
  }
};
