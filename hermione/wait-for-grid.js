const http = require('http');
const process = require('process');

function wait() {
  return new Promise((resolve, reject) => {
    console.log('Waiting for the Grid');

    setTimeout(() => {
      http.get('http://localhost:4444/wd/hub/status', (resp) => {
        let data = '';

        resp.on('data', (chunk) => data += chunk);

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          if (JSON.parse(data).value.ready !== true) {
            reject(new Error('Not ready'));
          }
        });

      }).on('error', reject);
    }, 1000);
  })
  .catch(wait);
}

wait()
.then(() => console.log('Selenium Grid is up'))
.then(() => process.exit(0));
