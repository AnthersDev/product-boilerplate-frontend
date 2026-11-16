import fs from 'fs/promises';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import eslint from 'vite-plugin-eslint';
import { VitePWA } from 'vite-plugin-pwa';

const { PORT = '3000' } = process.env;

const root = path.resolve(__dirname, 'src');

/** Display name. Keep in sync with `brand.name` in src/config/brand.ts. */
const appName = 'Your App';

const translationFlushMarker =
  'async function runWithTranslationSafeDom(action, defaultLanguage = getGTranslateDefaultLanguage()) {';

const translationFlushBypass = `if (!isGTranslateActive() && !isGTranslateDomTranslated()) {
    const actionResult = action();
    return actionResult instanceof Promise ? await actionResult : actionResult;
  }`;

/**
 * Anthers calls flushSync while painting the organization list. That warns in dev
 * even though Google Translate is off. Skip the flush unless translation is active.
 * Dev uses the esbuild prebundle; production uses the transform below.
 */
const patchTranslationFlush = (code: string) => {
  if (!code.includes(translationFlushMarker) || code.includes('!isGTranslateActive() && !isGTranslateDomTranslated()')) {
    return code;
  }
  return code.replace(translationFlushMarker, `${translationFlushMarker}\n  ${translationFlushBypass}`);
};

const skipTranslationFlushWhenIdle = (): Plugin => ({
  name: 'skip-translation-flush-when-idle',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('gtranslateEngine.js')) return null;
    const patched = patchTranslationFlush(code);
    return patched === code ? null : patched;
  },
});

const vitePluginPWA = () =>
  VitePWA({
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    // The dev worker is served as text/html, so registration fails in the console.
    devOptions: {
      enabled: false,
    },
    workbox: {
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
    },
    manifest: {
      name: appName,
      short_name: appName,
      description: appName,
      theme_color: '#ffffff',
      icons: [
        {
          src: '/logo.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any',
        },
      ],
    },
  });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), eslint(), skipTranslationFlushWhenIdle(), vitePluginPWA()],
  server: {
    host: '0.0.0.0',
    port: parseInt(PORT, 10),
  },
  resolve: {
    alias: {
      '@/': `${root}/`,
    },
  },
  esbuild: {
    loader: 'tsx',
    include: 'src/**/*.{ts,tsx,js,jsx}',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
      },
      plugins: [
        {
          name: 'skip-translation-flush-when-idle',
          setup(build) {
            build.onLoad({ filter: /gtranslateEngine\.js$/ }, async (args) => ({
              contents: patchTranslationFlush(await fs.readFile(args.path, 'utf8')),
              loader: 'js',
            }));
          },
        },
      ],
    },
  },
});
