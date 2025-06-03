// eslint.config.cjs
const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      },
      ecmaVersion: 2022,
      sourceType: 'script',
    },
    rules: {
      'no-console': 'off',
      'no-redeclare': ['error', { builtinGlobals: false }],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-undef': 'off'
    }
  }
];