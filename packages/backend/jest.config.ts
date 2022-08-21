import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [ '<rootDir>/' ],
  testMatch: [ '<rootDir>/test/unit/*spec.ts' ],
  collectCoverageFrom: [ 'src/lib/**/**/*.ts' ],
  coverageReporters: [ 'text', 'text-summary', 'html' ],
  testTimeout: 40000,
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 18.56,
      lines: 27,
      statements: 28
    }
  }
};

export default config;
