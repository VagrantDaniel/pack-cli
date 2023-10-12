
const HappyPack = require('happypack')

module.exports = (chain, options) => {
    const babelLoaderRule = chain.module.rule('babel').use('babel-loader').toConfig()
    chain.module.rule('babel').use('babel-loader').loader('happypack/loader?id=jsx').options({})
    chain.plugin('happypack').use(HappyPack, [{
      id: 'jsx',
      loaders: [babelLoaderRule],
      threads: 3,
    }])
}