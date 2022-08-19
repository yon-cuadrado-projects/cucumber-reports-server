import type { Config } from '@jest/types';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (): Promise<Config.InitialOptions> => ( {
  verbose: true,
  rootDir: 'src',
  modulePaths: [ '<rootDir>', '<rootDir>/hooks' ],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageReporters: [ 'text', 'text-summary', 'lcov', 'html' ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: -300
    }
  },
  testTimeout: 40000,
  coveragePathIgnorePatterns: [
    'node_modules',
    'hooks',
    'services',
    'constants',
    'containers',
    'common',
    'context',
    'gql',
    'routes',
    'utils',
    'reportWebVitals.js',
    'i18n.tsx',
    'App.tsx',
    'index.tsx'
  ],
  coverageDirectory: '<rootDir>/../coverage/',
  moduleFileExtensions: [ 'js', 'jsx', 'ts', 'tsx' ],
  testPathIgnorePatterns: [ '/node_modules/', './build' ],
  testRegex: '.*.(test|spec).(j|t)s[x]?$',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform'
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(scss|sass|css)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: [ '@testing-library/jest-dom/extend-expect' ]
} );
