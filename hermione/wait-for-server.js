const http = require('http');
const process = require('process');

const serverConfig = require('../server.config.json');

process.env.NODE_ENV = serverConfig.apps[0].env.NODE_ENV || 'production';

const PORTS = serverConfig.apps[0][process.env.NODE_ENV].PORTS;

function wait() {
  return new Promise((resolve, reject) => {
    console.log('Waiting for the Server');

    setTimeout(() => {
      http.get(`http://localhost:${PORTS.HTTP}/`, (resp) => {
        let data = '';

        resp.on('data', (chunk) => data += chunk);

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve();
        });

      }).on('error', reject);
    }, 1000);
  })
  .catch(wait);
}

wait()
.then(() => console.log('Server is up'))
.then(() => process.exit(0));
