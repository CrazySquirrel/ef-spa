# Even Faster Single Page Application: 7.Native app assembling

https://www.linkedin.com/pulse/even-faster-single-page-application-6optimizations-ci-iastrebov/

Last time we added several optimizations and tools to make our lives better.

https://github.com/CrazySquirrel/ef-spa/commit/b23cfdfe63183bba71022ea4b0a7158d8640fe8b

https://github.com/CrazySquirrel/ef-spa/commit/1f3a0ddceaa657f28467985300568da871719345

https://github.com/CrazySquirrel/ef-spa/commit/e021f6b727da5e89cf5f71eac17c7c5917430442

This time we going to talk about native app assembling.

## 7.1 Electron

To build native applications we going to use electron. 

_If you can build a website, you can build a desktop app. Electron is a framework for creating native applications with web technologies like JavaScript, HTML, and CSS. It takes care of the hard parts so you can focus on the core of your application._

Basically electron allow you to create native app from web version. To read more about electron visit https://electronjs.org/docs

### 7.1.1 Webpack

To get started we need to install electron package:

```
npm i --save-dev electron electron-builder
```

And we need to add electron postinstall:

```
...
"postinstall": "npm run postinstall:git-lfs && npm run postinstall:husky && npm run postinstall:electron",
...
"postinstall:electron": "electron-builder install-app-deps"
...
```

Also we need to add electron run script:

```
"electron": "NODE_ENV=production electron ./electron/electron.js",
```

Then we should add some changes to our webpack files:

**config/webpack.production.config.js**

```
module.exports = [
  require('./webpack.config.js')('client', 'production'),
  require('./webpack.config.js')('server', 'production'),
  require('./webpack.config.js')('webworker', 'production'),
  require('./webpack.config.js')('electron-main', 'production'),
  require('./webpack.config.js')('electron-renderer', 'production')
];
```

**config/webpack.development.config.js**

```
module.exports = [
  require('./webpack.config.js')('client', 'development'),
  require('./webpack.config.js')('server', 'development'),
  require('./webpack.config.js')('webworker', 'development'),
  require('./webpack.config.js')('electron-main', 'development'),
  require('./webpack.config.js')('electron-renderer', 'development')
];
```

Here we added new assembling target for main and render electron version for development and production.

**config/webpack.config.js**

