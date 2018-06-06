const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    plugins: [
        new webpack.DefinePlugin({
            CAPTCHA_KEY: "'6LfiZ00UAAAAAOv13yLR_BbBQ-X36qeBjV6y3o4x'",
            MSG_ENDPOINT: "'https://api.dynamicgravitysystems.com/dev/sendmail'",
            API_ENDPOINT: "'localhost:3000/tide'"
        })
    ],
    mode: "development"
});