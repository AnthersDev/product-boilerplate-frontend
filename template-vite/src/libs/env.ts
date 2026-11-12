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
} as const;
