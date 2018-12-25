# Even Faster Single Page Application: 6.Optimizations and CI

https://www.linkedin.com/pulse/even-faster-single-page-application-5monitoring-sergei-iastrebov/

Last time we add test infrastructure and write few simple tests.

https://github.com/CrazySquirrel/ef-spa/commit/ffd32469077265b9822a606c2e9bb8c9d2f21584

https://github.com/CrazySquirrel/ef-spa/commit/6b63f6efcc14ad5cae03d284dd17135a7d209ef2

https://github.com/CrazySquirrel/ef-spa/commit/29c76a25dc4582a782f9637f0a356d3afce328d8

This time we going to talk about optimizations.

## 6.1 Hermione

Last time we set up hermione, but it require local browser to run tests and it wasn't so useful. Let's fix it and configurate hermione with docker.

First of all we going to change hermione config file (**.hermione.conf.js**):

```
const path = require('path');
const chai = require('chai');

const { getCurrentIP } = require('./utils');

chai.config.includeStack = true;
chai.config.truncateThreshold = 0;

global.assert = chai.assert;

require('dnscache')({enable: true, ttl: 1200});

module.exports = {
  // which address to open by /
  baseUrl: `http://${getCurrentIP()}:7701`,

  // selenium grig url
  gridUrl: 'http://localhost:4444/wd/hub',

  // browsers timeouts
  httpTimeout: 60000,
  sessionRequestTimeout: 120000,
  sessionQuitTimeout: 5000,

  // test timeouts
  waitTimeout: 15000,
  screenshotOnRejectTimeout: 5000,

  // parallel test settings
  testsPerSession: 10,
  sessionsPerBrowser: 10,
  retry: 5,

  // screenshot compare tolerance
  antialiasingTolerance: 4,

  // where to store screenshots
  screenshotsDir: (test) => path.join(path.dirname(test.file), 'screens', test.id(), test.browserId),

  // test sets (grouping test file by types, usually by platforms: commons, desktops, tablets, phone)
  sets: {
    // desktop tests
    desktop: {
      // test set file masks
      files: [
        'hermione/common/*.hermione.js',
        'hermione/desktop/*.hermione.js'
      ],
      // test set defeult browsers
      browsers: ['chrome']
    },

    // pad tests
    pad: {
      // test set file masks
      files: [
        'hermione/common/*.hermione.js',
        'hermione/pad/*.hermione.js'
      ],
      browsers: ['ipad-portrait', 'ipad-landscape']
    },

    // phone tests
    phone: {
      // test set file masks
      files: [
        'hermione/common/*.hermione.js',
        'hermione/phone/*.hermione.js'
      ],
      // test set defeult browsers
      browsers: ['iphone-portrait', 'iphone-landscape']
    }
  },

  // browsers settings
  browsers: require('./hermione/browsers'),

  // plugins for hermione
  plugins: {
    // plugin for tests skip
    'hermione-skip-runner': {
      enabled: false,
      ignoreTestFail: true
    },
    // plugin to show test report in console
    'console-notifier/hermione': {
      logs: [
        {
          on: 'fail',
          color: 'bold.yellow'
        }
      ]
    },
    // plugin for report dump
    'hermione-faildump': {
      enabled: false,
      targetFile: 'faildump.json'
    },
    // plugin for html report
    'html-reporter/hermione': {
      enabled: true,
      path: 'hermione-report',
      scaleImages: true,
      defaultView: 'failed'
    },
    // plugin for json report
    'json-reporter/hermione': {
      enabled: false
    },
    // plugin for stat report
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
```

Here we add:

* chai - for better checks
* baseUrl - so we would be able to call /
* gridUrl - selenium grid url
* timeouts - different request and test timeouts
* retries
* image diff tolerance
* relative screenshot part - so screenshots will be near test
* different test sets and browsers
* different report plugins

Also as you might noticed we save browsers settings in a different file and add getCurrentIP method for base url (I'll explain it later)

**hermione/browsers.js**

```
module.exports = {
  'chrome': {
    desiredCapabilities: {
      browserName: 'chrome',
      calibrate: true,
      compositeImage: true,
      screenshotMode: 'viewport',
      windowSize: '1280x1024',
      meta: {
        platform: 'desktop'
      }
    }
  },
  'ipad-portrait': {
    desiredCapabilities: {
      browserName: 'chrome',
      calibrate: true,
      compositeImage: true,
      screenshotMode: 'viewport',
      orientation: 'portrait',
      meta: {
        platform: 'touch-pad'
      },
      'goog:chromeOptions': {
        mobileEmulation: {
          deviceMetrics: {
            width: 768,
            height: 1024,
            pixelRatio: 2.0
          },
          userAgent: [
            'Mozilla/5.0',
            '(iPad; CPU OS 10_2_1 like Mac OS X)',
            'AppleWebKit/602.4.6',
            '(KHTML, like Gecko)',
            'Version/10.0',
            'Mobile/14D27',
            'Safari/602.1'
          ].join(' ')
        }
      }
    }
  },
  'ipad-landscape': {
    desiredCapabilities: {
      browserName: 'chrome',
      calibrate: true,
      compositeImage: true,
      screenshotMode: 'viewport',
      orientation: 'landscape',
      meta: {
        platform: 'touch-pad'
      },
      'goog:chromeOptions': {
        mobileEmulation: {
          deviceMetrics: {
            width: 1024,
            height: 768,
            pixelRatio: 2.0
          },
          userAgent: [
            'Mozilla/5.0',
            '(iPad; CPU OS 10_2_1 like Mac OS X)',
            'AppleWebKit/602.4.6',
            '(KHTML, like Gecko)',
            'Version/10.0',
            'Mobile/14D27',
            'Safari/602.1'
          ].join(' ')
        }
      }
    }
  },
  'iphone-portrait': {
    desiredCapabilities: {
      browserName: 'chrome',
      calibrate: true,
      compositeImage: true,
      screenshotMode: 'viewport',
      orientation: 'portrait',
      meta: {
        platform: 'touch-phone'
      },
      'goog:chromeOptions': {
        mobileEmulation: {
          deviceMetrics: {
            width: 320,
            height: 568,
            pixelRatio: 2.0
          },
          userAgent: [
            'Mozilla/5.0',
            '(iPhone; CPU iPhone OS 10_1_1 like Mac OS X)',
            'AppleWebKit/602.2.14',
            '(KHTML, like Gecko)',
            'Version/10.0',
            'Mobile/14B100',
            'Safari/602.1'
          ].join(' ')
        }
      }
    }
  },
  'iphone-landscape': {
    desiredCapabilities: {
      browserName: 'chrome',
      calibrate: true,
      compositeImage: true,
      screenshotMode: 'viewport',
      orientation: 'landscape',
      meta: {
        platform: 'touch-phone'
      },
      'goog:chromeOptions': {
        mobileEmulation: {
          deviceMetrics: {
            width: 568,
            height: 320,
            pixelRatio: 2.0
          },
          userAgent: [
            'Mozilla/5.0',
            '(iPhone; CPU iPhone OS 10_1_1 like Mac OS X)',
            'AppleWebKit/602.2.14',
            '(KHTML, like Gecko)',
            'Version/10.0',
            'Mobile/14B100',
            'Safari/602.1'
          ].join(' ')
        }
      }
    }
  }
};
```

New browser settings for desktop, pad and phone tests.

**docker-compose-selenium.yml**

```
version: "3"
services:
  selenium-hub:
    image: selenium/hub
    container_name: selenium-hub
    ports:
      - "4444:4444"
  chrome:
    image: selenium/node-chrome
    depends_on:
      - selenium-hub
    environment:
      - HUB_PORT_4444_TCP_ADDR=selenium-hub
      - HUB_PORT_4444_TCP_PORT=4444
```

Docker compose file for Selenium grid for Hermione.

Also we replaced the way how we start Hermione test; instead simple hermione call, we run node js script:

```
"test:hermione": "node ./hermione/index.js",
```

**hermione/index.js**

```
const path = require('path');
const {spawn, spawnSync} = require('child_process');

const { getCurrentIP } = require('../utils');

console.log(getCurrentIP());

const server = spawn('node', ['server.js'], {
  cwd: path.resolve(__dirname, '../'),
  checkCWD: true,
  stdio: 'ignore',
  detached: true
});

const steps = [
  'node ./hermione/wait-for-server.js',
  'docker-compose -f docker-compose-selenium.yml up -d --force-recreate',
  'node ./hermione/wait-for-grid.js',
  `./node_modules/.bin/hermione ${process.argv.slice(2).join(' ')}`,
  'docker-compose -f docker-compose-selenium.yml down'
];

let code = 0;

for (const step of steps) {
  const {error} = spawnSync(step, {
    cwd: path.resolve(__dirname, '../'),
    checkCWD: true,
    stdio: 'inherit',
    shell: true
  });

  if (error) {
    code = 1;
    break;
  }
}

server.kill();

process.exit(code);
```

We also add two helper scripts for waiting grid and server to up:

**wait-for-grid.js**

```
const http = require('http');
const process = require('process');

function wait() {
  return new Promise((resolve, reject) => {
    console.log('Waiting for the Grid');

    setTimeout(() => {
      http.get('http://localhost:4444/wd/hub/status', (resp) => {
        let data = '';

        resp.on('data', (chunk) => data += chunk);

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          if (JSON.parse(data).value.ready !== true) {
            reject(new Error('Not ready'));
          } else {
            resolve();
          }
        });

      }).on('error', reject);
    }, 1000);
  })
  .catch(wait);
}