```
const path = require('path');
const webpack = require('webpack');
const glob = require('glob');

const PACKAGE = require('../package.json');
const WebManifest = require('../public/favicon/site.webmanifest.json');
const serverConfig = require('../server.config');

const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

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

const getTarget = (target) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';
  const isElectronMain = target === 'electron-main';
  const isElectronRenderer = target === 'electron-renderer';

  if (isClient) {
    return 'web';
  }

  if (isServer) {
    return 'node';
  }

  if (isWebWorker) {
    return 'webworker';
  }

  if (isElectronMain) {
    return 'electron-main';
  }

  if (isElectronRenderer) {
    return 'electron-renderer';
  }
};

const getEntry = (target) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';
  const isElectronMain = target === 'electron-main';
  const isElectronRenderer = target === 'electron-renderer';

  if (isClient) {
    return {
      index: './src/client.tsx',

      inline: [
        './src/scss/inline.scss',
        './src/inline.ts'
      ]
    };
  }

  if (isServer) {
    return {
      index: './src/server.tsx'
    };
  }

  if (isWebWorker) {
    return {
      '../service-worker': './src/workers/service-worker.ts'
    };
  }

  if (isElectronMain) {
    return {
      electron: './src/electron.ts'
    };
  }

  if (isElectronRenderer) {
    return {
      index: './src/client.tsx',

      inline: [
        './src/scss/inline.scss',
        './src/inline.ts'
      ]
    };
  }
};

const getOutputPath = (target) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';
  const isElectronMain = target === 'electron-main';
  const isElectronRenderer = target === 'electron-renderer';

  if (isClient || isWebWorker) {
    return path.resolve(__dirname, '../build/static');
  }

  if (isServer) {
    return path.resolve(__dirname, '../build/server');
  }

  if (isElectronMain || isElectronRenderer) {
    return path.resolve(__dirname, '../electron');
  }
};

function getPublicPath(target) {
  const isElectronMain = target === 'electron-main';
  const isElectronRenderer = target === 'electron-renderer';

  if (isElectronRenderer || isElectronMain) {
    return '/';
  }

  return '/static/';
}

module.exports = (target, mode) => {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';

  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';
  const isElectronMain = target === 'electron-main';
  const isElectronRenderer = target === 'electron-renderer';

  const autoprefixer = {
    browsers: [
      '>1%',
      'last 4 versions',
      'Firefox ESR',
      'iOS >= 7',
      'not ie < 9'
    ],
    flexbox: 'no-2009'
  };

  return {
    mode: isDevelopment ? 'development' : 'production',
    target: getTarget(target),
    externals: isServer ? [
      nodeExternals(),
      path.resolve(__dirname, '../build')
    ] : [],
    cache: isDevelopment,
    bail: isProduction,
    devtool: 'source-map',
    entry: getEntry(target),
    stats: {
      children: false
    },
    node: {
      __dirname: false,
      __filename: false
    },
    output: {
      path: getOutputPath(target),
      publicPath: getPublicPath(target),

      filename: '[name].js',
      chunkFilename: '[name].js',

      library: PACKAGE.name,
      libraryTarget: 'umd'
    },
    resolve: {
      modules: [
        'node_modules',
        path.resolve(__dirname, '../src')
      ],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        types: path.resolve(__dirname, '../src/types'),
        components: path.resolve(__dirname, '../src/components'),
        store: path.resolve(__dirname, '../src/store'),
        webworker: path.resolve(__dirname, '../src/webworker'),
        utils: path.resolve(__dirname, '../src/utils')
      }
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: [
            'babel-loader',
            'eslint-loader'
          ],
          include: path.resolve(__dirname, '../src')
        },
        {
          test: /\.(ts|tsx)$/,
          use: [
            'ts-loader',
            'tslint-loader'
          ],
          include: [
            path.resolve(__dirname, '../src'),
            path.resolve(__dirname, '../server'),
            path.resolve(__dirname, '../server.ts')
          ],
          exclude: [
            /.*\.test\.(ts|tsx)/ig
          ]
        },
        {
          test: /\.css$/,
          use: [
            isDevelopment ? require.resolve('style-loader')
              : MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                minimize: isProduction,
                sourceMap: true
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                minimize: isProduction,
                sourceMap: true,
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  require('autoprefixer')(autoprefixer)
                ]
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            isDevelopment ? require.resolve('style-loader')
              : MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                minimize: isProduction,
                sourceMap: true
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                minimize: isProduction,
                sourceMap: true,
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  require('autoprefixer')(autoprefixer)
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [
                  path.resolve(__dirname, '../src'),
                  path.resolve(__dirname, '../node_modules/compass-mixins/lib')
                ],
                minimize: isProduction,
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10 * 1024
              }
            },
            'image-webpack-loader'
          ]
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                extract: !isElectronRenderer
              }
            },
            'image-webpack-loader'
          ]
        }
      ]
    },
    plugins: [
      ...(
          isClient ? [
            new HtmlWebpackPlugin({
              filename: 'index.html',
              template: 'public/index.html',
              excludeAssets: [
                /inline.(css|js)/
              ]
            }),
            new HtmlWebpackExcludeAssetsPlugin()
          ] : []
      ),
      ...(
          isElectronRenderer ? [
            new HtmlWebpackPlugin({
              filename: 'index.html',
              template: 'public/electron.html'
            }),
            new HtmlWebpackExcludeAssetsPlugin()
          ] : []
      ),
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
      new SpriteLoaderPlugin({
        plainSprite: true
      }),
      new ExtractTextPlugin({
        filename: '[name].css'
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, '../src/images'),
          to: path.resolve(__dirname, '../build/images')
        },
        {
          from: path.resolve(__dirname, '../public/favicon'),
          to: path.resolve(__dirname, '../build/favicon')
        },
        {
          from: path.resolve(__dirname, '../public/robots.txt'),
          to: path.resolve(__dirname, '../build/robots.txt')
        },

        {
          from: path.resolve(__dirname, '../src/images'),
          to: path.resolve(__dirname, '../electron/images')
        },
        {
          from: path.resolve(__dirname, '../public/favicon'),
          to: path.resolve(__dirname, '../electron/favicon')
        },
        {
          from: path.resolve(__dirname, '../public/robots.txt'),
          to: path.resolve(__dirname, '../electron/robots.txt')
        }
      ]),
      ...(
        isProduction ? [
          new ImageminPlugin({
            disable: isDevelopment,
            test: /\.(jpe?g|png|gif|svg)$/
          })
        ] : []
      )
    ],
    optimization: {
      minimize: (isClient || isWebWorker) && isProduction,
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          extractComments: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    performance: {
      hints: isProduction ? 'warning' : false
    }
  };
};
```

