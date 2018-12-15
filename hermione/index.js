const path = require('path');
const {spawn, spawnSync} = require('child_process');

const { getCurrentIP } = require('../utils');

console.log(getCurrentIP());

const server = spawn('node', ['server.js'], {
  cwd: path.resolve(__dirname, '../'),
  checkCWD: true,
  stdio: 'ignore',
  detached: true
});

const steps = [
  'node ./hermione/wait-for-server.js',
  'docker-compose -f docker-compose-selenium.yml up -d --force-recreate',
  'node ./hermione/wait-for-grid.js',
  `./node_modules/.bin/hermione ${process.argv.slice(2).join(' ')}`,
  'docker-compose -f docker-compose-selenium.yml down'
];

let code = 0;

for (const step of steps) {
  const {error} = spawnSync(step, {
    cwd: path.resolve(__dirname, '../'),
    checkCWD: true,
    stdio: 'inherit',
    shell: true
  });

  if (error) {
    code = 1;
    break;
  }
}

server.kill();

process.exit(code);
