/**
 * Product branding used by the auth screens. Replace these per product.
 * Files referenced from `public/` resolve against Vite's base path.
 */
export const brand = {
  name: 'Your App',
  /** Wordmark shown on the login and organization picker. Rendered 64px tall, so keep the artwork vertically centred. */
  logo: `${import.meta.env.BASE_URL}logo.svg`,
  /** Optional link for the login logo, e.g. the product's marketing site. */
  logoLink: undefined as string | undefined,
  loginBackgroundImage: `${import.meta.env.BASE_URL}login-background.svg`,
  supportEmail: 'support@example.com',
  supportUrl: 'mailto:support@example.com',
} as const;
