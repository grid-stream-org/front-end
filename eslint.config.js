import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import eslintPluginImport from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['**/build', '**/dist', '**/node_modules', 'eslint.config.js'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: '18.3' },
    },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      'react': pluginReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
      'import': eslintPluginImport,
    },
    rules: {
      'prefer-arrow-callback': ['error'],
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
      'prettier/prettier': ['error'],
      ...prettierConfig.rules,
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
)
