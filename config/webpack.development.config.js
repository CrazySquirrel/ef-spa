module.exports = [
  require('./webpack.config.js')('client', 'development'),
  require('./webpack.config.js')('server', 'development'),
  require('./webpack.config.js')('webworker', 'development'),
  require('./webpack.config.js')('electron-main', 'development'),
  require('./webpack.config.js')('electron-renderer', 'development')
];