import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ( {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [ '<rootDir>/src' ],
  collectCoverageFrom: [ 'src/**/*.ts', '!**/__mocks__/**', '!**/__tests__/**', '!src/services/*.ts', '!src/index.ts' ],
  coverageReporters: [ 'text', 'text-summary', 'html' ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 18.56,
      lines: 27,
      statements: 28
    }
  }
} );
