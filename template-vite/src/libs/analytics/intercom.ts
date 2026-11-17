import { env } from '@/libs/env';

declare global {
  interface Window {
    Intercom?: ((command: string, ...args: unknown[]) => void) & { booted?: boolean };
    intercomSettings?: Record<string, unknown>;
  }
}

let scriptLoading: Promise<void> | null = null;

export const isIntercomEnabled = (): boolean => Boolean(env.intercomAppId);

const loadIntercomScript = (): Promise<void> => {
  if (!isIntercomEnabled() || typeof window === 'undefined') return Promise.resolve();
  if (window.Intercom) return Promise.resolve();
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise((resolve, reject) => {
    const appId = env.intercomAppId!;
    window.intercomSettings = { app_id: appId, api_base: env.intercomApiBase };

    const stub = (...args: unknown[]) => {
      const queue = ((stub as { q?: unknown[] }).q = (stub as { q?: unknown[] }).q || []);
      queue.push(args);
    };
    (stub as { q?: unknown[] }).q = [];
    window.Intercom = stub as Window['Intercom'];

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://widget.intercom.io/widget/${appId}`;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoading = null;
      reject(new Error('Failed to load Intercom widget script'));
    };
    document.head.appendChild(script);
  });

  return scriptLoading;
};

export const bootIntercom = async (user: {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}): Promise<void> => {
  if (!isIntercomEnabled()) return;

  try {
    await loadIntercomScript();
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    window.Intercom?.('boot', {
      app_id: env.intercomAppId,
      api_base: env.intercomApiBase,
      user_id: user.id,
      email: user.email,
      ...(name ? { name } : {}),
    });
  } catch (error) {
    console.warn('[Analytics] Intercom failed to boot.', error);
  }
};

export const updateIntercom = (payload: Record<string, unknown>): void => {
  if (!isIntercomEnabled() || !window.Intercom) return;
  window.Intercom('update', payload);
};

export const shutdownIntercom = (): void => {
  if (!isIntercomEnabled() || !window.Intercom) return;
  try {
    window.Intercom('shutdown');
  } catch (error) {
    console.warn('[Analytics] Intercom shutdown failed.', error);
  }
};
