/**
 * @file test multipage, use html-webpack-plugin
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

import multipageConfig from '../examples/multipage2/webpack.config.js';

const fs = testFs;

const multipageExamplePath = path.resolve(__dirname, '../examples/multipage2');
const webpackBuildPath = path.resolve(multipageExamplePath, './dist');

const readFile = Promise.promisify(fs.readFile, {context: fs});

let webpackBuildStats = null;

if (webpackMajorVersion === '4') {
    test.skip('will not be run', t => {
        t.fail();
    });
}
else {
    test.before('run webpack build first', async t => {
        webpackBuildStats = await runWebpackCompilerMemoryFs(multipageConfig);
    });

    test('it should run successfully', async t => {
        let {stats, errors} = webpackBuildStats;
        t.falsy(stats.hasWarnings() && errors.hasWarnings());
    });

    test('it should insert relative skeleton into every page', async t => {
        let result = await Promise.all([
            readFile(path.join(webpackBuildPath, 'page1.html')),
            readFile(path.join(webpackBuildPath, 'page2.html'))
        ]);
        t.true(result[0].toString().includes('Skeleton of Page1'));
        t.true(result[1].toString().includes('Skeleton of Page2'));
    });

    test('it should insert skeleton route successfully', async t => {
        let page1JSContent = await readFile(path.join(webpackBuildPath, 'static/js/page1.js'));
        let insertedRoute = 'path: \'/page1-skeleton\'';
        t.true(page1JSContent.toString().includes(insertedRoute));
    });
}
