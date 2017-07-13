/**
 * @file loader
 * @author panyuqi <panyuqi@baidu.com>
 */

/* eslint-disable fecs-no-require */

const loaderUtils = require('loader-utils');
const insertAt = require('./util').insertAt;

const ENTRY_NAME_HOLDER = /\[name\]/gi;
const ENTRY_NAME_CAP_HOLDER = /\[nameCap\]/gi;

module.exports = function (source) {
    const options = loaderUtils.getOptions(this);
    let {entry, importTemplate, routePathTemplate, insertAfter} = options;

    // position to insert in router.js
    let routesPos = source.indexOf(insertAfter) + insertAfter.length;

    if (!Array.isArray(entry)) {
        entry = [entry];
    }

    entry.forEach(entryName => {
        // capitalize first letter
        let entryCap = entryName.replace(/([a-z])(.*)/, (w, firstLetter, rest) => firstLetter.toUpperCase() + rest);
        // route path
        let skeletonRoutePath = routePathTemplate.replace(ENTRY_NAME_HOLDER, entryName)
            .replace(ENTRY_NAME_CAP_HOLDER, entryCap);
        let importExpression = importTemplate.replace(ENTRY_NAME_HOLDER, entryName)
            .replace(ENTRY_NAME_CAP_HOLDER, entryCap);
        let routeExpression = `{
            path: '${skeletonRoutePath}',
            name: '${entryName}-skeleton',
            component: ${entryCap}
        },`;
        source = insertAt(source, routeExpression, routesPos);
        source += importExpression;
    });

    return source;
};
