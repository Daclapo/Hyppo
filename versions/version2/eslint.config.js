import next from 'eslint-config-next';
import tseslint from '@typescript-eslint/eslint-plugin';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...next,
  {
    plugins: { '@typescript-eslint': tseslint },
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['.next', 'node_modules', 'supabase', '*.config.js'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
];
