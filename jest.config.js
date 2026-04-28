export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/websocket.js',
    '!src/utils/constantsUtil.js'
  ],
  testMatch: ['**/tests/**/*.test.js'],
  transform: {},
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true
};
