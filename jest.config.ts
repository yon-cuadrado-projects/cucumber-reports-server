import type { Config } from '@jest/types';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (): Promise<Config.InitialOptions> => ( {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: [ 'src/lib/**/**/*.ts' ],
  coverageReporters: [ 'text', 'text-summary', 'html', 'lcov' ],
  testTimeout: 40000,
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 18.56,
      lines: 27,
      statements: 28
    }
  },
  projects: [ '<rootDir>/packages/backend/jest.config.ts', '<rootDir>/packages/frontend/jest.config.ts' ],
  testEnvironmentOptions: {
    url: 'https://localhost/'
  }
} );
