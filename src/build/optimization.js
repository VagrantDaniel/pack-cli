const path = require('path')

module.exports = (chain, options) => {
    chain.optimization
      .minimizer('js')
      .use(require.resolve('terser-webpack-plugin'), [{
        parallel: true,
        terserOptions: {
          safari10: true,
          compress: { drop_console: process.env.NODE_ENV === 'production' ? true : false },
        },
      }])
}