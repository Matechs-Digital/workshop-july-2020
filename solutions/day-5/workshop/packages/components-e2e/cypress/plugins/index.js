const preprocessor = require('cypress-react-unit-test/plugins/load-webpack')
module.exports = (on, config) => {
    config.env.webpackFilename = 'webpack.config.js'
    preprocessor(on, config)
    return config
}