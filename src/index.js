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

const DEFAULT_LOADER_OPTIONS = {
    importTemplate: 'import [name] from \'@/pages/[name].vue\';',
    routePathTemplate: '/skeleton-[name]',
    insertAfter: 'routes: ['
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
            options: Object.assign({}, DEFAULT_LOADER_OPTIONS,
                Object.assign({}, ruleOptions.options))
        });
    }
}

module.exports = SkeletonPlugin;