In main webpack file we added new targets, entries, output paths, public paths, node section, separate HtmlWebpackPlugin version for electron and dublicate coppy settings for render electorn version, because we going to build electon files into separate electron directory to make it easier to work with.

This will allow us to build separate versions for main and render electron process.

### 7.1.2 Entries

Before we first run electron we need to add few more changes: 

**src/inline.ts**

```
declare const target: string;

if (target === 'client') {
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
}
```

For now we going to turn off service worker in electron version.

**public/electron.html**

```
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8">

  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">

  <meta name="apple-mobile-web-app-status-bar-style" content="black-transparent">

  <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"><link rel="icon" type="image/png" sizes="194x194" href="/favicon/favicon-194x194.png"><link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png"><link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"><link rel="manifest" href="/favicon/site.webmanifest"><link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#333333">

  <meta name="apple-mobile-web-app-title" content="EF-SPA"><meta name="application-name" content="EF-SPA"><meta name="msapplication-TileColor" content="#333333"><meta name="msapplication-TileImage" content="/favicon/mstile-144x144.png"><meta name="theme-color" content="#333333">
</head>
<body>
<sectipn id="root"></sectipn>
</body>
</html>
```

Also we added separate html template for electron, without server side rendering.

**src/electron.tsx**

```
import * as Sentry from '@sentry/browser';

declare const sentry: string;
declare const version: string;
declare const mode: string;

Sentry.init({
  dsn: sentry,
  release: version,
  environment: mode,
});

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {HashRouter} from 'react-router-dom';

import Boundary from 'components/Boundary';

import {Store} from './store';

import Router from './routs';

import './scss/index.scss';

ReactDOM.render(
    <Boundary><Provider store={Store}><HashRouter>
          {Router}
        </HashRouter></Provider></Boundary>,
    document.getElementById('root'),
);
```

Than we added separate entry for electron with HashRouter instead of BrowserRouter.

**src/electron.ts**

```
// Import electron dependencies
import {app, BrowserWindow, protocol} from 'electron';


// Import path and url dependencies
import * as path from 'path';
import * as url from 'url';


// Declare project name variable
declare const name: string;


// Declare window and application variables
let mainWindow: BrowserWindow;
let application: typeof app;


// All window close event handler
function onWindowAllClosed() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    application.quit();
  }
}


// All active event handler
function onActive() {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    onReady();
  }
}


// Close event handler
function onClose() {
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  mainWindow = null;
}


// Ready event handler
function onReady() {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.


  // Define default file protocol
  const PROTOCOL = 'file';


  // Method for resolving static relative paths from file://
  protocol.interceptFileProtocol(PROTOCOL, (request, callback) => {
    let requestUrl = request.url;


    if (requestUrl.endsWith('/')) {
      requestUrl += 'index.html';
    }


    requestUrl = requestUrl.substr(PROTOCOL.length + 1);


    requestUrl = path.join(__dirname, requestUrl);


    requestUrl = path.normalize(requestUrl);


    callback(requestUrl);
  });


  // Create the browser window.
  // @see https://github.com/electron/electron/blob/master/docs/api/browser-window.md
  mainWindow = new BrowserWindow({
    // declare window sizes
    width: 800,
    height: 600,


    // declare window minimum sizes
    minWidth: 320,
    minHeight: 320,


    // hide window until it's ready
    show: false,


    // define title and icon
    title: name,
    icon: './favicon/android-chrome-512x512.png',


    // hide bar
    titleBarStyle: 'hidden',


    // define browser setting
    webPreferences: {
      // allow dev tools
      devTools: true,
    },
  });


  // Wait until window is ready and show it
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });


  // Load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: '/',
    protocol: PROTOCOL + ':',
    slashes: true,
  }));


  // Emitted when the window is closed.
  mainWindow.on('closed', onClose);
}


application = app;


// Quit when all windows are closed.
application.on('window-all-closed', onWindowAllClosed);


// Emitted when app is active
application.on('activate', onActive);


// Emitted when app is ready
application.on('ready', onReady);
```

And finally we added electron main file.

Now if we rebuild files and run npm run electron, we should see an electron applications. 

![](./1.png)

## 7.2 Electron builder

Now, to be able to actually build native apps, we need to configurate electron-builder. To do this, we need to add several files:

**electron/package.json**

```
{}
```

We need to create empty electron directory and empty package.json.

And also we need to add config file for electron-builder:

**electron-builder.js**

