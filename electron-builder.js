const os = require('os');

const isMacOs = os.platform() === 'darwin';

const PACKAGE = require('./package.json');
const MANIFEST = require('./public/favicon/site.webmanifest.json');

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
  buildVersion: PACKAGE.version,
  artifactName: '${productName}-${version}.${ext}',
  compression: 'maximum',
  mac: {
    category: 'public.app-category.social-networking',
    target: [
      'zip'
    ].concat(isMacOs ? [
      'dmg'
    ] : []),
    icon: './electron/favicon/android-chrome-512x512.png'
  },
  win: {
    target: [
      'nsis'
    ],
    icon: './electron/favicon/android-chrome-512x512.png'
  },
  linux: {
    target: [
      'deb'
    ],
    icon: './electron/favicon/android-chrome-512x512.png'
  },
  dmg: {
    artifactName: '${productName}-${version}-Setup.${ext}'
  },
  nsis: {
    artifactName: '${productName}-${version}-Setup.${ext}'
  }
};