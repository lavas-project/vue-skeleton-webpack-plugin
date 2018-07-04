/**
 * @file utils
 * @author panyuqi (pyqiverson@gmail.com)
 */

/* eslint-disable fecs-use-standard-promise, fecs-no-require */

const MFS = require('memory-fs');
const Promise = require('bluebird');
const webpack = require('webpack');
const webpackMajorVersion = require('webpack/package.json').version.split('.')[0];

const outputFileSystem = new MFS();

exports.runWebpackCompilerMemoryFs = function runWebpackCompiler(config) {
    if (webpackMajorVersion === '4') {
        config.mode = 'production';
    }

    const compiler = webpack(config);

    compiler.outputFileSystem = outputFileSystem;
    const run = Promise.promisify(compiler.run, {context: compiler});

    return run()
        .then(stats => {
            const compilation = stats.compilation;
            const {errors, warnings, assets, entrypoints} = compilation;

            const statsJson = stats.toJson();

            return {
                assets,
                entrypoints,
                errors,
                warnings,
                stats,
                statsJson
            };
        });
};

exports.testFs = outputFileSystem;

exports.webpackMajorVersion = webpackMajorVersion;
