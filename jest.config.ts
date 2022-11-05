import type { JestConfigWithTsJest } from 'ts-jest';
import { resolve } from 'node:path';

const root = resolve(__dirname);
const config: JestConfigWithTsJest = {
  rootDir: root,
  displayName: 'root-tests',
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', 'src'],
};

export default config;
