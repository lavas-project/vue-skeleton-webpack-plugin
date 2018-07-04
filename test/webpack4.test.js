/**
 * @file a simple test case for webpack 4
 * @author panyuqi (pyqiverson@gmail.com)
 */

/* eslint-disable fecs-use-standard-promise */

import 'babel-polyfill';
import * as path from 'path';
import Promise from 'bluebird';
import test from 'ava';
import {
    runWebpackCompilerMemoryFs,
    testFs,
    webpackMajorVersion
} from './utils.js';

const fs = testFs;

const simpleExamplePath = path.resolve(__dirname, '../examples/webpack4');
const webpackBuildPath = path.resolve(simpleExamplePath, './dist');

const readFile = Promise.promisify(fs.readFile, {context: fs});

let webpackBuildStats = null;

if (webpackMajorVersion  === '4') {
    let simpleConfig = require('../examples/webpack4/webpack.config.js');

    test.before('run webpack build first', async t => {
        webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig);
    });

    test('it should run successfully', async t => {
        let {errors, warnings} = webpackBuildStats;
        t.falsy(errors.length && warnings.length);
    });

    test('it should insert the ssr result of skeleton into mounted point', async t => {
        let htmlContent = await readFile(path.join(webpackBuildPath, 'index.html'));

        htmlContent = htmlContent.toString();
        // ssr dom has been injected into mounted point
        t.true(htmlContent.includes('<div data-server-rendered=true class=skeleton-wrapper'));

        // inlined css
        t.true(htmlContent.includes('<style>.skeleton-header'));

        // emit images imported from Skeleton.vue
        t.true(htmlContent.includes('url(static/img/logo.90f7061.jpg)'));
        t.true(fs.existsSync(path.join(webpackBuildPath, 'static/img/logo.90f7061.jpg')));
    });

    test('it should use autoprefixer with postcss correctly.', async t => {
        let htmlContent = await readFile(path.join(webpackBuildPath, 'index.html'));
        htmlContent = htmlContent.toString();

        // autoprefixer
        t.true(htmlContent.includes('display: -webkit-box;'));
    });
}
else {
    test.skip('will not be run', t => {
        t.fail();
    });
}
