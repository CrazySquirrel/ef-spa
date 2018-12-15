const path = require('path');
const {spawn, spawnSync} = require('child_process');

const server = spawn('node', ['server.js'], {
  cwd: path.resolve(__dirname, '../'),
  checkCWD: true,
  stdio: 'ignore',
  detached: true
});

const steps = [
  'docker-compose -f docker-compose-selenium.yml up -d --force-recreate',
  'node ./hermione/wait-for-grid.js',
  `./node_modules/.bin/hermione ${process.argv.slice(2).join(' ')}`,
  'docker-compose -f docker-compose-selenium.yml down'
];

for (const step of steps) {
  spawnSync(step, {
    cwd: path.resolve(__dirname, '../'),
    checkCWD: true,
    stdio: 'inherit',
    shell: true
  });
}

server.kill();