```
// Os module
const os = require('os');


// Detect mac os
const isMacOs = os.platform() === 'darwin';


// Import package.json and webmanifest
const PACKAGE = require('./package.json');
const MANIFEST = require('./public/favicon/site.webmanifest.json');


// Export electron-builder config
// @see https://www.electron.build/configuration/configuration
module.exports = {
  appId: `ru.crazysquirrel.${PACKAGE.name}`,
  productName: MANIFEST.long_name,
  copyright: `Copyright © year ${PACKAGE.author}`,
  directories: {
    buildResources: './electron',
    output: './build/app',
    app: './electron'
  },
  files: ['**/*', 'electron/**/*'],
  // expanding packge.json
  extraMetadata: {
    name: PACKAGE.name,
    private: PACKAGE.private,
    version: PACKAGE.version,
    description: PACKAGE.description,
    keywords: PACKAGE.keywords,
    license: PACKAGE.license,
    author: PACKAGE.author,
    homepage: PACKAGE.homepage,
    bugs: PACKAGE.bugs,
    man: PACKAGE.man,
    repository: PACKAGE.repository,
    main: 'electron.js'
  },
  // build version
  buildVersion: PACKAGE.version,
  // file name template
  artifactName: '${productName}-${version}.${ext}',
  // compression settings
  compression: 'maximum',
  // Mac settings
  mac: {
    category: 'public.app-category.social-networking',
    target: [
      'zip'
    ].concat(isMacOs ? [
      'dmg'
    ] : []),
    icon: './electron/favicon/android-chrome-512x512.png'
  },
  // Windows settings
  win: {
    target: [
      'nsis'
    ],
    icon: './electron/favicon/android-chrome-512x512.png'
  },
  // Linux settings
  linux: {
    target: [
      'deb'
    ],
    icon: './electron/favicon/android-chrome-512x512.png'
  },
  // DMG settings
  dmg: {
    artifactName: '${productName}-${version}-Setup.${ext}'
  },
  // Setup .exe settings
  nsis: {
    artifactName: '${productName}-${version}-Setup.${ext}'
  }
};
```

Then we can add build:app script:

```
"build:app": "electron-builder -mwl --config ./electron-builder.js",
```

Now if we run this script a few things will happen:

* If we run it on MacOS then electron will download all necessary dependencies and build: zip and dmg installer for Mac, exe installer for Windows and deb for Linux.
* If we run it on Windows then electron will download all necessary dependencies and build: zip for Mac, exe installer for Windows and deb for Linux. dmg cannot be easily build on other systems than mac.
* If we run it on Linux then electron will download all necessary dependencies and build: zip for Mac and deb for Linux. to build for Windows we need to use docker container.

## 7.3 Electron in CI

To build native apps in CI we need to add few more files:

**docker-compose-electron.yml**

```
version: "3"
services:
  electron-builder:image: electronuserland/electron-builder:wine
    volumes:
    - $PWD:/project
    - ~/.cache/electron:/root/.cache/electron
    - ~/.cache/electron-builder:/root/.cache/electron-builder
    command: npm run build:app
This is a docker container for electron.
```

**.gitignore**

```
/stat-reporter


/electron/**
!/electron/package.json
```

Here we added few ingnores into our .gitignore file.

**.travis.yml**

```
 - npm run test:hermione
 - npm run docker:build:app
```

Also we added npm run docker:build:app into travis config file.

**package.json**

```
"docker:build:app": "docker-compose -f docker-compose-electron.yml up --force-recreate",
```

And we added docker:build:app itself into package.json

Now if we run 'npm run docker:build:app' we should get something like this:

![](./2.png)

It is simply a collection of applications for different systems, files with statistics and files for auto-update.

## 7.4 Electron next steps

For further action, we need to fix some problems:

* add application signing certificates
* learn how to sign all apps in docker-container
* learn how to generate dmg installer in docker-container
* learn how to test applications for different platforms
* learn how to build applications for mobile devices
* add auto-update to application
* etc.

But all these improvements we going to do later, when our application will have more functionality.

# What we have at the moment:

We added electron version and electron assembling for MacOS, Windows and Linux in our project. And also we added electron into CI.

https://github.com/CrazySquirrel/ef-spa/commit/f8d35db04bbb829747b6d27c9da15ad32ef59590

Next time we going to talk about documentation and after that we will talk about some other optimization like performance testing, security testing, accessibility testing and etc.

**If you like this article, don't forget to like, share, connect and/or subscribe to [#evenfastersinglepageapplication](https://www.linkedin.com/feed/topic/?keywords=%23evenfastersinglepageapplication)**

