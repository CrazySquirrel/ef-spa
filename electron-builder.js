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