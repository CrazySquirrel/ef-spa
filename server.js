'use strict';

// Get server env params
const SERVER_SETTINGS = require('./server.config.json');

process.env.NODE_ENV = SERVER_SETTINGS.apps[0].env.NODE_ENV || 'production';

const PORTS = SERVER_SETTINGS.apps[0][process.env.NODE_ENV].PORTS;

// Get static path
const STATIC = __dirname + '/build';

const PACKAGE = require('./package.json');

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
const RAVEN = require('raven');

// Set up sentry
RAVEN.config(
    SERVER_SETTINGS.apps[0].SENTRY,
    {
      release: PACKAGE.version,
      environment: process.env.NODE_ENV
    }
).install();

// Get express app
const APP = EXPRESS();

// Error handler
APP.use(RAVEN.requestHandler());

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
require('./server/render/index.js')(APP, RAVEN);

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

  if (certificates) {
    return {
      key: FS.readFileSync(certificates.key),
      cert: FS.readFileSync(certificates.cert),
    };
  }
}

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
