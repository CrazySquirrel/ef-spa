# Even Faster Single Page Application: 5.Monitoring and testing

https://www.linkedin.com/pulse/even-faster-single-page-application-4react-express-ssr-iastrebov/

Last time we wrote first react part, added express and set up server side rendering.

https://github.com/CrazySquirrel/ef-spa/commit/c061e7ef9f54c95bc31c2333ace925fbc4207666

This time we going to set up monitoring and testing environment.

## 5.1 Monitoring

For monitoring we going to use https://sentry.io . First we need to register and add project:

![](./1.png)

Then we need to install some dependencies:

```
npm i --save @sentry/browser raven
```

Than we need to add some changes to client and server code:

**config/webpack.config.js**

```
const serverConfig = require('../server.config');
...
new webpack.DefinePlugin({
	name: JSON.stringify(PACKAGE.name),
	version: JSON.stringify(PACKAGE.version),
	target: JSON.stringify(target),
	mode: JSON.stringify(mode),
	webmanifest: JSON.stringify(WebManifest),
	serviceWorkerCachePaths: JSON.stringify(serviceWorkerCachePaths),
	sentry: JSON.stringify(serverConfig.apps[0].SENTRY),
	'process.env.NODE_ENV': JSON.stringify(mode)
}),	
...
```

We export sentry key into our code in webpack config file.

**server.config.json**

```
"env": {
	"NODE_ENV": "production"
},
"SENTRY": "<app sentry key>",
"development": {
We add sentry key into our server config.
```

**server.js**

```
...
const RAVEN = require('raven');


// Set up sentry
RAVEN.config(
    SERVER_SETTINGS.apps[0].SENTRY
).install();
...


// Error handler
APP.use(RAVEN.requestHandler());


...


require('./server/render/index.js')(APP, RAVEN);


...
```

We set up sentry middleware in express and pass it to subroutine.

**server/render/index.js**

```
// Export express subroutines
module.exports = (APP, RAVEN) => {
  // Use server side rendering as fallback for all routs
  APP.get('*', (req, res) => {
    try {
      // Server side render
      const {context, result, store} = render({
        csrf: req.csrfToken()
      });


      ...
    } catch (e) {
      RAVEN.captureException(e);


      res.writeHead(500);
      res.end();
    }
  });
};
```

Also we add catch in rendering express part.

**src/client.tsx**

```
import * as Sentry from '@sentry/browser';


declare const sentry: string;


Sentry.init({
  dsn: sentry,
});


...


import {Boundary} from 'components/Boundary';


...


ReactDOM.hydrate(
    <Boundary>
      <Provider store={Store}>
        <BrowserRouter>
          {Router}
        </BrowserRouter>
      </Provider>
    </Boundary>,
    document.getElementById('root'),
);
```

On client side, we add Boundary component for error catching.

**src/components/Boundary/index.tsx**

```
import * as Sentry from '@sentry/browser';
import * as React from 'react';

interface Props {
}

interface State {
  error: any;
}

export class Boundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  public componentDidCatch(error: any, errorInfo: any) {
    this.setState({error});

    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });
  }

  public render() {
    if (this.state.error) {
      // render fallback UIreturn (
          <a onClick      ​={() => Sentry.showReportDialog()}>Отправить отчет</a>
      );
    } else {
      // when there's not an error, render children untouchedreturn this.props.children;
    }
  }
}
```

And we add Boundary component itself.

Now if some error appear on client or server we going to catch it and see in sentry interface.

![](./2.png)
![](./3.png)
![](./4.png)

## 5.2 Testing

We going to use several types of testing:

* unit tests for function and components
* system tests for user cases
* rendering performance tests

### 5.2.1 Jest

For unit testing we going to use Jest https://jestjs.io/docs/en/getting-started because it's fast and also allow to test React components.

First of all we need to install some dependencies:

```
npm install --save-dev jest react-test-renderer enzyme enzyme-adapter-react-16 enzyme-to-json identity-obj-proxy babel-jest ts-jest
```

Than we need to add and change some files:

**package.json**

```
"scripts": {
    ...
    "test": "npm run jest",
    "jest": "jest",
    ...
},
...
"husky": {
    "hooks": {
      ...
      "pre-commit": [
        "npm run lint",
        "npm run test"
      ],
      "pre-push": [
        "npm run lint",
        "npm run test",
        "npm run build:production"
      ],
      ...
    }
  }
```

