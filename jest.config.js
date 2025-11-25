module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'services/**/*.js',
    'middleware/**/*.js',
    'routes/**/*.js',
    'controllers/**/*.js'
  ],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  testTimeout: 10000
};
