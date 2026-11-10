const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return value !== undefined && value !== '' && Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  apiTimeoutMs: toNumber(import.meta.env.VITE_API_TIMEOUT_MS, 15_000),
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
  mockApiDelayMs: toNumber(import.meta.env.VITE_MOCK_API_DELAY_MS, 300),
} as const;
