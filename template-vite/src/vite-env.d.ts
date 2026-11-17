/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_MOCK_API_DELAY_MS?: string;
  readonly VITE_SSO_APP_ID?: string;
  /** Must match the backend `APP_NAME` (CSRF header + refresh lock). */
  readonly VITE_APP_NAME?: string;
  /** PostHog project token — leave unset to keep analytics off. */
  readonly VITE_PUBLIC_POSTHOG_PROJECT_TOKEN?: string;
  readonly VITE_PUBLIC_POSTHOG_HOST?: string;
  /** Intercom app id — leave unset to keep the messenger off. */
  readonly VITE_INTERCOM_APP_ID?: string;
  readonly VITE_INTERCOM_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
