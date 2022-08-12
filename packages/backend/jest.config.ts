import type { Config } from '@jest/types';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (): Promise<Config.InitialOptions> => ( {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [ '<rootDir>/' ],
  testMatch: [ '<rootDir>/test/unit/*spec.ts' ],
  collectCoverageFrom: [ 'src/lib/**/**/*.ts' ],
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