wait()
.then(() => console.log('Selenium Grid is up'))
.then(() => process.exit(0));
```

**wait-for-server.js**

```
const http = require('http');
const process = require('process');

const serverConfig = require('../server.config.json');

process.env.NODE_ENV = serverConfig.apps[0].env.NODE_ENV || 'production';

const PORTS = serverConfig.apps[0][process.env.NODE_ENV].PORTS;

function wait() {
  return new Promise((resolve, reject) => {
    console.log('Waiting for the Server');

    setTimeout(() => {
      http.get(`http://localhost:${PORTS.HTTP}/`, (resp) => {
        let data = '';

        resp.on('data', (chunk) => data += chunk);

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve();
        });

      }).on('error', reject);
    }, 1000);
  })
  .catch(wait);
}

wait()
.then(() => console.log('Server is up'))
.then(() => process.exit(0));
```

And the last part, that we add to make Hermione work in docker, is getCurrentIP:

```
const os = require('os');

// Get current os ip address
function getCurrentIP() {
  const ifaces = os.networkInterfaces();

  for (const ifname in ifaces) {
    if (ifaces.hasOwnProperty(ifname)) {
      for (const iface of ifaces[ifname]) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addressescontinue;
        }

        return iface.address;
      }
    }
  }

  return '127.0.0.1';
}

