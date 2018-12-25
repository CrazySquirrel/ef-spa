# Even Faster Single Page Application: 4.React Express SSR

https://www.linkedin.com/pulse/even-faster-single-page-application-3webpack-sergei-iastrebov/

Previously, we set up lighting and assembling and added empty files to get some result.

https://github.com/CrazySquirrel/ef-spa/commit/835fb87dbeffccd410feb47b093782dd67a35e22

Now we going to add first React part, express and server side rendering.

## 4.1 HTML part

Let's start with html template.

First we going to go to https://www.iconfinder.com/ site and find some icon for our project. Like https://www.iconfinder.com/icons/2492622/chat_social_we_icon

Than we going to go to https://realfavicongenerator.net/ and generate manifest for our application.

Than we going to add favicon images to public folder and some meta tags to our html template:

```
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8">

  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">

  <meta name="apple-mobile-web-app-status-bar-style" content="black-transparent">

  <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href=/favicon/favicon-32x32.png"><link rel="icon" type="image/png" sizes="194x194" href="/favicon/favicon-194x194.png"><link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png"><link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"><link rel="manifest" href="/favicon/site.webmanifest"><link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#333333">

  <meta name="apple-mobile-web-app-title" content="EF-SPA"><meta name="application-name" content="EF-SPA"><meta name="msapplication-TileColor" content="#333333"><meta name="msapplication-TileImage" content="/favicon/mstile-144x144.png"><meta name="theme-color" content="#333333">

  <script>window.__PRELOADED_STATE__=%PRELOADED_STATE%</script><style>%INLINE_STYLE%</style>
</head>
<body>
<sectipn id="root">%APP%</sectipn>
<script>%INLINE_SCRIPT%</script>
<div class="app-svg">%SVG_SPRITE%</div>
</body>
</html>
```

Here we set up language for our html, initial viewport, mobile capabilities, icons and theme colors for our app.

Now let's set up react part.

## 4.2 React part
First of we need to install some packages:

```
npm i --save react react-dom redux react-redux redux-actions react-router-dom bem-cn

npm i --save-dev @types/react @types/react-dom @types/redux @types/react-redux @types/redux-actions @types/react-router-dom @types/bem-cn
```

Also it would be better if you read react related documentation:

* https://reactjs.org/docs/getting-started.html
* https://redux.js.org/introduction/getting-starteda
* https://github.com/ReactTraining/react-router
* https://github.com/redux-utilities/redux-actions
* https://github.com/albburtsev/bem-cn

Then we need to add some files:

**src/client.tsx**

```
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import {Store} from './store';

import Router from './routs';

import './scss/index.scss';

ReactDOM.hydrate(
    <Provider store={Store}><BrowserRouter>
        {Router}
      </BrowserRouter></Provider>,
    document.getElementById('root'),
);
```

This is the file we going to use for browser. Here we added react and react-dom for rendering, react-redux for store, react-router-dom for routering, our store, router and styles. For rendering we use ReactDOM.hydrate because we going to use server side rendering and "update" DOM, which we going to get from server.

**src/server.tsx**

```
import * as React from 'react';

import Router from './routs';

export default class Root extends React.Component {
  public render() {
    return Router;
  }
}
```

This is the file we going to use for server rendering. Here we just return router, because we going to provide store and render in server script.

**src/routs/index.tsx**

```
import * as React from 'react';

import {Route, Switch} from 'react-router-dom';

import App from 'components/App';
import Unexist from 'components/Unexist';

export default (
    <Switch>
      <Route
          exact={true}
          path='/'
          component={App}
      />
      <Route
          path='*'
          component={Unexist}
      />
    </Switch>
);
```

This is the routing file. For now we just going to use main route and 404 rout.

**src/components/App/index.tsx**

