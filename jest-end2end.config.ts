import type { JestConfigWithTsJest } from 'ts-jest';
import config from './jest.config';

const end2endConfig: JestConfigWithTsJest = {
  ...config,
  displayName: 'end2end-tests',
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest-setup.ts'],
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
};

export default end2endConfig;
