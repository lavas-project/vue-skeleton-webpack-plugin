/**
 * @file loader
 * @author panyuqi <panyuqi@baidu.com>
 */

import loaderUtils from 'loader-utils';
import {insertAt} from './util';

module.exports = function (source) {

    const entry = loaderUtils.getOptions(this).entry;
    let entryCap = entry.replace(/([a-z])(.*)/, (w, firstLetter, rest) => firstLetter.toUpperCase() + rest);
    let routesTemplate = 'routes: [';
    let routesPos = source.indexOf(routesTemplate) + routesTemplate.length;

    const SKELETON_IMPORT = `import ${entryCap} from '@/pages/${entryCap}.vue';`;
    const SKELETON_ROUTE = `{
        path: '/${entry}',
        name: '${entry}',
        component: ${entryCap}
    },`;

    source = insertAt(source, SKELETON_ROUTE, routesPos);
    return SKELETON_IMPORT + source;
};
