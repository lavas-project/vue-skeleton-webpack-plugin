/**
 * @file ssr
 * @author panyuqi <panyuqi@baidu.com>
 */

/* eslint-disable no-console */

import path from 'path';
import webpack from 'webpack';
import MFS from 'memory-fs';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import {createBundleRenderer} from 'vue-server-renderer';

module.exports = serverWebpackConfig => new Promise((resolve, reject) => {
    // get entry name from webpack.conf
    let outputPath = path.join(serverWebpackConfig.output.path, serverWebpackConfig.output.filename);
    let outputBasename = path.basename(outputPath, path.extname(outputPath));
    let outputCssBasename = `${outputBasename}.css`;
    let outputCssPath = path.join(serverWebpackConfig.output.path, outputCssBasename);

    console.log(`Generate skeleton for ${outputBasename}...`);

    // extract css
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
        let renderer = createBundleRenderer(bundle);
        // ssr skeleton
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
