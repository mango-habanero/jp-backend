module.exports = {
    env: {
        mocha: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:@typescript-eslint/strict',
        'plugin:@typescript-eslint/stylistic',
        'plugin:mocha/recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'import', 'mocha', 'prettier', 'simple-import-sort'],
    root: true,
    rules: {
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/no-unused-vars': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'mocha/no-exclusive-tests': 'error',
        'mocha/no-pending-tests': 'error',
        'mocha/no-skipped-tests': 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'prefer-promise-reject-errors': 'off',
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    // Node.js built-ins
                    ['^node:'],
                    // Side effect imports.
                    ['^\\u0000'],
                    // Parent imports. Put `..` last.
                    ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                    // Other relative imports. Put same-folder imports and `.` last.
                    ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                ],
            },
        ],
        'simple-import-sort/exports': 'error',
    },
    overrides: [
        {
            files: ['seed/**/*.ts', 'tests/**/*.ts'],
            parserOptions: {
                project: ['./tsconfig.json', './seed/tsconfig.json', './tests/tsconfig.json'],
            },
        },
    ],
    settings: {
        'import/resolver': {
            typescript: {
                project: './tsconfig.json'
            }
        }
    }
};
