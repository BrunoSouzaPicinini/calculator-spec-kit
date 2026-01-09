export default {
  rootDir: '..',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/integration/'],
  collectCoverageFrom: [
    '<rootDir>/calculator-site/**/*.js',
    '!<rootDir>/calculator-site/ui.js',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    './calculator-site/calculator.js': {
      branches: 84,
      functions: 88,
      lines: 92,
      statements: 84,
    },
  },
};
