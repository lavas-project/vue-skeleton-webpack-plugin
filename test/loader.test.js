/**
 * @file test loader.js
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

import simpleConfig from '../examples/simple/webpack.config.js';

const fs = testFs;

const simpleExamplePath = path.resolve(__dirname, '../examples/simple');
const webpackBuildPath = path.resolve(simpleExamplePath, './dist');

const readFile = Promise.promisify(fs.readFile, {context: fs});

let webpackBuildStats = null;

if (webpackMajorVersion === '4') {
    test.skip('will not be run', t => {
        t.fail();
    });
}
else {

    test.before('run webpack build first', async t => {
        webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig);
    });

    test('it should run successfully', async t => {
        let {stats, errors} = webpackBuildStats;
        t.falsy(stats.hasWarnings() && errors.hasWarnings());
    });

    test('it should insert skeleton route into routes', async t => {
        let htmlContent = await readFile(path.join(webpackBuildPath, 'static/js/app.js'));
        htmlContent = htmlContent.toString();
        let insertedRoute = `path: '/skeleton',`;
        t.true(htmlContent.includes(insertedRoute));
    });
}
