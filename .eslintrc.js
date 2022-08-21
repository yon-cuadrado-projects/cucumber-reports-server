module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
    'jest': true,
    'jest/globals': true
  },
  'extends': [
    'eslint:all',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'react-app/jest',
    'prettier'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'project': 'tsconfig.json',
    'sourceType': 'module'
  },
  'plugins': [
    'eslint-plugin-import',
    'eslint-plugin-jsdoc',
    'eslint-plugin-prefer-arrow',
    '@typescript-eslint',
    'eslint-plugin-prettier'
  ],
  "ignorePatterns": [".eslintrc.js"],
  'rules': {
    '@typescript-eslint/array-type': [
      'error',
      {
        'default': 'array'
      }
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        'types': {
          'Object': {
            'message': 'Avoid using the `Object` type. Did you mean `object`?'
          },
          'Function': {
            'message': 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.'
          },
          'Boolean': {
            'message': 'Avoid using the `Boolean` type. Did you mean `boolean`?'
          },
          'Number': {
            'message': 'Avoid using the `Number` type. Did you mean `number`?'
          },
          'String': {
            'message': 'Avoid using the `String` type. Did you mean `string`?'
          },
          'Symbol': {
            'message': 'Avoid using the `Symbol` type. Did you mean `symbol`?'
          }
        }
      }
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        'accessibility': 'explicit',
        'overrides': {
          'accessors': 'explicit',
          'constructors': 'explicit',
          'parameterProperties': 'explicit'
        }
      }
    ],
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        'ObjectExpression': 'first',
        'FunctionDeclaration': {
          'parameters': 'first'
        },
        'FunctionExpression': {
          'parameters': 'first'
        },
        'MemberExpression': 1,
        'ImportDeclaration': 'first'
      }
    ],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        'multiline': {
          'delimiter': 'semi',
          'requireLast': true
        },
        'singleline': {
          'delimiter': 'semi',
          'requireLast': false
        }
      }
    ],
    '@typescript-eslint/no-inferrable-types': [
      'error',
      {
        'ignoreParameters': true
      }
    ],
    '@typescript-eslint/no-shadow': [
      'error',
      {
        'hoist': 'all'
      }
    ],
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        'avoidEscape': true
      }
    ],
    '@typescript-eslint/semi': [
      'error',
      'always'
    ],
    '@typescript-eslint/triple-slash-reference': [
      'error',
      {
        'path': 'always',
        'types': 'prefer-import',
        'lib': 'always'
      }
    ],
    '@typescript-eslint/consistent-type-assertions': [ 'error', { assertionStyle: 'angle-bracket', objectLiteralTypeAssertions: 'allow' } ],
    '@typescript-eslint/naming-convention': [ 'warn', { format: [ 'camelCase' ], selector: 'variableLike', custom: { regex: 'ObjectId|mime_type', match: false } } ],
    '@typescript-eslint/require-array-sort-compare': [ 'warn', { ignoreStringArrays: true } ],
    '@typescript-eslint/no-misused-promises': [ 'error', { 'checksVoidReturn': false } ],
    '@typescript-eslint/restrict-template-expressions': [ 'error', { allowBoolean: true } ],
    'brace-style': [ 'error', '1tbs' ],
    'array-bracket-spacing': [ 'warn', 'always' ],
    'max-classes-per-file': [ 'error', 1 ],
    'max-len': [ 'error', { 'ignorePattern': '\\s*from|class [a-zA-Z]+ implements|\\s*\\* |\\s*// ', 'code': 190 } ],
    'no-console': [ 'error', {
      'allow': [
        'log',
        'warn',
        'dir',
        'timeLog',
        'assert',
        'clear',
        'count',
        'countReset',
        'group',
        'groupEnd',
        'table',
        'dirxml',
        'error',
        'groupCollapsed',
        'Console',
        'profile',
        'profileEnd',
        'timeStamp',
        'context'
      ]
    }
    ],
    'no-plusplus': [ 'error', { 'allowForLoopAfterthoughts': true } ],
    'object-curly-spacing': [ 'error', 'always', { 'objectsInObjects': true } ],
    'one-var': [ 'error', 'never' ],
    'prefer-arrow/prefer-arrow-functions': 'error',
    'space-in-parens': [ 'error', 'always' ],
    'spaced-comment': [ 'error', 'always', { 'markers': [ '/' ] } ],
    'no-underscore-dangle': [ 'off', { 'allow': [ '_id', '_model' ] } ],
    'max-statements': [ 'error', 21 ],
    'camelcase': [ 'error', { allow: [ 'mime_type', 'not_defined', 'error_message' ] } ],
    'space-before-function-paren': [ 'error', 'always' ],
    'comma-dangle': [ 'error', 'never' ],
    '@typescript-eslint/no-floating-promises': [ 'error', { ignoreIIFE: true } ],
    'import/no-duplicates': [ 'error'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/no-type-alias': 'off',
    '@typescript-eslint/consistent-indexed-object-style': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-magic-numbers': 'off',
    'multiline-comment-style': 'off',
    'prefer-readonly-parameter-types': 'off',
    'no-ternary': 'off',
    'no-undefined': 'off',
    'class-methods-use-this': 'off',
    'max-lines-per-function': 'off',
    'max-params': 'off',
    'capitalized-comments': 'off',
    'max-lines': 'off',
    'prefer-destructuring': 'off',
    'complexity': 'off',
    'max-depth': 'off',
    'new-cap': 'off',
    'sort-keys': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'prettier/prettier': [ 'off' ],
    'no-duplicate-imports': [ 'off' ],
    'no-shadow': [ 'off' ]
  },
  'overrides': [
    {
      'files': [ 'test/cucumber/step-definitions/*.ts' ],
      'excludedFiles': '*.*-steps.ts',
      'rules': {
        'prefer-arrow/prefer-arrow-functions': [ 'off' ]
      }
    },
    {
      'files': [
        'test/unit/*.ts',
        'src/lib/generate-report/helpers/generate-html.ts',
        'src/lib/mongoose-report-manager/mongoose-queries.ts'
      ],
      'excludedFiles': '*.*.ts',
      'rules': {
        'sort-keys': [ 'off' ]
      }
    },
    {
      'files': [ 'test/unit/*-spec.ts' ],
      'rules': {
        'max-lines-per-function': [ 'off' ]
      }
    }
  ]
};
