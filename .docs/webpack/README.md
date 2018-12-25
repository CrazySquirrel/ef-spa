# Even Faster Single Page Application: 3.Webpack

https://www.linkedin.com/pulse/even-faster-single-page-application-2git-sergei-iastrebov/

Previously we set up base environment, git and git lfs, and made our first commit.

https://github.com/CrazySquirrel/ef-spa/commit/87c93bcf01b9e8fa23d3df38602e41253fb41fe3

This time we going to get a step closer to the actual development, talk and set up applications assembling process.

There are many tools for assembling your project: grunt, gulp, browserify, brunch, yeoman, etc. But for many reasons, which goes beyond this article series, we going to use webpack.

## 3.1 Webpack

A brief description of what webpack is:

_Webpack is an open-source JavaScript module bundler. It's main purpose is to bundle JavaScript files for usage in a browser, yet it's also capable of transforming, bundling, or packaging just about any resource or asset._

To find out more you can always read the webpack official documents https://webpack.js.org/concepts/ 

For now, let's focus more on practice and step by step set up webpack for our project.

First of all, let's install webpack and webpack cli:

```
npm i --save-dev webpack webpack-cli
```

Now we can use webpack to assemble or watch our files with command "webpack" or "webpack --watch". But it wouldn't be so useful, so we going to add and use some config files.

## 3.2 Webpack config files

There are many ways to organize webpack config files: different files, command line arguments, webpack as a function and etc. But in my experience, the most successful is to use one configuration file with conditions, and several files with parameters to call it. Because most configs generally have the same parameters except for minor differences.

So, let's create our webpack config files. We going to create a config folder and add the following files:

**webpack.development.config.js**

```
module.exports = [
  require('./webpack.config.js')('client', 'development'),
  require('./webpack.config.js')('server', 'development'),
  require('./webpack.config.js')('webworker', 'development')
];
```

**webpack.production.config.js**

```
module.exports = [
  require('./webpack.config.js')('client', 'production'),
  require('./webpack.config.js')('server', 'production'),
  require('./webpack.config.js')('webworker', 'production')
];
```

Also we can add some other variety of this files:

* webpack.client.config.js
* webpack.client.development.config.js
* webpack.client.production.config.js
* webpack.server.config.js
* webpack.server.development.config.js
* webpack.server.production.config.js
* webpack.webworker.config.js
* webpack.webworker.development.config.js
* webpack.webworker.production.config.js

All these files do is generate settings for different build options. For different platforms: client (web), server, webworker, electron and etc. And for different purposes: development, testing, production and etc.

Also we going to add main webpack file **webpack.config.js**:

```
module.exports = (target, mode) => {
	return {};	
};
```

And we going to add some scripts in our **package.json**

```
"build:development": "webpack --config ./config/webpack.development.config.js",
"build:production": "webpack --config ./config/webpack.production.config.js",
```

Also we can add some other variety:

```
"build:development:watch": "webpack --config ./config/webpack.development.config.js --watch",
"build:production:watch": "webpack --config ./config/webpack.production.config.js --watch",

"build:client": "webpack --config ./config/webpack.client.config.js",
"build:client:development": "webpack --config ./config/webpack.client.development.config.js",
"build:client:production": "webpack --config ./config/webpack.client.production.config.js",

"build:server": "webpack --config ./config/webpack.server.config.js",
"build:server:development": "webpack --config ./config/webpack.server.development.config.js",
"build:server:production": "webpack --config ./config/webpack.server.production.config.js",

"build:webworker": "webpack --config ./config/webpack.webworker.config.js",
"build:webworker:development": "webpack --config ./config/webpack.webworker.development.config.js",
"build:webworker:production": "webpack --config ./config/webpack.webworker.production.config.js",

"build:client:watch": "webpack --config ./config/webpack.client.config.js --watch",
"build:client:development:watch": "webpack --config ./config/webpack.client.development.config.js --watch",
"build:client:production:watch": "webpack --config ./config/webpack.client.production.config.js --watch",

"build:server:watch": "webpack --config ./config/webpack.server.config.js --watch",
"build:server:development:watch": "webpack --config ./config/webpack.server.development.config.js --watch",
"build:server:production:watch": "webpack --config ./config/webpack.server.production.config.js --watch",

"build:webworker:watch": "webpack --config ./config/webpack.webworker.config.js --watch",
"build:webworker:development:watch": "webpack --config ./config/webpack.webworker.development.config.js --watch",
"build:webworker:production:watch": "webpack --config ./config/webpack.webworker.production.config.js --watch",
```

