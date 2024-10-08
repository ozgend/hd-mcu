module.exports = {
  root: true,
  extends: 'plugin:import/typescript',
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {},
      typescript: {
        project: './tsconfig.dev.json',
        alwaysTryTypes: true,
      },
    },
  },
  ignorePatterns: [
    '*.js',
    '*.d.ts',
    'node_modules/',
    '*.generated.ts',
    'coverage',
  ],
  rules: {
    'max-len': 'off',
    indent: ['off'],
    '@typescript-eslint/indent': ['error', 2],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    'no-multi-spaces': [
      'error',
      {
        ignoreEOLComments: false,
      },
    ],
    'array-bracket-spacing': ['error', 'never'],
    'array-bracket-newline': ['error', 'consistent'],
    'object-curly-spacing': ['error', 'always'],
    'object-curly-newline': [
      'error',
      {
        multiline: true,
        consistent: true,
        ImportDeclaration: 'never',
        ExportDeclaration: 'always',
      },
    ],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: true,
      },
    ],
    'keyword-spacing': ['error'],
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true,
      },
    ],
    'space-before-blocks': ['error'],
    curly: ['error', 'multi-line', 'consistent'],
    '@typescript-eslint/member-delimiter-style': ['error'],
    semi: ['error', 'always'],
    'quote-props': ['error', 'consistent-as-needed'],
    '@typescript-eslint/no-require-imports': ['error'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/test/**',
          '**/build-tools/**',
          '.projenrc.ts',
          'projenrc/**/*.ts',
        ],
        optionalDependencies: false,
        peerDependencies: true,
      },
    ],
    'import/no-unresolved': ['error'],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'no-duplicate-imports': ['error'],
    'no-shadow': ['off'],
    '@typescript-eslint/no-shadow': ['error'],
    'key-spacing': ['error'],
    'no-multiple-empty-lines': ['error'],
    '@typescript-eslint/no-floating-promises': ['error'],
    'no-return-await': ['off'],
    '@typescript-eslint/return-await': ['error'],
    'no-trailing-spaces': ['error'],
    'dot-notation': ['error'],
    'no-bitwise': ['error'],
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'public-static-field',
          'public-static-method',
          'protected-static-field',
          'protected-static-method',
          'private-static-field',
          'private-static-method',
          'field',
          'constructor',
          'method',
        ],
      },
    ],
  },
};
