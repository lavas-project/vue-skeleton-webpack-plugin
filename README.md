# vue-skeleton-webpack-plugin

基于 vue 的 webpack 插件，为单页/多页应用生成 skeleton，提升首屏展示体验。

## 基本实现

参考了[Ele.me的这篇文章](https://medium.com/elemefe/upgrading-ele-me-to-progressive-web-app-2a446832e509)，
使用服务端渲染在构建时渲染 skeleton 组件，将样式内联到最终输出的 html 中。

另外，为了开发时调试方便，会将对应路由写入`router.js`中，可通过`/skeleton`路由访问。目前只支持单页应用，多页应用后续会支持。

## 使用方法

安装：
```bash
    npm install vue-skeleton-webpack-plugin
```

在 webpack 中引入插件：
```js
// webpack.conf.js
import SkeletonWebpackPlugin from 'vue-skeleton-webpack-plugin';

plugins: [
    new SkeletonWebpackPlugin({
        webpackConfig: require('./webpack.skeleton.conf')
    })
]
```

在单页应用中开发模式下自动插入路由规则：
```js
// webpack.dev.conf.js
import SkeletonWebpackPlugin from 'vue-skeleton-webpack-plugin';

module: {
    rules: [
        SkeletonWebpackPlugin.loader({
            entry: 'skeleton', // 例如组件为Skeleton.vue，通过/skeleton路由规则访问
            routerEntry: resolve('src/router.js') // 路由文件路径
        })
    ]
}
```

## 示例

具体应用示例可参考[lavas-template-vue-appshell](https://github.com/lavas-project/lavas-template-vue-appshell)项目。

## TODO

* [ ] 多页应用中开发模式下自动插入多条路由规则。