But these variants aren't so useful. Now let's fill out our webpack.config.js file.

## 3.3 Webpack basic config

First of all we going to create two variable flags:

```
const isDevelopment = mode === 'development';
const isProduction = mode === 'production';
```

Than we going to add some main sections:

```
mode: isDevelopment ? 'development' : 'production',
target: getTarget(target),
externals: isServer ? [
  nodeExternals(),
  path.resolve(__dirname, '../build')
] : [],
cache: isDevelopment,
bail: isProduction,
devtool: isDevelopment ? 'source-map' : '',
entry: getEntry(target),
stats: {
  children: false
},
output: {
  path: getOutputPath(target),
  publicPath: '/static/',

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
...
optimization: {
  minimize: !isServer && isProduction,
  minimizer: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: false,
      extractComments: true
    }),
    new OptimizeCSSAssetsPlugin({})
  ]
},
performance: {
  hints: isProduction ? 'warning' : false
}
```

Here, based on target and mode, we set following params:

* mode - build mode. Providing the mode configuration option tells webpack to use its built-in optimizations accordingly. (https://webpack.js.org/concepts/mode/)
* tagter - under what environment to assemble. (https://webpack.js.org/configuration/target/)
* externals - configuration option provides a way of excluding dependencies from the output bundles. (https://webpack.js.org/configuration/externals/) We specify that for the server we exclude node_modules and assembled files so that they will not be added to the server bundle.
* cache - use cache in development mode for speed reasons. (https://webpack.js.org/guides/caching/) (https://webpack.js.org/configuration/other-options/#bail)
* bail - fall in production mode, if anything goes wrong. (https://webpack.js.org/configuration/other-options/#bail)
* devtools - provide development tools in development mode. (https://webpack.js.org/configuration/devtool/)
* entry - which files will be used as entry points. (https://webpack.js.org/concepts/entry-points/)
* stats - what information to show during assembling process. (https://webpack.js.org/configuration/stats/) We set that we don't want to see statistics from submodules so that we can read assembling logs more easily.
* output - where to save the assembled files. (https://webpack.js.org/configuration/output/) In output we specify public path, file and chunk names, library name and dependency loading mode.
* resolve - tells where and how to resolve dependency imports and allow you to specify aliases, to make your import paths shorter.
* optimization - parameters for optimization in production mode for client and workers (not for server). (https://webpack.js.org/configuration/optimization/) In addition, we added here external modules UglifyJsPlugin and OptimizeCSSAssetsPlugin for better optimization.
* performance - settings similar to stats, which allow you to display information and recommendations regarding performance optimization. (https://webpack.js.org/configuration/performance/)

As you may noticed getTarget, getEntry, getOutputPath, nodeExternals, UglifyJsPlugin and OptimizeCSSAssetsPlugin are moved into separate methods. These are things that usually differ between builds. And other things are more or less the same. Let's look at these separate methods:

getTarget

```
const getTarget = (target) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';

  if (isClient) {
    return 'web';
  } else if (isServer) {
    return 'node';
  } else if (isWebWorker) {
    return 'webworker';
  }
};
```

getTarget basically transform our target names into valid ones.

getEntry

```
const getEntry = (target) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';

  if (isClient) {
    return {
      index: './src/client.tsx',

      inline: [
        './src/inline.scss',
        './src/inline.ts'
      ],
    };
  } else if (isServer) {
    return {
      index: './src/server.tsx'
    };
  } else if (isWebWorker) {
    return {
      '../service-worker': './src/workers/service-worker.ts'
    };
  }
};
```

getEntry use different files for different assembling. For the beginning we going to build one client and one inline bundle, server bundle and service-worker bundle. Don't worry that we don't have these files now, we going to add and talk about them in the next articles.

getOutputPath

```
const getOutputPath = (target) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';

  if (isWebWorker) {
    return path.resolve(__dirname, '../build/static');
  }

  if (isClient) {
    return path.resolve(__dirname, '../build/static');
  }

  if (isServer) {
    return path.resolve(__dirname, '../build/server');
  }
};
```

getOutputPath specifies in which directories we store the assembled files.

nodeExternals, UglifyJsPlugin and OptimizeCSSAssetsPlugin

```
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
```

nodeExternals, UglifyJsPlugin and OptimizeCSSAssetsPlugin are just an external package that we install:

```
npm i --save-dev webpack-node-externals uglifyjs-webpack-plugin optimize-css-assets-webpack-plugin
```

For now our config file should look something like this:

```
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const getTarget = (target) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';

  if (isClient) {
    return 'web';
  } else if (isServer) {
    return 'node';
  } else if (isWebWorker) {
    return 'webworker';
  }
};

const getEntry = (target) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';

  if (isClient) {
    return {
      index: './src/client.tsx',

      inline: [
        './src/inline.scss',
        './src/inline.ts'
      ],
    };
  } else if (isServer) {
    return {
      index: './src/server.tsx'
    };
  } else if (isWebWorker) {
    return {
      '../service-worker': './src/workers/service-worker.ts'
    };
  }
};

const getOutputPath = (target) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';

  if (isWebWorker) {
    return path.resolve(__dirname, '../build/static');
  }

  if (isClient) {
    return path.resolve(__dirname, '../build/static');
  }

  if (isServer) {
    return path.resolve(__dirname, '../build/server');
  }
};


module.exports = (target, mode) => {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';

  return {
    mode: isDevelopment ? 'development' : 'production',
    target: getTarget(target),
    externals: isServer ? [
      nodeExternals(),
      path.resolve(__dirname, '../build')
    ] : [],
    cache: isDevelopment,
    bail: isProduction,
    devtool: isDevelopment ? 'source-map' : '',
    entry: getEntry(target),
    stats: {
      children: false
    },
    output: {
      path: getOutputPath(target),
      publicPath: '/static/',

      filename: '[name].js',
      chunkFilename: '[name].js',

      library: PACKAGE.name,
      libraryTarget: 'umd'
    },
    ...
    optimization: {
      minimize: !isServer && isProduction,
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
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

## 3.4 Webpack plugins

Plugins are the backbone of webpack. webpack itself is built on the same plugin system that you use in your webpack configuration! They also serve the purpose of doing anything else that a loader cannot do.

Let's add plugins into our config file:

```
plugins: [
  ...(
    target === 'client' ? [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'public/index.html',
        excludeAssets: [
          /inline.(css|js)/,
          /index\.css/
        ]
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
      from: path.resolve(__dirname, '../src/fonts'),
      to: path.resolve(__dirname, '../build/fonts')
    },
    {
      from: path.resolve(__dirname, '../public/robots.txt'),
      to: path.resolve(__dirname, '../build/robots.txt')
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
```

We also need to install:

```
npm i --save-dev html-webpack-plugin html-webpack-exclude-assets-plugin svg-sprite-loader extract-text-webpack-plugin mini-css-extract-plugin copy-webpack-plugin imagemin-webpack-plugin
```

and import those plugins:

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
```

Also we need to import:

```
const PACKAGE = require('../package.json');
const WebManifest = require('../public/favicon/site.webmanifest.json');
```

Now let's talk about what those plugins do.

* HtmlWebpackPlugin - simplifies creation of HTML files to serve your webpack bundles. (https://webpack.js.org/plugins/html-webpack-plugin/)
* HtmlWebpackExcludeAssetsPlugin - allow you to exclude some bundles from HtmlWebpackPlugin. (https://webpack.js.org/plugins/html-webpack-plugin/)
* webpack.DefinePlugin - allows you to create global constants which can be configured at compiletime. (https://webpack.js.org/plugins/define-plugin/)
* SpriteLoaderPlugin - loader for creating SVG sprites. (https://github.com/kisenka/svg-sprite-loader)
* ExtractTextPlugin - allow to extract text from a bundle, or bundles, into a separate file. (https://github.com/webpack-contrib/extract-text-webpack-plugin)
* MiniCssExtractPlugin - help to minify files in extract text plugin. (https://github.com/webpack-contrib/mini-css-extract-plugin)
* CopyWebpackPlugin - allow to copies individual files or entire directories to the build directory. (https://webpack.js.org/plugins/copy-webpack-plugin/)
* ImageminPlugin - simple plugin that uses Imagemin to compress all images in your project. (https://www.npmjs.com/package/imagemin-webpack-plugin)

You can read more about plugins here https://webpack.js.org/concepts/plugins/

## 3.5 Webpack loaders

The last thing we need to add into our config file are loader rules.

We need to install bunch of modules:

```
npm i --save-dev babel-loader eslint-loader eslint-plugin-react ts-loader tslint-loader style-loader css-loader postcss-loader postcss-flexbugs-fixes autoprefixer sass-loader url-loader image-webpack-loader svg-sprite-loader extract-text-webpack-plugin@next typescript tslint eslint tslint-react node-sass
```

And add them to config file:

```
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
            sourceMap: isDevelopment
          }
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            minimize: isProduction,
            sourceMap: isDevelopment,
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
            sourceMap: isDevelopment
          }
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            minimize: isProduction,
            sourceMap: isDevelopment,
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
              path.resolve(__dirname, '../src')
            ],
            minimize: isProduction,
            sourceMap: isDevelopment
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
            extract: true
          }
        },
        'image-webpack-loader'
      ]
    }
  ]
},
```

Basically we specify different processing rules for different folders and file types. To read more about loader read https://webpack.js.org/concepts/loaders/ and https://webpack.js.org/loaders/

## 3.6 Additional file

In order to make our assembling work, we need to add a few more files: assembling configs, linting rules, entry files and etc.

public/favicon/site.webmanifest.json

```
{
  "name": "Even Faster Single Page Application",
  "short_name": "ef-spa",
  "icons": [

  ],
  "display": "standalone",
  "orientation": "portrait"
}
```

public/index.html

```
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><script>window.__PRELOADED_STATE__=%PRELOADED_STATE%</script><style>%INLINE_STYLE%</style>
</head>
<body>
<sectipn id="root">%APP%</sectipn>
<script>%INLINE_SCRIPT%</script>
<div class="app-svg">%SVG_SPRITE%</div>
</body>
</html>
```

public/robots.txt

src/fonts (dir)

src/images (dir)

src/workers/service-worker.ts

src/client.tsx

src/inline.scss

src/inline.ts

src/server.tsx

.babelrc

```
{
  "presets": [
    "env",
    "react"
  ]
}
```

.eslintrc.json

```
{
  "env": {
    "browser": true,
    "node": true,
    "commonjs": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": [
      "error",
      {
        "allow": [
          "log"
        ]
      }
    ]
  }
}
```

tsconfig.json

```
{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "target": "es5",
    "jsx": "react",
    "lib": [
      "webworker",
      "es6",
      "dom"
    ],
    "baseUrl": ".",
    "paths": {
      "components/*": [
        "src/components/*"
      ],
      "store/*": [
        "src/store/*"
      ]
    }
  },
  "include": [
    "./src/**/*",
    "./server/**/*",
    "./server.ts"
  ],
  "exclude": [
    "./node_modules",
    "**/*.example.*"
  ]
}
```

tslint.json

```
{
  "defaultSeverity": "error",
  "extends": [
    "tslint:latest",
    "tslint-react"
  ],
  "jsRules": {},
  "rules": {
    "quotemark": [
      true,
      "single"
    ],
    "interface-name": false,
    "no-empty-interface": false,
    "no-submodule-imports": false,
    "no-implicit-dependencies": false,
    "no-var-requires": false,
    "object-literal-sort-keys": false,
    "no-trailing-whitespace": false,
    "jsx-no-multiline-js": false,
    "jsx-no-lambda": false,
    "jsx-alignment": false,
    "object-literal-key-quotes": false,
    "ordered-imports": false,
    "max-line-length": false,
    "no-object-literal-type-assertion": false,
    "no-console": false,
    "no-any": false,
    "max-classes-per-file": false,
    "no-bitwise": false
  },
  "rulesDirectory": [],
  "linterOptions": {
    "exclude": [
      "**/*.example.*"
    ]
  }
}
```

Also we need to add "/build" into .gitignore file.

And your package.json and webpack.config.js should look like this:

package.json

```
{
  "name": "ef-spa",
  ...
  "scripts": {
    "build:development": "webpack --config ./config/webpack.development.config.js",
    "build:production": "webpack --config ./config/webpack.production.config.js",
    "postinstall": "git lfs update --force && cd ./node_modules/husky && npm run install -- --append"
  },
  "dependencies": {},
  "devDependencies": {
    "@commitlint/cli": "^7.2.1",
    "@commitlint/config-conventional": "^7.1.2",
    "autoprefixer": "^9.4.2",
    "babel-loader": "^8.0.4",
    "copy-webpack-plugin": "^4.6.0",
    "css-loader": "^1.0.0",
    "eslint": "^5.10.0",
    "eslint-loader": "^2.1.1",
    "eslint-plugin-react": "^7.11.1",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "html-webpack-exclude-assets-plugin": "0.0.7",
    "html-webpack-plugin": "^3.2.0",
    "husky": "^1.2.0",
    "image-webpack-loader": "^4.6.0",
    "imagemin-webpack-plugin": "^2.3.0",
    "mini-css-extract-plugin": "^0.5.0",
    "node-sass": "^4.10.0",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "postcss-flexbugs-fixes": "^4.1.0",
    "postcss-loader": "^3.0.0",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    "svg-sprite-loader": "^4.1.3",
    "ts-loader": "^5.3.1",
    "tslint": "^5.11.0",
    "tslint-loader": "^3.5.4",
    "tslint-react": "^3.6.0",
    "typescript": "^3.2.2",
    "uglifyjs-webpack-plugin": "^2.0.1",
    "url-loader": "^1.1.2",
    "webpack": "^4.27.1",
    "webpack-cli": "^3.1.2",
    "webpack-node-externals": "^1.7.2"
  },
  ...
}
```

config/webpack.config.js

```
const path = require('path');
const webpack = require('webpack');

const PACKAGE = require('../package.json');
const WebManifest = require('../public/favicon/site.webmanifest.json');

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

const getTarget = (target) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';

  if (isClient) {
    return 'web';
  } else if (isServer) {
    return 'node';
  } else if (isWebWorker) {
    return 'webworker';
  }
};

const getEntry = (target) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';

  if (isClient) {
    return {
      index: './src/client.tsx',

      inline: [
        './src/inline.scss',
        './src/inline.ts'
      ]
    };
  } else if (isServer) {
    return {
      index: './src/server.tsx'
    };
  } else if (isWebWorker) {
    return {
      '../service-worker': './src/workers/service-worker.ts'
    };
  }
};

const getOutputPath = (target) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isWebWorker = target === 'webworker';

  if (isWebWorker) {
    return path.resolve(__dirname, '../build/static');
  }

  if (isClient) {
    return path.resolve(__dirname, '../build/static');
  }

  if (isServer) {
    return path.resolve(__dirname, '../build/server');
  }
};


module.exports = (target, mode) => {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';

  const isServer = target === 'server';

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
    devtool: isDevelopment ? 'source-map' : '',
    entry: getEntry(target),
    stats: {
      children: false
    },
    output: {
      path: getOutputPath(target),
      publicPath: '/static/',

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
                sourceMap: isDevelopment
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                minimize: isProduction,
                sourceMap: isDevelopment,
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
                sourceMap: isDevelopment
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                minimize: isProduction,
                sourceMap: isDevelopment,
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
                  path.resolve(__dirname, '../src')
                ],
                minimize: isProduction,
                sourceMap: isDevelopment
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
                extract: true
              }
            },
            'image-webpack-loader'
          ]
        }
      ]
    },
    plugins: [
      ...(
        target === 'client' ? [
          new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'public/index.html',
            excludeAssets: [
              /inline.(css|js)/,
              /index\.css/
            ]
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
          from: path.resolve(__dirname, '../src/fonts'),
          to: path.resolve(__dirname, '../build/fonts')
        },
        {
          from: path.resolve(__dirname, '../public/robots.txt'),
          to: path.resolve(__dirname, '../build/robots.txt')
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
      minimize: !isServer && isProduction,
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
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

If everything is done correctly, you can run assembly:

```
npm run build:production
```

It should finish normally and create build folder with files:

* build
* build/favicon
* build/favicon/index.html
* build/favicon/site.webmanifest.json
* build/server
* build/server/index.js
* build/static
* build/static/index.html
* build/static/index.js
* build/static/inline.css
* build/static/inline.js
* build/robots.txt
* build/service-worker.js

## 3.7 Linting

Because we already add linting configs for assembling process, we can add them as separate commands into package json and git hooks.

```
"scripts": {
	"build:development": "webpack --config ./config/webpack.development.config.js",
	"build:production": "webpack --config ./config/webpack.production.config.js",
	"lint": "npm run eslint && npm run tslint",
	"eslint": "eslint -c .eslintrc.json 'src/**/*.{js,jsx}'",
	"tslint": "tslint -c tslint.json 'src/**/*.{ts,tsx}'",
	"postinstall": "git lfs update --force && cd ./node_modules/husky && npm run install -- --append"
},
```

and

```
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
    "pre-commit": [
      "npm run lint"
    ],
    "pre-push": [
      "npm run lint",
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
```

This will protect us from getting invalid code/assembly into repository.

# What we have at the moment:

We add linting and assembling, and add manage to build some files.

https://github.com/CrazySquirrel/ef-spa/commit/835fb87dbeffccd410feb47b093782dd67a35e22

Next time we going to create first app part.

https://www.linkedin.com/pulse/even-faster-single-page-application-4react-express-ssr-iastrebov/

**If you like this article, don't forget to like, share, connect and/or subscribe to [#evenfastersinglepageapplication](https://www.linkedin.com/feed/topic/?keywords=%23evenfastersinglepageapplication)**
