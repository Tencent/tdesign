const path = require('path');

const PACKAGES_ROOT = path.resolve(__dirname, '../../../../../../../tdesign-miniprogram/packages');
const COMPONENTS_ROOT = path.join(PACKAGES_ROOT, 'components');
const PRO_COMPONENTS_CHAT_ROOT = path.join(PACKAGES_ROOT, 'pro-components/chat');

module.exports = {
  rootDir: __dirname,
  verbose: true,
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>/**/*.test.{js,ts}'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { configFile: path.resolve(__dirname, './babel.config.cjs') }],
  },
  transformIgnorePatterns: [],
  moduleNameMapper: {
    '^tdesign-miniprogram/(chat-.*)': path.join(PRO_COMPONENTS_CHAT_ROOT, '$1'),
    '^tdesign-miniprogram/(attachments.*)': path.join(PRO_COMPONENTS_CHAT_ROOT, '$1'),
    '^tdesign-miniprogram/(.*)': path.join(COMPONENTS_ROOT, '$1'),
    '^tdesign-miniprogram$': path.join(COMPONENTS_ROOT, 'index'),
    '^@behaviors/(.*)': path.resolve(__dirname, '../../../../../../../tdesign-miniprogram/packages/tdesign-miniprogram/example/behaviors/$1'),
  },
  setupFiles: ['<rootDir>/setup.js'],
  globals: {
    CONFIG_PREFIX: 't',
  },
  globalSetup: '<rootDir>/globalSetup.cjs',
  snapshotSerializers: ['miniprogram-simulate/jest-snapshot-plugin'],
};
