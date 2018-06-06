const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: {
        index: './js/src/index.js',
        tideplot: './js/src/tideplot.js'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'vue-template-loader',
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
      new VueLoaderPlugin()
    ],
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'js/dist'),
        libraryTarget: "this"
    },
};
