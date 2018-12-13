module.exports = {
  "bail": true,
  "verbose": true,

  "collectCoverage": true,
  "coverageReporters": ["json", "html"],
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/tests/"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 50,
      "functions": 50,
      "lines": 50,
      "statements": 50
    },
    "./src/components/": {
      "branches": 40,
      "statements": 40
    }
  },

  "setupFiles": [
    "<rootDir>/tests/test-shim.js",
    "<rootDir>/tests/test-setup.js"
  ],

  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],

  "transform": {
    "^.+\\.(ts|tsx)$": "<rootDir>/tests/test-preprocessor.js"
  },

  "testMatch": [
    "**/*.test.(ts|tsx|js|jsx)"
  ]
};