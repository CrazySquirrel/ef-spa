import 'mocha';

// Import dependencies.
const fs = require('fs');
const path = require('path');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const REPORT_PATH = './tests/lighthouse/report';

// Previous score
let SCOREs: any = {};

// Try to download previous score
try {
  SCOREs = JSON.parse(
      fs.readFileSync(
          `${REPORT_PATH}/../scores.json`,
          'utf8',
      ),
  );
} catch (e) {
  SCOREs = {};
}

// Import chai
const CHAI = require('chai');

// Tested urls
const URLs = [
    'https://ef-spa.crazysquirrel.ru/',
];

// Chrome options
const opts = {
  chromeFlags: ['--show-paint-rects'],
  port: 3444,
};

// LightHouse test
describe('LightHouse', () => {
  let chrome: any;

  // Before test run browser
  before((done) => {
    chromeLauncher
    .launch(opts)
    .then((c: any) => {
      chrome = c;

      opts.port = c.port;

      done();
    })
    .catch(done);
  });

  // After test close browser
  after((done) => {
    chrome
    .kill()
    .then(() => {
      done();
    })
    .catch(done);

    fs.writeFileSync(
        path.resolve(`${REPORT_PATH}/../scores.json`),
        JSON.stringify(SCOREs),
    );
  });

  // Test each url
  URLs.forEach((url: string) => {
    // Create test
    it(url, (done) => {
      // Call lighthouse
      lighthouse(url, opts, null)
      .then((result: any) => {
        // Get lighthouse report
        const audits = JSON.parse(result.report).audits;

        // Process report score
        for (const key in audits) {
          if (audits.hasOwnProperty(key)) {
            if (audits[key].scoreDisplayMode === 'binary') {
              if (audits[key].score !== 1) {
                console.log(audits[key].id);
              }
            } else if (audits[key].scoreDisplayMode === 'numeric') {
              if (audits[key].score !== 1) {
                console.log(audits[key].id);
              }
            } else if (audits[key].scoreDisplayMode === 'manual') {
              // console.log(audits[key]);
            } else if (audits[key].scoreDisplayMode === 'informative') {
              // console.log(audits[key]);
            } else if (audits[key].scoreDisplayMode === 'not-applicable') {
              // console.log(audits[key]);
            } else {
              console.log(audits[key].id);
            }
          }
        }

        let sum = 0;
        let count = 0;

        // Calculate sum and count
        for (const key in audits) {
          if (audits.hasOwnProperty(key) && typeof audits[key].score === 'number') {
            sum += audits[key].score;
            count++;
          }
        }

        // Calculate score
        const score = sum / count;

        // Compare score to previous or 90%
        if (SCOREs[url]) {
          CHAI.expect(score).to.be.at.least(SCOREs[url]);
        } else {
          CHAI.expect(score).to.be.at.least(90);
        }

        // Save new score
        SCOREs[url] = score;

        // Finish test
        done();
      })
      .catch(done);
      // Set test maximum timeout
    }).timeout(60 * 1000);
  });
});