module.exports = {
  getCurrentIP
};
};
```

This is actually the fancy solution for Mac Docker localhost problem; when we can't access localhost from docker on Mac, but can access Mac IP.

Basically that's it. Now Hermione can be run on CI and locally in docker.

## 6.2 Jest

Last time we added Jest and wrote simple test, and it wasn't so useful. This time we add few improvements (better transforms, coverage and etc.), added components and wrote more tests.

**jest.config.js**

```
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
```

Here we added:

* more coverage reports - for CI
* aliases - because we use them in webpack
* transformations for svg and styles

**test-preprocessor.js**

```
const tsc = require('typescript');
const tsConfig = require('../tsconfig.json');

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      return tsc.transpile(src, tsConfig.compilerOptions, path, []);
    }
    return src;
  },
};
```

**test-shim.js**

```
const glob = require('glob');

const PACKAGE = require('../package.json');
const WebManifest = require('../public/favicon/site.webmanifest.json');
const serverConfig = require('../server.config.json');

const Pages = glob.sync('./src/pages/**/index.tsx').map((v) => {
  return v.replace('./src/', '');
});

const serviceWorkerCachePaths = [
  ...Pages.map((v) => v.replace('pages/', '/').replace('/index.tsx', '/')),
  '/static/index.css',
  '/static/index.js',
  ...glob.sync('./public/favicon/**/*.*').map((v) => {
    return v.replace('./public/', '/');
  })
].filter((v, i, a) => a.indexOf(v) === i);

global.name = PACKAGE.name;
global.version = PACKAGE.version;
global.target = 'client';
global.mode = 'production';
global.webmanifest = WebManifest;
global.serviceWorkerCachePaths = serviceWorkerCachePaths;
global.sentry = serverConfig.apps[0].SENTRY;
global['process.env.NODE_ENV'] = 'production';

global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
```

Here we add few global variables that we use in code.

**test-style-mock.js**

```
module.exports = {
  process() {
    return '';
  }
};
```

For styles we add empty transformations, because we don't need them in our jest tests.

## 6.3 Server rendering

For server we add few changes for certificates usage and rendering:

**server.js**

```
// Get certificates
const certificates = getCertificates();

