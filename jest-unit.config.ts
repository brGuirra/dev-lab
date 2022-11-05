import type { JestConfigWithTsJest } from 'ts-jest';
import { defaults } from 'jest-config';

const end2endConfig: JestConfigWithTsJest = {
  ...defaults,
  displayName: 'unit-tests',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
};

export default end2endConfig;
