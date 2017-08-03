/**
 * @file loader
 * @desc Insert route of skeleton into router.js, so that developer can
 * visit route path in dev mode to debug skeleton components
 * @author panyuqi <panyuqi@baidu.com>
 */

/* eslint-disable fecs-no-require */

const loaderUtils = require('loader-utils');
const insertAt = require('./util').insertAt;

const DEFAULT_LOADER_OPTIONS = {
    // template of importing skeleton component
    importTemplate: 'import [nameCap] from \'@/pages/[nameCap].vue\';',
    // template of route path
    routePathTemplate: '/skeleton-[name]',
    // position to insert route object in router.js file
    insertAfter: 'routes: ['
};

const ENTRY_NAME_HOLDER = /\[name\]/gi;
const ENTRY_NAME_CAP_HOLDER = /\[nameCap\]/gi;

module.exports = function (source) {
    const options = Object.assign({}, DEFAULT_LOADER_OPTIONS, loaderUtils.getOptions(this));
    let {entry, importTemplate, routePathTemplate, insertAfter} = options;

    // find position to insert in router.js
    let routesPos = source.indexOf(insertAfter) + insertAfter.length;

    entry = Array.isArray(entry) ? entry : [entry];

    entry.forEach(entryName => {
        // capitalize first letter in entryName eg.skeleton -> Skeleton
        let entryCap = entryName.replace(/([a-z])(.*)/, (w, firstLetter, rest) => firstLetter.toUpperCase() + rest);

        // replace placeholder in routeTpl and importTpl
        let [skeletonRoutePath, importExpression] = [routePathTemplate, importTemplate]
            .map(pathStr => pathStr.replace(ENTRY_NAME_HOLDER, entryName)
                .replace(ENTRY_NAME_CAP_HOLDER, entryCap));

        // route object to insert
        let routeExpression = `{
            path: '${skeletonRoutePath}',
            name: '${entryName}-skeleton',
            component: ${entryCap}
        },`;

        // insert route object into routes array
        source = insertAt(source, routeExpression, routesPos);

        // insert import sentence in the head
        source += importExpression;
    });

    return source;
};
