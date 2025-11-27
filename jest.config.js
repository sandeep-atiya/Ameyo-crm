export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'services/**/*.js',
    'middleware/**/*.js',
    'routes/**/*.js',
    'controllers/**/*.js',
  ],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testTimeout: 10000,
};
