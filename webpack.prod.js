const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common, {
    plugins: [
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
           CAPTCHA_KEY: "'6LdaQ00UAAAAALKO6Y8zMJcd8UXfS9C0Aeg5rok0'",
           API_ENDPOINT: "'https://api2.dynamicgravitysystems.com/tide'"
        })
    ],
    mode: "production"
});