We add test script into package.json

```
.gitignore

.idea
.DS_Store
*.log

/node_modules

/build
/coverage
```

Also we add coverage directory to .gitignore

```
.gitattributes

*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
*.snap filter=lfs diff=lfs merge=lfs -text
```

And also we add .snap files to git-lfs

**jest.config.js**

```
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
```

We add config files for ject. Here we specify, that we want to fail if something goes wrong. We specify params and thresholds for test coverage, so we'll be able to maintain coverage level. And we set up some processing settings for jest.

**test/test-preprocessor.js**

```
const tsc = require('typescript');
const tsConfig = require('../tsconfig.json');

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js')) {
      return tsc.transpile(src, tsConfig.compilerOptions, path, []);
    }
    return src;
  },
};
```

**test/test-setup.js**

```
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });
test/test-shim.js

global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};
```

And jest files for processing, setup and polyfill.

**src/components/App/index.test.tsx**

```
import * as React from 'react';
import { shallow } from 'enzyme';

import App from './index';

it('renders the heading', () => {
  const result = shallow(<App />);
  
  expect(result).toMatchSnapshot();
});
```

And as the last part we add simple test for our App component.

Now if we run our tests, we going to get something like this:

```
=============================== Coverage summary ===============================
Statements   : 83.33% ( 20/24 )
Branches     : 57.14% ( 8/14 )
Functions    : 77.78% ( 7/9 )
Lines        : 90.91% ( 20/22 )
================================================================================
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   1 passed, 1 total
Time:        2.233s
```

Ran all test suites.

### 5.2.2 Hermione

For system tests we going to use Hermione, because it's allow to use browser and it's faster than Selenium. To know more about Hermione read https://github.com/gemini-testing/hermione

First of all we need to install some dependencies:

```
npm i --save-dev selenium-standalone hermione chai
```

Than we need to add and change some files:

**package.json**

```
...
"scripts": {
	...
	"test": "npm run test:jest && npm run test:hermione",
	"test:jest": "jest",
	"test:hermione": "hermione",
	"selenium": "selenium-standalone start",
	"postinstall": "npm run postinstall:git-lfs && npm run postinstall:husky && npm run postinstall:selenium",
	"postinstall:git-lfs": "git lfs update --force",
	"postinstall:husky": "cd ./node_modules/husky && npm run install -- --append",
	"postinstall:selenium": "./node_modules/.bin/selenium-standalone install"
	...
}
...
"husky": {
	"hooks": {
		"commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
		"pre-commit": "npm run lint && npm run test:jest",
		"pre-push": [
			"npm run lint",
			"npm run test:jest",
			"npm run build:production"
		],
		"post-commit": [
			"git status"
		],
		"post-checkout": [
			"npm ci"
		],
		"post-merge": [
			"npm ci"
		]
	}
}
...
```

We add hermione scripts into package.json

**.hermione.conf.js**

```
module.exports = {
  sets: {
    common: {
      files: [
        'tests/common/*.hermione.js'
      ]
    },

    desktop: {
      files: [
        'tests/common/*.hermione.js',
        'tests/desktop/*.hermione.js'
      ]
    }
  },

  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome' // this browser should be installed on your OS
      }
    }
  }
};
```

Then we add hermione config, where we specify test sets and browsers.

**tests/desktop/github.hermione.js**

```
describe('Main page', function () {
  it('root', function () {
    return this.browser
    .url('https://ef-spa.crazysquirrel.ru/')
    .assertView('plain', '#root');
  });
});
```

And we also add simple test.

After that we can start selenium grid:

```
npm run selenium
```

That we can run hermione in a saving mode:

```
./node_modules/.bin/hermione --update-refs
```

It will run test and save new screenshots.

Now we have some problems, because we need local browser, but later we going to use docker grid instead.

### 5.2.3 Lighthouse

For rendering test we going to use Lighthouse https://developers.google.com/web/tools/lighthouse/

First of all we need to install some dependencies:

```
npm i --save-dev lighthouse chrome-launcher ts-node mocha @types/mocha
```

Than we need to add and change some files:

**package.json**