// Check certificates
if (certificates) {
  // If we've any certificates

  // Set up http to http2 switcher
  NET.createServer((conn) => {
    conn.once('data', (buf) => {
      const proxy = NET.createConnection(
          buf[0] === 22 ? PORTS.HTTP2 : PORTS.HTTP,
          () => {
            proxy.write(buf);
            conn.pipe(proxy).pipe(conn);
          }
      );
    });
  }).listen(PORTS.MAIN);

  // Set up http to https switcher
  HTTP.createServer(APP).listen(PORTS.HTTP);

  // Start http2 server
  SPDY.createServer(getCertificates(), APP).listen(PORTS.HTTP2);
} else {
  // If we don't have any certificates

  // Set up http server
  HTTP.createServer(APP).listen(PORTS.HTTP);
}
```

Basically we need those changes to run hermione tests in CI, because we don't have proper certificates there.

**server/render/index.js**

```
'use strict';

const FS = require('fs');
const PATH = require('path');
const MINIFY_HTML = require('html-minifier').minify;

// Get static path
const STATIC = __dirname + '/../../build';

// Get json serialize
const serialize = require('serialize-javascript');

// Import react decencies
const {createElement: h} = require('react');
const {renderToString} = require('react-dom/server');
const {StaticRouter} = require('react-router-dom');
const {createStore} = require('redux');
const {Provider} = require('react-redux');

// React server side render method
function render({url, csrf}) {
  // Clear server bundle cachedelete require.cache[require.resolve(STATIC + '/server/index.js')];// Get server bundleconst App = require(STATIC + '/server/index.js').default;// Create react storeconst store = createStore(
      (state) => JSON.parse(JSON.stringify(state)),
      {
        location: url,
        csrf
      }
  );
  // Create context objectconst context = {};// Render react appconst result = renderToString(
      h(
          Provider,
          {store},
          h(
              StaticRouter,
              {
                location: url,
                context
              },
              h(App)
          )
      )
  );
  // Return current context, store and app htmlreturn {context, store, result};
}

// Export express subroutines
module.exports = (APP, RAVEN) => {
  // Use server side rendering as fallback for all routs
  APP.get('*', (req, res) => {
    try {
      // Server side renderconst {context, result, store} = render({
        url: req.url.replace('index.html', ''),
        csrf: req.csrfToken(),
        aside: true
      });

      if (context.url) {
        // If context contains redirect, go ot it
        res.redirect(302, context.url);
      } else {
        // Render htmlPromise.all(
            [
              'static/index.html',
              'static/inline.css',
              'static/inline.js',
              'static/sprite.svg',
            ].map(file => {
              // Get bundlesreturn new Promise((_resolve) => {return FS.readFile(
                    PATH.resolve(STATIC, file), 'utf8',
                    (err, out) => err ? _resolve('') : _resolve(out)
                );
              });
            })
        ).then(([
          HTML,
          INLINE_STYLE,
          INLINE_SCRIPT,
          SVG
        ]) => {
          // Replace placeholders in html templateconst html = MINIFY_HTML(
              HTML
              .replace(/%INLINE_STYLE%/ig, INLINE_STYLE)
              .replace(/%INLINE_SCRIPT%/ig, INLINE_SCRIPT)
              .replace(/%APP%/ig, result)
              .replace(/%SVG_SPRITE%/ig, SVG)
              .replace(/%PRELOADED_STATE%/ig, serialize(store.getState())),
              {

                removeComments: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeEmptyAttributes: true,
                minifyJS: true
              }
          );
          // Response rendered html
          res.set('content-type', 'text/html');
          res.send(html);
        });
      }
    } catch (e) {
      RAVEN.captureException(e);

      res.writeHead(500);
      res.end();
    }
  });
};
```

In server rendering we added:

* html optimization
* svg sprite
* and correct location

## 6.4 Webpack

For webpack we added cache-loader to make local reassembling faster. https://github.com/webpack-contrib/cache-loader

## 6.5 Git

To protect code in repository we add few changes in our github.

First of all we add protection for master branch.

![](./1.png)

Also we add few required check for pull requests:

* code review
* codeclimate check
* travis CI

## 6.6 CodeClimate

_Code Climate’s engineering process insights and automated code review for GitHub and GitHub Enterprise help you ship better software, faster._

Basically this thing allow you to run check on your code in repository and track its status.

To know more about it do to https://codeclimate.com/ and try Quality section.

![](./2.png)
![](./3.png)
![](./4.png)

To make it work we just added .codeclimate.yml into our repository and follow integration steps on https://codeclimate.com/

**.codeclimate.yml**

```
engines:
  editorconfig:
    enabled: true
  eslint:
    enabled: true
  markdownlint:
    enabled: true
  nodesecurity:
    enabled: true
  tslint:
    enabled: true
    config: tslint.json
