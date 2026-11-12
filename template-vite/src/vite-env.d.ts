/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_MOCK_API_DELAY_MS?: string;
  readonly VITE_SSO_APP_ID?: string;
  /** Must match the backend `APP_NAME` (CSRF header + refresh lock). */
  readonly VITE_APP_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
