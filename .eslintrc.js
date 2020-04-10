module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off', // can be inferred implicitly
    '@typescript-eslint/no-explicit-any': 'off', // we need to sometimes get off the type system
    'import/no-unresolved': 'off', // typescript already knows what imports resolve
    '@typescript-eslint/interface-name-prefix': 'off', // we need to use I prefixed interfaces
  },
};