ratings:
  paths:
    - src/**
exclude_paths:
  - .cache-loader/
  - build/
  - config/
  - coverage/
  - hermione/
  - hermione-report/
  - node_modules/
  - src/**/*.test.tsx
  - src/**/*.test.ts
  - src/**/__snapshots__
  - stat-reporter/
  - tests/
  - .babelrc
  - .codeclimate.yml
  - .eslintrc.json
  - .gitattributes
  - .gitignore
  - .hermione.conf.js
  - CHANGELOG.md
  - docker-compose-selenium.yml
  - err.log
  - jest.config.js
  - LICENSE.md
  - out.log
  - package.json
  - package-lock.json
  - server.config.json
  - STYLE_GUIDE.xml
  - tsconfig.json
  - tslint.json
```

Here we simply specify which checks to run, what directory watch and what paths to ignore.

## 6.7 Travis CI

_Test and Deploy with Confidence_

Basically Travis allow you to run any scripts for branches and pull requests, like: assembling, testing, deployment and etc. To know more about it visit https://travis-ci.org

To add Travis CI into our project we just added .travis.yml file and integrated repository on https://travis-ci.org

**.travis.yml**

```
language: node_js
node_js: '8'
install: npm install
script:
  - npm run lint
  - npm run test:jest
  - npm run build:production
  - npm run test:hermione
after_success:
  - npm install -g codeclimate-test-reporter
  - codeclimate-test-reporter < coverage/lcov.info
addons:
  code_climate:
    repo_token: 7855ec12b0d87cd0f4424c8ee761a40d71c1d3a818e62abbab91ef4998c81ca2
branches:
  only:
    - master
```

Here we use nodejs 8, run lints, tests and assembling and also send coverage data into codeclimate.

It Travis interface this looks like this:

![](./5.png)
![](./6.png)
![](./7.png)

## 6.8 README.md

We added we badges into our README.md to show our repository state.

**README.md**

```
# Even Faster Single Page Application

[![Maintainability](https://api.codeclimate.com/v1/badges/2ced75e5aadd5373fa28/maintainability)](https://codeclimate.com/github/CrazySquirrel/ef-spa/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2ced75e5aadd5373fa28/test_coverage)](https://codeclimate.com/github/CrazySquirrel/ef-spa/test_coverage)
[![Build Status](https://travis-ci.org/CrazySquirrel/ef-spa.svg?branch=master)](https://travis-ci.org/CrazySquirrel/ef-spa)
```

Now it's looks like this:

![](./8.png)

Also we added simple github age

![](./9.png)
![](./10.png)

## 6.9 Trello

Trello’s boards, lists, and cards enable you to organize and prioritize your projects in a fun, flexible and rewarding way.

And the last piece we added to make development process easier is Trello. To know more about it go to https://trello.com/

## 6.10 New components

We added bunch of new components, reducers and test to have something to work within nativa app assembling. And now our application looks like this:

![](./11.png)

# What we have at the moment:

We added several optimizations and tools to make our lives better.

https://github.com/CrazySquirrel/ef-spa/commit/b23cfdfe63183bba71022ea4b0a7158d8640fe8b

https://github.com/CrazySquirrel/ef-spa/commit/1f3a0ddceaa657f28467985300568da871719345

https://github.com/CrazySquirrel/ef-spa/commit/e021f6b727da5e89cf5f71eac17c7c5917430442

All we left to talk about are: documentation and native app assembling.

Next time we going to talk about native app assembling.

https://www.linkedin.com/pulse/even-faster-single-page-application-7native-app-sergei-iastrebov/

**If you like this article, don't forget to like, share, connect and/or subscribe to [#evenfastersinglepageapplication](https://www.linkedin.com/feed/topic/?keywords=%23evenfastersinglepageapplication)**

