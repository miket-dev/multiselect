const path = require('path');

module.exports = {
    mode: 'production',
    entry: './concat.js',
    output: {
        filename: 'multiselect.min.js',
        path: __dirname
    }
};
