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
