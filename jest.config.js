module.exports = {
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
  clearMocks: true,
  verbose: true,

  // Only the small pure helpers in utils/ are unit-tested for now.
  // main.js / index.js are mostly DOM glue and run at script-load time,
  // so they don't fit a Jest unit test cleanly.
  collectCoverageFrom: [
    "javascript/utils/**/*.js"
  ],

  coverageReporters: ["text", "text-summary", "lcov", "json-summary"],

  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};
