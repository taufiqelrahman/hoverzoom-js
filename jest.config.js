export default {
  testEnvironment: "jsdom",
  transform: {},
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ["text", "lcov", "html"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
