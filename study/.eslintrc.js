module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'prettier'],

  rules: {
    'react/react-in-jsx-scope': 'off', // 최상단 import React 관련 워닝 off
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 0,
    'prettier/prettier': ['error', { singleQuote: true }],
    '@typescript-eslint/no-empty-function': 'off',
  },
};