```
"scripts": {
    ...
    "lint": "npm run lint:tslint && npm run lint:eslint",
    "lint:eslint": "eslint -c .eslintrc.json '{src,tests}/**/*.{js,jsx}'",
    "lint:tslint": "tslint -c tslint.json '{src,tests}/**/*.{ts,tsx}'",
    "test": "npm run test:jest && npm run test:hermione && npm run test:lighthouse",
    "test:jest": "jest",
    "test:hermione": "hermione",
    "test:lighthouse": "mocha -r ts-node/register --recursive tests/lighthouse/index.ts",
    ...
},
```

**tests/lighthouse/index.ts**

```
import 'mocha';

// Import dependencies.
const fs = require('fs');
const path = require('path');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const REPORT_PATH = './tests/lighthouse/report';

// Previous score
let SCOREs: any = {};

// Try to download previous score
try {
  SCOREs = JSON.parse(
      fs.readFileSync(
          `${REPORT_PATH}/../scores.json`,
          'utf8',
      ),
  );
} catch (e) {
  SCOREs = {};
}

// Import chai
const CHAI = require('chai');

// Tested urls
const URLs = [
    'https://ef-spa.crazysquirrel.ru/'
];

// Chrome options
const opts = {
  chromeFlags: ['--show-paint-rects'],
  port: 3444,
};

// LightHouse test
describe('LightHouse', () => {
  let chrome: any;

  // Before test run browser
  before((done) => {
    chromeLauncher
    .launch(opts)
    .then((c: any) => {
      chrome = c;

      opts.port = c.port;

      done();
    })
    .catch(done);
  });

  // After test close browser
  after((done) => {
    chrome
    .kill()
    .then(() => {
      done();
    })
    .catch(done);

    fs.writeFileSync(
        path.resolve(`${REPORT_PATH}/../scores.json`),
        JSON.stringify(SCOREs),
    );
  });

  // Test each url
  URLs.forEach((url: string) => {
    // Create test
    it(url, (done) => {
      // Call lighthouse
      lighthouse(url, opts, null)
      .then((result: any) => {
        // Get lighthouse reportconst audits = JSON.parse(result.report).audits;

        // Process report scorefor (const key in audits) {if (audits.hasOwnProperty(key)) {if (audits[key].scoreDisplayMode === 'binary') {
              if (audits[key].score !== 1) {
                console.log(audits[key].id);
              }
            } else if (audits[key].scoreDisplayMode === 'numeric') {
              if (audits[key].score !== 1) {
                console.log(audits[key].id);
              }
            } else if (audits[key].scoreDisplayMode === 'manual') {
              //console.log(audits[key]);
            } else if (audits[key].scoreDisplayMode === 'informative') {
              //console.log(audits[key]);
            } else if (audits[key].scoreDisplayMode === 'not-applicable') {
              //console.log(audits[key]);
            } else {
              console.log(audits[key].id);
            }
          }
        }

        let sum = 0;
        let count = 0;

        // Calculate sum and countfor (const key in audits) {if (audits.hasOwnProperty(key) && typeof audits[key].score === 'number') {
            sum += audits[key].score;
            count++;
          }
        }

        // Calculate scoreconst score = sum / count;

        // Compare score to previous or 90%if (SCOREs[url]) {
          CHAI.expect(score).to.be.at.least(SCOREs[url]);
        } else {
          CHAI.expect(score).to.be.at.least(90);
        }

        // Save new score
        SCOREs[url] = score;

        // Finish test
        done();
      })
      .catch(done);
      // Set test maximum timeout
    }).timeout(60 * 1000);
  });
});
```

Than we can run Lighthouse test:

```
npm run test:lighthouse
```

It will run chrome and test each page for optimization.

Just like Hermione Lighthouse use local browser and we going to replace it with docker later.

# What we have at the moment:

We set up 3 different test types: unit, system and optimization.

https://github.com/CrazySquirrel/ef-spa/commit/ffd32469077265b9822a606c2e9bb8c9d2f21584

https://github.com/CrazySquirrel/ef-spa/commit/6b63f6efcc14ad5cae03d284dd17135a7d209ef2

https://github.com/CrazySquirrel/ef-spa/commit/29c76a25dc4582a782f9637f0a356d3afce328d8

We've just few parts to cover: documentation, native app assembling, CI and optimization.

Next time we going to talk about some optimization of what we done so far.

https://www.linkedin.com/pulse/even-faster-single-page-application-6optimizations-ci-iastrebov/

**If you like this article, don't forget to like, share, connect and/or subscribe to [#evenfastersinglepageapplication](https://www.linkedin.com/feed/topic/?keywords=%23evenfastersinglepageapplication)**

