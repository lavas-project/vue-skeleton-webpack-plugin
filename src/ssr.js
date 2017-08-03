/**
 * @file ssr
 * @desc Use vue ssr to render skeleton components. The result contains html and css.
 * @author panyuqi <panyuqi@baidu.com>
 */

/* eslint-disable no-console, fecs-no-require */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const createBundleRenderer = require('vue-server-renderer').createBundleRenderer;
const MFS = require('memory-fs');

module.exports = serverWebpackConfig => new Promise((resolve, reject) => {
    // get entry name from webpack.conf
    let outputPath = path.join(serverWebpackConfig.output.path, serverWebpackConfig.output.filename);
    let outputBasename = path.basename(outputPath, path.extname(outputPath));
    let outputCssBasename = `${outputBasename}.css`;
    let outputCssPath = path.join(serverWebpackConfig.output.path, outputCssBasename);

    console.log(`Generate skeleton for ${outputBasename}...`);

    // extract css into a single file
    serverWebpackConfig.plugins.push(new ExtractTextPlugin({
        filename: outputCssBasename
    }));

    // webpack start to work
    let serverCompiler = webpack(serverWebpackConfig);
    let mfs = new MFS();
    // output to mfs
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({}, (err, stats) => {

        if (err) {
            reject(err);
            return;
        }

        stats = stats.toJson();
        stats.errors.forEach(err => {
            console.error(err);
        });
        stats.warnings.forEach(err => {
            console.warn(err);
        });

        let bundle = mfs.readFileSync(outputPath, 'utf-8');
        let skeletonCss = mfs.readFileSync(outputCssPath, 'utf-8');
        // create renderer with bundle
        let renderer = createBundleRenderer(bundle);
        // use vue ssr to render skeleton
        renderer.renderToString({}, (err, skeletonHtml) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({skeletonHtml, skeletonCss});
            }
        });
    });
});
