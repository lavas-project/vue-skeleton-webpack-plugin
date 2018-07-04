/**
 * @file generate skeleton
 * @author panyuqi <panyuqi@baidu.com>
 */

/* eslint-disable no-console, fecs-no-require */

const ssr = require('./ssr');
const {insertAt, isObject, generateRouterScript} = require('./util');

const DEFAULT_PLUGIN_OPTIONS = {
    webpackConfig: {},
    insertAfter: '<div id="app">',
    quiet: false
};

const DEFAULT_ENTRY_NAME = 'main';

const PLUGIN_NAME = 'VueSkeletonWebpackPlugin';

class SkeletonPlugin {

    constructor(options = {}) {
        this.options = Object.assign({}, DEFAULT_PLUGIN_OPTIONS, options);
    }

    apply(compiler) {
        // compatible with webpack 4.x
        if (compiler.hooks) {
            compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
                if (!compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
                    console.error('VueSkeletonWebpackPlugin must be placed after HtmlWebpackPlugin in `plugins`.');
                    return;
                }

                compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(PLUGIN_NAME, (htmlPluginData, callback) => {
                    this.generateSkeleton(compiler, compilation, this.options, htmlPluginData, callback);
                });
            });
        }
        else {
            compiler.plugin('compilation', compilation => {
                compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
                    this.generateSkeleton(compiler, compilation, this.options, htmlPluginData, callback);
                });
            });
        }
    }

    generateSkeleton(compiler, compilation, options, htmlPluginData, callback) {
        let {insertAfter, quiet, router, minimize} = options;

        let webpackConfig = Object.assign({}, options.webpackConfig)

        let entry = webpackConfig.entry;
        // cache entries
        let skeletonEntries;

        if (isObject(entry)) {
            skeletonEntries = Object.assign({}, entry);
        }
        else {
            let entryName = DEFAULT_ENTRY_NAME;
            let parentEntry = compiler.options.entry;

            if (isObject(parentEntry)) {
                entryName = Object.keys(parentEntry)[0];
            }
            skeletonEntries = {
                [entryName]: entry
            };
        }

        let usedChunks = Object.keys(htmlPluginData.assets.chunks);
        let entryKey;

        // find current processing entry
        if (Array.isArray(usedChunks)) {
            entryKey = Object.keys(skeletonEntries).find(v => usedChunks.indexOf(v) > -1);
        }
        else {
            entryKey = DEFAULT_ENTRY_NAME;
        }
        // make sure current entry has skeleton config, fix #23
        if (entryKey) {
            // set current entry & output in webpack config
            webpackConfig.entry = skeletonEntries[entryKey];
            if (!webpackConfig.output) {
                webpackConfig.output = {};
            }
            webpackConfig.output.filename = `skeleton-${entryKey}.js`;

            ssr(webpackConfig, {
                quiet, compilation, context: compiler.context
            }).then(({skeletonHtml, skeletonCSS, watching}) => {
                // insert inlined styles into html
                let headTagEndPos = htmlPluginData.html.lastIndexOf('</head>');
                htmlPluginData.html = insertAt(htmlPluginData.html, `<style>${skeletonCSS}</style>`, headTagEndPos);

                // replace mounted point with ssr result in html
                let appPos = htmlPluginData.html.lastIndexOf(insertAfter) + insertAfter.length;

                // inject router code in SPA mode
                let routerScript = '';
                if (router) {
                    let isMPA = !!(Object.keys(skeletonEntries).length > 1);
                    routerScript = generateRouterScript(router, minimize, isMPA, entryKey);
                }
                htmlPluginData.html = insertAt(htmlPluginData.html, skeletonHtml + routerScript, appPos);
                callback(null, htmlPluginData);
            }).catch((e) => {
                console.log(e);
            });
        }
        else {
            callback(null, htmlPluginData);
        }
    }

    static loader(ruleOptions = {}) {
        return Object.assign(ruleOptions, {
            loader: require.resolve('./loader'),
            options: Object.assign({}, ruleOptions.options)
        });
    }
}

module.exports = SkeletonPlugin;
