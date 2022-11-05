import type { JestConfigWithTsJest } from 'ts-jest';
import { resolve } from 'node:path';

const root = resolve(__dirname);
const config: JestConfigWithTsJest = {
  rootDir: root,
  displayName: 'root-tests',
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
};

export default config;
