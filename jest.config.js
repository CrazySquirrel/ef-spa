module.exports = {
  "bail": true,
  "verbose": true,

  "collectCoverage": true,
  "coverageReporters": ["json", "html"],
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/test/"
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
    "<rootDir>/test/test-shim.js",
    "<rootDir>/test/test-setup.js"
  ],

  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],

  "transform": {
    "^.+\\.(ts|tsx)$": "<rootDir>/test/test-preprocessor.js"
  },

  "testMatch": [
    "**/*.test.(ts|tsx|js|jsx)"
  ]
};