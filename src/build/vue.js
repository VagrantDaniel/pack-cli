
module.exports = (chain, options) => {
    const vueLoaderPlugin = require('vue-loader').VueLoaderPlugin
    chain.plugin('vue').use(vueLoaderPlugin)

    // jsx 处理
    chain.module.rule('babel').use('babel-loader').tap(args => {
        args.plugins.push(require.resolve('@vue/babel-plugin-jsx'))
        return args
    })

    chain.module.rule('typescript').use('babel-loader').tap(args => {
        args.plugins.push(require.resolve('@vue/babel-plugin-jsx'))
        return args
    })

    chain.module.rule('vue')
        .test(/\.vue$/)
        .use('vue-loader')
        .loader(require.resolve('vue-loader'))
}