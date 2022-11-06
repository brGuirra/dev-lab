import type { JestConfigWithTsJest } from 'ts-jest';
// import { resolve } from 'node:path';

// const root = resolve(__dirname);
const config: JestConfigWithTsJest = {
  displayName: 'root-tests',
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest-setup.ts'],
  testMatch: ['<rootDir>/__tests__/**/*.test.ts', '<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@tests/(.*)': '<rootDir>/__tests__/$1',
  },
};

export default config;
