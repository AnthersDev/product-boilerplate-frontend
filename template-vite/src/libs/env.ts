const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return value !== undefined && value !== '' && Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  apiTimeoutMs: toNumber(import.meta.env.VITE_API_TIMEOUT_MS, 15_000),
  useMockApi:
    import.meta.env.VITE_USE_MOCK_API === 'true' ||
    (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === undefined),
  mockApiDelayMs: toNumber(import.meta.env.VITE_MOCK_API_DELAY_MS, 300),
  ssoAppId: import.meta.env.VITE_SSO_APP_ID || undefined,
  /**
   * Must match the backend `APP_NAME`. Selects the CSRF header (`X-{APP_NAME}-Request`)
   * and the cross-tab refresh lock name.
   */
  appName: import.meta.env.VITE_APP_NAME?.trim() || 'app',
  /** PostHog project token. When set, analytics boots automatically (Ping / Nexus pattern). */
  posthogProjectToken: import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim() || undefined,
  posthogHost: import.meta.env.VITE_PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com',
  /** Intercom app id. When set, the messenger boots for signed-in users. */
  intercomAppId: import.meta.env.VITE_INTERCOM_APP_ID?.trim() || undefined,
  intercomApiBase: import.meta.env.VITE_INTERCOM_API_BASE?.trim() || 'https://api-iam.intercom.io',
} as const;
