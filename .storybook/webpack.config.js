const baseWebpackConfig = require('../config/webpack.config.js')('storybook', 'production');

module.exports = (baseConfig, env, config) => {
    config.module = baseWebpackConfig.module;
    config.resolve = baseWebpackConfig.resolve;

    config.plugins.push(...baseWebpackConfig.plugins);

    return config;
};
