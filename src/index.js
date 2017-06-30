/**
 * @file generate skeleton
 * @author panyuqi <panyuqi@baidu.com>
 */

import ssr from './ssr';
import {insertAt} from './util';

class SkeletonPlugin {

    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {

        let webpackConfig = this.options.webpackConfig;
        let entry = webpackConfig.entry;
        // cache entries
        let skeletonEntries;

        if (Object.prototype.toString.call(entry).match('Object')) {
            skeletonEntries = Object.assign({}, entry);
        }
        else {
            skeletonEntries = {
                app: entry
            };
        }

        compiler.plugin('compilation', compilation => {

            compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
                let usedChunks = htmlPluginData.plugin.options.chunks;
                let entryKey;
                // find current processing entry
                if (Array.isArray(usedChunks)) {
                    entryKey = Object.keys(skeletonEntries);
                    entryKey = entryKey.filter(v => usedChunks.indexOf(v) > -1)[0];
                }
                else {
                    entryKey = 'app';
                }

                webpackConfig.entry = skeletonEntries[entryKey];
                webpackConfig.output.filename = `skeleton-${entryKey}.js`;

                ssr(webpackConfig).then(({skeletonHtml, skeletonCss}) => {

                    // insert inlined styles into html
                    let headTagEndPos = htmlPluginData.html.lastIndexOf('</head>');
                    htmlPluginData.html = insertAt(htmlPluginData.html, `<style>${skeletonCss}</style>`, headTagEndPos);

                    // replace mounted point with ssr result in html
                    let appTemplate = '<div id="app">';
                    let appPos = htmlPluginData.html.lastIndexOf(appTemplate) + appTemplate.length;
                    htmlPluginData.html = insertAt(htmlPluginData.html, skeletonHtml, appPos);
                    callback(null, htmlPluginData);
                });
            });
        });
    }

    static loader({entry, routerEntry, options = {}}) {
        return {
            resource: routerEntry,
            loader: require.resolve('./loader'),
            options: Object.assign(options, {
                entry
            })
        };
    }
}

module.exports = SkeletonPlugin;
