module.exports = (chain, options) => {
    // jsx 处理
    chain.module.rule('babel').use('babel-loader').tap(args => {
        args.presets.push(require.resolve('@babel/preset-react'))
        args.plugins.push(require.resolve('react-refresh/babel'))
        return args
    })

    chain.module
        .rule('typescript')
        .test(/\.tsx?$/)
        .use('ts-loader')
        .loader(require.resolve('ts-loader'))
    
    chain.plugin('loadable-webpack-plugin')
        .use(require.resolve('@loadable/webpack-plugin'))

    chain.plugin('react-refresh-webpack-plugin')
        .use(require.resolve('@pmmmwh/react-refresh-webpack-plugin'))

}