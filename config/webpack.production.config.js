module.exports = [
  require('./webpack.config.js')('client', 'production'),
  require('./webpack.config.js')('server', 'production'),
  require('./webpack.config.js')('webworker', 'production'),
  require('./webpack.config.js')('electron-main', 'production'),
  require('./webpack.config.js')('electron-renderer', 'production')
];