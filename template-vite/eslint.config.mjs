import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import tsParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

import enforceStrokeWidth from './eslint-rules/enforce-stroke-width.mjs';
import enforceAllowedTextClasses from './eslint-rules/enforce-allowed-text-classes.mjs';
import enforceHookNaming from './eslint-rules/enforce-hook-naming.mjs';
import enforceEventHandlerNaming from './eslint-rules/enforce-event-handler-naming.mjs';
import enforceComponentPascalCase from './eslint-rules/enforce-component-pascal-case.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Lint rules follow Anthers-component conventions where they apply to apps:
 * https://github.com/AnthersDev/Anthers-component/blob/main/eslint.config.js
 *
 * Skipped on purpose for product apps (not the component library):
 * - import/no-default-export (pages use default exports for React.lazy)
 * - require-component-index / card-composition / component-variable naming
 *   (library folder layout rules)
 * - Interfaces must end in `Props` for every type (domain models stay AuthUser,
 *   AuthSession, etc.; React component prop types still use the `Props` suffix)
 */
export default [
  {
    ignores: [
      'node_modules',
      'coverage',
      'dist',
      'dev-dist',
      'public',
      '__mocks__',
      'tools',
      'eslint-rules',
      '.prettierrc.js',
      'commitlint.config.js',
      '*.d.ts',
      'postcss.config.js',
    ],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  jsxA11yPlugin.flatConfigs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
        ...globals.es2020,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      'local-rules': {
        rules: {
          'enforce-stroke-width': enforceStrokeWidth,
          'enforce-allowed-text-classes': enforceAllowedTextClasses,
          'enforce-hook-naming': enforceHookNaming,
          'enforce-event-handler-naming': enforceEventHandlerNaming,
          'enforce-component-pascal-case': enforceComponentPascalCase,
        },
      },
    },
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['UPPER_CASE'],
          filter: {
            regex: '^[A-Z0-9_]+$',
            match: true,
          },
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'has', 'should'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'typeMethod',
          format: ['camelCase'],
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
        },
      ],
      'local-rules/enforce-stroke-width': 'error',
      'local-rules/enforce-allowed-text-classes': 'error',
      'local-rules/enforce-hook-naming': 'error',
      'local-rules/enforce-event-handler-naming': 'error',
      'local-rules/enforce-component-pascal-case': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@/features/*/*'],
        },
      ],
    },
  },
];
