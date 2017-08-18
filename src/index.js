/**
 * @file generate skeleton
 * @author panyuqi <panyuqi@baidu.com>
 */

/* eslint-disable no-console, fecs-no-require */

const ssr = require('./ssr');
const insertAt = require('./util').insertAt;

const DEFAULT_PLUGIN_OPTIONS = {
    webpackConfig: {},
    insertAfter: '<div id="app">'
};

class SkeletonPlugin {

    constructor(options = {}) {
        this.options = Object.assign({}, DEFAULT_PLUGIN_OPTIONS, options);
    }

    apply(compiler) {

        let {webpackConfig, insertAfter} = this.options;
        let entry = webpackConfig.entry;
        // cache entries
        let skeletonEntries;

        if (Object.prototype.toString.call(entry).match('Object')) {
            skeletonEntries = Object.assign({}, entry);
        }
        else {
            skeletonEntries = {
                main: entry
            };
        }

        compiler.plugin('compilation', compilation => {

            // add listener for html-webpack-plugin
            compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {

                let usedChunks = Object.keys(htmlPluginData.assets.chunks);
                let entryKey;

                // find current processing entry
                if (Array.isArray(usedChunks)) {
                    entryKey = Object.keys(skeletonEntries).find(v => usedChunks.indexOf(v) > -1);
                }
                else {
                    entryKey = 'main';
                }

                // set current entry & output in webpack config
                webpackConfig.entry = skeletonEntries[entryKey];
                webpackConfig.output.filename = `skeleton-${entryKey}.js`;

                ssr(webpackConfig).then(({skeletonHtml, skeletonCss}) => {
                    // insert inlined styles into html
                    let headTagEndPos = htmlPluginData.html.lastIndexOf('</head>');
                    htmlPluginData.html = insertAt(htmlPluginData.html, `<style>${skeletonCss}</style>`, headTagEndPos);

                    // replace mounted point with ssr result in html
                    let appPos = htmlPluginData.html.lastIndexOf(insertAfter) + insertAfter.length;
                    htmlPluginData.html = insertAt(htmlPluginData.html, skeletonHtml, appPos);
                    callback(null, htmlPluginData);
                });
            });
        });
    }

    static loader(ruleOptions = {}) {
        return Object.assign(ruleOptions, {
            loader: require.resolve('./loader'),
            options: Object.assign({}, ruleOptions.options)
        });
    }
}

module.exports = SkeletonPlugin;