```
import * as React from 'react';
import * as bem from 'bem-cn';

import './index.scss';

export interface Props extends React.Props<App> {
  to?: string;
  className?: string;
  replaceClassName?: string;
  title?: string;
}

export default class App extends React.Component<Props, {}> {
  public render() {
    const block = bem('app');

    return (
        <section className={block()}>
          {this.props.children}
        </section>
    );
  }
}
```

src/components/Unexist/index.tsx

```
import * as React from 'react';
import * as bem from 'bem-cn';

import './index.scss';

export interface Props extends React.Props<Unexist> {
  to?: string;
  className?: string;
  replaceClassName?: string;
  title?: string;
}

export default class Unexist extends React.Component<Props, {}> {
  public render() {
    const block = bem('unexist');

    return (
        <section className={block()}>
          {this.props.children}
        </section>
    );
  }
}
```

App and Unexist files are just empty components. Notice that we use bem-cn for class naming, because we going to use BEM notation.

## 4.3 Service worker

Since we want our application to be fast, we going to add service-worker into our project.

To read more about service-worker and progressive web apps visit https://developers.google.com/web/fundamentals/primers/service-workers/

For simplicity, we going to add two files:

**src/inline.ts**

```
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Hooray. Registration successful, scope is:', registration.scope);
    })
    .catch((error) => {
      console.log('Whoops. Service worker registration failed, error:', error);
    });
  });
}
```

This file after assembly we going to embed in html for registration service-worker.

**src/workers/service-worker.ts**

```
declare const serviceWorkerCachePaths: string[];
declare const name: string;
declare const version: string;

// Service worker cache part
const CACHE_NAME = `${name}-${version}`;


// Method to fetch resources
function fetchToCache(cache: Cache, request: Request) {
  // Check if we onlineif (!navigator.onLine) {return;
  }

  // Check if this resource is catchableif (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {return;
  }

  // Create new request if it's external request or use initial oneconst newRequest = (
      request.url.startsWith('/') ||
      request.url.startsWith(location.origin)
  ) ? request : new Request(request.url, {
    method: request.method,
    headers: request.headers,
    mode: 'no-cors',
    credentials: request.credentials,
    redirect: 'follow'
  });

  // Fetch resourcereturn fetch(newRequest)
  .then((fetchResponse) => {
    // Put resource into cache if cache is openif (cache) {
      cache.put(request, fetchResponse.clone());
      cache.put(newRequest, fetchResponse.clone());
    }

    return fetchResponse;
  });
}

// Install life cycle event
self.addEventListener('install', () => {
  // Open cache
  caches
  .open(CACHE_NAME)
  .then((cache) => {
    // Prefetch all internal resources
    cache.addAll(
        serviceWorkerCachePaths
        .filter((url) => url.startsWith('/') || url.startsWith(location.origin))
    );

    // Prefetch all external resources
    serviceWorkerCachePaths
    .filter((url) => !(url.startsWith('/') || url.startsWith(location.origin)))
    .map((url) => fetchToCache(cache, new Request(url)));
  })
});


// Activate life cycle event
self.addEventListener('activate', () => {
  // Get all cache keys
  caches
  .keys()
  .then((cacheNames: string[]) => {
    // Got through all cache keys and remove old versionsreturn Promise.all(
        cacheNames.map((cacheName: string) => {
          if (
              cacheName.startsWith(`${name}-`) &&
              cacheName !== CACHE_NAME
          ) {
            return caches.delete(cacheName);
          } else {
            return;
          }
        }),
    );
  });
});

// Fetch life cycle event
self.addEventListener('fetch', (event: FetchEvent) => {
  // If it's not a get request, just ignore itif (
      event.request.method !== 'GET'
  ) {
    return
  }

  // Response from cache or/and refetch
  event.respondWith(
      caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache
        .match(event.request)
        .then((response) => {
          if (response) {
            fetchToCache(cache, event.request);

            return response;
          } else {
            return fetchToCache(cache, event.request);
          }
        });
      }),
  );
});
```

In this file, we add simple rules for caching resources according to the strategy first cache, then a request from the network.

Now let's set up React store.

## 4.4 React store

