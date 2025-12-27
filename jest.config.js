export default {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.ts$": "$1",
    "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
  transform: {
    "^.+\\.(js|ts)$": ["babel-jest", { configFile: "./babel.config.js" }],
  },
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/**/*.test.{js,ts}",
    "!src/**/*.d.ts",
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
  testMatch: ["**/__tests__/**/*.{js,ts}", "**/?(*.)+(spec|test).{js,ts}"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
