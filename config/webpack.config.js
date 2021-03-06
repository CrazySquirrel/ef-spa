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
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
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
      electron: './src/electron-main.ts'
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
  const isElectronRenderer = target === 'electron-renderer';
  const isStorybook = target === 'storybook';

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
            (
                isDevelopment || isStorybook
            ) ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
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
            (
                isDevelopment || isStorybook
            ) ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
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
          test: /\.md$/,
          use: [
            {
              loader: 'html-loader',
            },
            {
              loader: 'markdown-loader',
            },
          ],
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
                extract: !isElectronRenderer && !isStorybook
              }
            },
            'image-webpack-loader'
          ]
        }
      ]
    },
    plugins: [
      new StyleLintPlugin(),
      ...(
          isClient ? [
            new HtmlWebpackPlugin({
              filename: 'index.html',
              template: 'public/index.html',
              excludeAssets: [
                /inline.(css|js)/
              ]
            })
          ] : []
      ),
      ...(
          isElectronRenderer ? [
            new HtmlWebpackPlugin({
              filename: 'index.html',
              template: 'public/electron.html'
            })
          ] : []
      ),
      ...(
          (isClient || isElectronRenderer) ? [
            new HtmlWebpackExcludeAssetsPlugin(),
            new CspHtmlWebpackPlugin({
              'base-uri': '\'self\'',
              'object-src': '\'none\'',
              'script-src': ['\'unsafe-inline\'', '\'self\'', '\'unsafe-eval\'', '\'nonce-%INLINE_SCRIPT_CSP%\''],
              'style-src': ['\'unsafe-inline\'', '\'self\'', '\'unsafe-eval\'','\'nonce-%INLINE_STYLE_CSP%\'']
            }, {
              devAllowUnsafe: false,
              enabled: true,
              hashingMethod: 'sha256',
            }),
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
      ...(
          !isStorybook ? [
            new ExtractTextPlugin({
              filename: '[name].css'
            }),
            new MiniCssExtractPlugin({
              filename: '[name].css'
            })
          ] : []
      ),
      new CleanWebpackPlugin(getOutputPath(target), {
        root: __dirname + '/../',
        exclude: [ 'package.json' ],
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
      ],
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            enforce: true,
          },
        },
      }
    },
    performance: {
      hints: isProduction ? 'warning' : false
    }
  };
};