We going to use React store to store general properties and states of our application. For now, we going to store a csrf token for server requests.

**src/store/index.ts**

```
declare const window: any;
declare const global: any;

import {createStore, compose} from 'redux';
import {Action} from 'redux-actions';

import {CSRFHandle, CSRFStore} from 'store/reducers/csrf/index';

const localWindow: any = typeof window === 'undefined' ? (typeof global === 'undefined' ? global : {}) : window;

export interface StoreTree extends CSRFStore {
  modified: string;
}

const Handlers = [
  CSRFHandle,
];

const composeEnhancers = localWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const Store = createStore(
    (state: StoreTree, action: Action<{}>): StoreTree => {
      return Handlers.reduce(
          (newState: StoreTree, handler: (...props: any[]) => any) => handler(newState, action),
          state,
      ) as StoreTree;
    },
    localWindow.__PRELOADED_STATE__ || {
      csrf: '',
    },
    composeEnhancers(),
);
```

In this file we:

* import redax;
* reducers;
* get global object;
* generate store interface;
* generate handlers;
* get compose from browser extension or use local;
* and create the store itself with a preset state.

In the following articles we going to add some middleware and save/restore state.

**src/store/reducers/csrf/index.ts**

```
import {handleActions} from 'redux-actions';

export interface CSRFStore {
  csrf: string;
}

export const CSRFAction = {};

export const CSRFHandle = handleActions({}, {});
```

In our first reducer we will not do anything, just add blanks and describe a part of the state.

Later we going to add asynchronous actions and handlers.

## 4.5 Express

Before talking about Express it's better to read some documentation:

* https://nodejs.org/en/docs/
* https://expressjs.com/en/starter/installing.html
* http://pm2.keymetrics.io/docs/usage/cluster-mode/
* https://github.com/expressjs/cookie-parser
* https://www.npmjs.com/package/body-parser
* https://www.npmjs.com/package/express-static-gzip
* https://github.com/expressjs/compression
* https://github.com/expressjs/csurf

First of we need to install some packages:

```
npm i --save spdy express cookie-parser body-parser express-static-gzip compression csurf html-minifier
```

Then we need to add some files:

**server.config.json**

```
{
  "apps": [
    {
      "name": "ef-spa",
      "script": "./server.js",
      "node_args": [
        "--inspect",
        "--debug"
      ],
      "instances": "1",
      "exec_mode": "cluster",
      "watch": false,
      "cwd": ".",
      "env": {
        "NODE_ENV": "production"
      },
      "development": {
        "PORTS": {
          "MAIN": "7600",
          "HTTP": "7601",
          "HTTP2": "7602"
        }
      },
      "production": {
        "PORTS": {
          "MAIN": "7700",
          "HTTP": "7701",
          "HTTP2": "7702"
        }
      },
      "error_file": "err.log",
      "out_file": "out.log",
      "merge_logs": true,
      "log_type": "json",
      "log_date_format": "YYYY-MM-DD HH:mm Z"
    }
  ]
}
```

We add a small file with settings for pm2, as we going to use it to run and maintain the server part. To learn more about pm2 config read http://pm2.keymetrics.io/docs/usage/application-declaration/

**server.js**

