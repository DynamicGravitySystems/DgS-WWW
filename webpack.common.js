const path = require('path');

module.exports = {
    entry: {
        index: './js/src/index.js',
        tideplot: './js/src/tideplot.js',
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'js/dist'),
        libraryTarget: "this",
    },
};
