/* eslint-env node */
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/strict',
        'plugin:@typescript-eslint/stylistic',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: true,
      tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint'],
    root: true,
};