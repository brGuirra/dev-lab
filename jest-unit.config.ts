import type { JestConfigWithTsJest } from 'ts-jest';
import config from './jest.config';

const end2endConfig: JestConfigWithTsJest = {
  ...config,
  displayName: 'unit-tests',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
};

export default end2endConfig;
