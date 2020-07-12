const path = require("path");

module.exports = {
    resolve: {
        alias: {
            '@workshop/components': path.resolve("../components/src")
        },
        extensions: [".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "babel-loader",
            },
        ],
    },
};