const LighthousePlugin = require('../plugins/lighthouse')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const WebpackBarPlugin = require('webpackbar')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

module.exports = (chain, options) => {
    if (options.bundleAnalyzer) {
        chain.plugin('BundleAnalyzerPlugin').use(BundleAnalyzerPlugin, [{
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: '8888',
        }])
    }

    chain.plugin('WebpackBarPlugin').use(WebpackBarPlugin, [{
        profile: true,
        reporters: ['profile'],
    }])

    // const config = chain.toConfig()
    // chain.plugin('SpeedMeasurePlugin').use(SpeedMeasurePlugin, [{
    //     ...config
    // }])
    // smp.wrap({
    //     ...chain.toConfig()
    // })

    // chain.plugin('LighthousePlugin').use(LighthousePlugin, [{
    //     url: 'http://localhost:1388/'
    // }])
}