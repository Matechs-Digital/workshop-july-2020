const path = require("path");

module.exports = {
    resolve: {
        alias: {
            '@workshop/components': path.resolve("../components/src"),
            '@workshop/common': path.resolve("../common/src")
        },
        extensions: [".tsx", ".ts", ".js", ".jsx"],
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