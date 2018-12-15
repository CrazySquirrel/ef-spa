module.exports = {
  "bail": true,
  "verbose": true,

  "collectCoverage": true,
  "coverageReporters": ["json", "html", "lcov"],

  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/tests/",
    ".scss"
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

  "moduleNameMapper": {
    "^types(.*)$": "<rootDir>/src/types$1",
    "^components(.*)$": "<rootDir>/src/components$1",
    "^store(.*)$": "<rootDir>/src/store$1",
    "^webworker(.*)$": "<rootDir>/src/webworker$1",
    "^utils(.*)$": "<rootDir>/src/utils$1",
  },

  "transform": {
    "^.+\\.(ts|tsx)$": "<rootDir>/tests/test-preprocessor.js",
    "^.+\\.(svg)$": "jest-svg-transformer",
    "^.+\\.(css|less|scss)$": "<rootDir>/tests/test-style-mock.js",
  },

  "testMatch": [
    "**/*.test.(ts|tsx|js|jsx)"
  ]
};