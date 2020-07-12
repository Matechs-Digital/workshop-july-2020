const path = require('path')

module.exports = {
    resolve: {
        extensions: [".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                    plugins: [],
                },
            }
        ],
    },
}