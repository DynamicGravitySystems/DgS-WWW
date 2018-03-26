const path = require('path');

module.exports = {
    entry: {
        index: './js/src/index.js',
        plot: './js/src/plot.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'js/dist'),
        libraryTarget: "this",
    }
};
