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
        './src/scss/inline.scss',
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
    devtool: 'source-map',
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
            'cache-loader',
            'babel-loader',
            'eslint-loader'
          ],
          include: path.resolve(__dirname, '../src')
        },
        {
          test: /\.(ts|tsx)$/,
          use: [
            'cache-loader',
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
            'cache-loader',
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
            'cache-loader',
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
            'cache-loader',
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
            'cache-loader',
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
              /inline.(css|js)/
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