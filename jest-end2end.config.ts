import type { JestConfigWithTsJest } from 'ts-jest';
import config from './jest.config';

const end2endConfig: JestConfigWithTsJest = {
  ...config,
  displayName: 'end2end-tests',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
};

export default end2endConfig;
