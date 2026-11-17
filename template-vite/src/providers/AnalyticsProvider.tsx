import { useEffect, useRef, type PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { useSession } from '@/features/auth';
import {
  bootIntercom,
  capturePostHogPageview,
  ensurePostHog,
  identifyPostHogUser,
  isIntercomEnabled,
  isPostHogEnabled,
  resetPostHog,
  shutdownIntercom,
} from '@/libs/analytics';

/**
 * Boots PostHog / Intercom only when their env keys are set (Ping / Nexus pattern).
 * Without keys, this provider is a no-op.
 */
export const AnalyticsProvider = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (isPostHogEnabled()) ensurePostHog();
  }, []);

  useEffect(() => {
    if (!isPostHogEnabled() || !isAuthenticated) return;
    capturePostHogPageview();
  }, [isAuthenticated, location.pathname, location.search]);

  useEffect(() => {
    const user = session?.user;
    if (!user) {
      if (wasAuthenticated.current && isPostHogEnabled()) resetPostHog();
      wasAuthenticated.current = false;
      if (isIntercomEnabled()) shutdownIntercom();
      return;
    }

    wasAuthenticated.current = true;
    if (isPostHogEnabled()) identifyPostHogUser(user);
    if (isIntercomEnabled()) void bootIntercom(user);
  }, [session?.user]);

  return children;
};
