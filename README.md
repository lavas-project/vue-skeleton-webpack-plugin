# vue-skeleton-webpack-plugin

基于 vue 的 webpack 插件，为单页应用生成 skeleton。

## 基本实现

使用服务端渲染在构建时渲染 skeleton，将样式内联到最终输出的 html 中。

另外，为了开发时调试方便，会将对应路由写入`router.js`中。

## 使用方法

安装：
```bash
    npm install vue-skeleton-webpack-plugin
```

在 webpack 配置中：
```js
    new SkeletonWebpackPlugin({
        webpackConfig: require('./webpack.skeleton.conf')
    })
```

## todo

支持多页应用