```
'use strict';

// Get server env params
const SERVER_SETTINGS = require('./server.config.json');

process.env.NODE_ENV = SERVER_SETTINGS.apps[0].env.NODE_ENV || 'production';

const PORTS = SERVER_SETTINGS.apps[0][process.env.NODE_ENV].PORTS;

// Get static path
const STATIC = __dirname + '/build';

// Import dependencies
const FS = require('fs');
const NET = require('net');
const HTTP = require('http');
const SPDY = require('spdy');
const EXPRESS = require('express');
const COOKIE_PARSER = require('cookie-parser');
const BODY_PARSER = require('body-parser');
const STATIC_GZIP = require('express-static-gzip');
const COMPRESSION = require('compression');
const CSRF = require('csurf');

// Get express app
const APP = EXPRESS();

// Add compressing
APP.use(COMPRESSION());

// Add cookie processor
APP.use(COOKIE_PARSER());

// Add parsers for POST data
APP.use(BODY_PARSER.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

// Add parser for json body
APP.use(BODY_PARSER.json({
  limit: '50mb'
}));

// Add csrf token checker and generator
APP.use(CSRF({cookie: true}));

// Add gzip static file processing
APP.use(
    '/',
    STATIC_GZIP(
        STATIC,
        {
          enableBrotli: true,
          customCompressions: [
            {
              encodingName: 'deflate',
              fileExtension: 'deflate'
            },
            {
              encodingName: 'gzip',
              fileExtension: 'gz'
            },
            {
              encodingName: 'br',
              fileExtension: 'br'
            }
          ]
        }
    )
);

// Add subroutines

// Add server site rendering
require('./server/render/index.js')(APP);

// Set up port
APP.set('port', PORTS.MAIN);

// Method for getting ssl certificates
function getCertificates() {
  const certificates = [
    {
      key: '/etc/letsencrypt/live/crazysquirrel.ru/privkey.pem',
      cert: '/etc/letsencrypt/live/crazysquirrel.ru/cert.pem',
    }
  ].filter((v) => FS.existsSync(v.key) && FS.existsSync(v.cert))[0];

  return {
    key: FS.readFileSync(certificates.key),
    cert: FS.readFileSync(certificates.cert),
  };
}

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
HTTP.createServer((req, res) => {
  res.writeHead(301, {'Location': 'https://' + req.headers['host'] + req.url});
  res.end();
}).listen(PORTS.HTTP);

// Start http2 server
SPDY.createServer(getCertificates(), APP).listen(PORTS.HTTP2);
```

This is our main server file. Here we add some main modules and set up server parameters. All other subroutines we going to do in other files.

**server/render/index.js**

```
'use strict';

const FS = require('fs');
const PATH = require('path');

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
function render({url, searchText, csrf}) {
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
module.exports = (APP) => {
  // Use server side rendering as fallback for all routs
  APP.get('*', (req, res) => {
    // Server side renderconst {context, result, store} = render({
      csrf: req.csrfToken()
    });
    
    if (context.url) {
      // If context contains redirect, go ot it
      res.redirect(302, context.url);
    } else {
      // Render htmlPromise.all(
          [
            'static/index.html',
            'static/inline.css',
            'static/inline.js'
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
        INLINE_SCRIPT
      ]) => {
        // Replace placeholders in html templateconst html = HTML
        .replace(
            /%INLINE_STYLE%/ig,
            INLINE_STYLE
        )
        .replace(
            /%INLINE_SCRIPT%/ig,
            INLINE_SCRIPT
        )
        .replace(
            /%APP%/ig,
            result
        )
        .replace(
            /%PRELOADED_STATE%/ig,
            serialize(store.getState())
        );
        // Response rendered html
        res.set('content-type', 'text/html');
        res.send(html);
      });
    }
  });
};
```

This is simple file for react server side rendering.

## 4.6 NodeJS HTTP2 Server MAMP Pro (NGINX)

The last part before it all going to work is to configure the local server. If you already have a local server with http2, you can skip this part, if not, read the article about how to configure it https://www.linkedin.com/pulse/nodejs-http2-server-mamp-pro-nginx-sergei-iastrebov/

# What we have at the moment:

We created the first part of our React application that can be rendered on a server and run offline.

https://github.com/CrazySquirrel/ef-spa/commit/c061e7ef9f54c95bc31c2333ace925fbc4207666

**Next time we going to talk about monitoring and testing.**

https://www.linkedin.com/pulse/even-faster-single-page-application-5monitoring-sergei-iastrebov/

**If you like this article, don't forget to like, share, connect and/or subscribe to [#evenfastersinglepageapplication](https://www.linkedin.com/feed/topic/?keywords=%23evenfastersinglepageapplication)**

