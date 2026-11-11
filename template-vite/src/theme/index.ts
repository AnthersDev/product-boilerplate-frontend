/**
 * Theme
 *
 * Anthers components are styled with CSS variables, so the theme lives in CSS:
 * edit `theme.css` in this folder to change the brand colour, font and corner radius.
 * `src/index.css` imports it after the Anthers stylesheet.
 *
 * Not everything is a variable. The primary button's black gradient, for example, is fixed in Anthers.
 *
 * Using the tokens in your own code:
 * - Tailwind classes that Anthers already uses work as-is: `bg-brand-500`, `border-brand-300`, `rounded-xl`.
 * - For any other utility, reference the variable: `text-(--color-brand-600)`, `bg-(--color-brand-50)`.
 * - Inline styles: `style={{ color: 'var(--color-brand-600)' }}`.
 * - In JavaScript, for example chart colours: `readThemeToken(themeTokens.brand[500])`.
 */

export const themeTokens = {
  brand: {
    50: '--color-brand-50',
    100: '--color-brand-100',
    200: '--color-brand-200',
    300: '--color-brand-300',
    500: '--color-brand-500',
    600: '--color-brand-600',
    700: '--color-brand-700',
    800: '--color-brand-800',
    900: '--color-brand-900',
  },
  fontSans: '--font-sans',
  radius: {
    lg: '--radius-lg',
    xl: '--radius-xl',
  },
} as const;

/** Returns the current value of a theme CSS variable, such as `oklch(60% 0.18 250)`. */
export const readThemeToken = (token: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();
