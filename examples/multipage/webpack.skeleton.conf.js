/**
 * @file skeleton conf
 * @author panyuqi (pyqiverson@gmail.com)
 */

'use strict';

const path = require('path');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const nodeExternals = require('webpack-node-externals');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = merge(baseWebpackConfig, {
    target: 'node',
    devtool: false,
    entry: {
        page1: resolve('./src/pages/page1/entry-skeleton.js'),
        page2: resolve('./src/pages/page2/entry-skeleton.js')
    },
    output: Object.assign({}, baseWebpackConfig.output, {
        libraryTarget: 'commonjs2'
    }),
    externals: nodeExternals({
        whitelist: /\.css$/
    }),
    plugins: []
});
