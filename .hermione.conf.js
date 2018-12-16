const path = require('path');
const chai = require('chai');

const { getCurrentIP } = require('./utils');

chai.config.includeStack = true;
chai.config.truncateThreshold = 0;

global.assert = chai.assert;

require('dnscache')({enable: true, ttl: 1200});

module.exports = {
  baseUrl: `http://${getCurrentIP()}:7701`,
  gridUrl: 'http://localhost:4444/wd/hub',

  httpTimeout: 60000,
  sessionRequestTimeout: 120000,
  sessionQuitTimeout: 5000,

  waitTimeout: 15000,
  screenshotOnRejectTimeout: 5000,

  testsPerSession: 10,
  sessionsPerBrowser: 10,
  retry: 5,

  antialiasingTolerance: 4,

  screenshotsDir: (test) => path.join(path.dirname(test.file), 'screens', test.id(), test.browserId),

  sets: {
    desktop: {
      files: [
        'hermione/common/*.hermione.js',
        'hermione/desktop/*.hermione.js'
      ],
      browsers: ['chrome']
    },

    pad: {
      files: [
        'hermione/common/*.hermione.js',
        'hermione/pad/*.hermione.js'
      ],
      browsers: ['ipad-portrait', 'ipad-landscape']
    },

    phone: {
      files: [
        'hermione/common/*.hermione.js',
        'hermione/phone/*.hermione.js'
      ],
      browsers: ['iphone-portrait', 'iphone-landscape']
    }
  },

  browsers: require('./hermione/browsers'),

  plugins: {
    'hermione-skip-runner': {
      enabled: false,
      ignoreTestFail: true
    },
    'console-notifier/hermione': {
      logs: [
        {
          on: 'fail',
          color: 'bold.yellow'
        }
      ]
    },
    'hermione-faildump': {
      enabled: false,
      targetFile: 'faildump.json'
    },
    'html-reporter/hermione': {
      enabled: true,
      path: 'hermione-report',
      scaleImages: true,
      defaultView: 'failed'
    },
    'json-reporter/hermione': {
      enabled: false
    },
    'stat-reporter/hermione': {
      enabled: true,
      reporters: {
        flat: {
          enabled: true
        },
        html: {
          enabled: true,
          path: 'stat-reporter/hermione.html'
        },
        json: {
          enabled: true,
          path: 'stat-reporter/hermione.json'
        }
      }
    },
  }
};