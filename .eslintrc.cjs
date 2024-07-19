/* eslint-env node */
module.exports = {
    env: {
        mocha: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/strict',
        'plugin:@typescript-eslint/stylistic',
        'plugin:mocha/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'mocha'],
    root: true,
    rules: {
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/no-unused-vars': 'error',
        'mocha/no-exclusive-tests': 'error',
        'mocha/no-pending-tests': 'error',
        'mocha/no-skipped-tests': 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'prefer-promise-reject-errors': 'off',
    },
};
