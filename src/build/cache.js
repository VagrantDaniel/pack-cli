const path = require('path')
const { existsSync } = require('fs')

const depNames = [
  'pack.config.js',
  'package.json',
  'package-lock.json',
  'yarn.lock',
]

const getCacheDependency = dir => {
    const res = depNames.reduce((acc, cur) => {
      const relative = path.resolve(dir, cur)
      const root = path.resolve(process.cwd(), cur)
  
      if (existsSync(relative)) {
        acc.push(relative)
      }
      if (existsSync(root)) {
        acc.push(root)
      }
      return acc
    }, [])
  
    const result = Array.from(new Set(res))
    return result
}

module.exports = (chain, options) => {
    chain.cache({
        type: 'filesystem', // 开启持久缓存
        cacheDirectory: path.resolve(options.dir || process.cwd(), 'node_modules/.cache/pack-cli'), // 缓存存放的路径
        buildDependencies: { // 当这些文件发生变化时，缓存会完全失效，重新构建
          config: getCacheDependency(options.dir || process.cwd()),
        },
        version: 'client',
        // managedPath: ['./node_modules'] 受控目录
        // profile: false 是否输出缓存处理的详细日志
        // maxAge: 缓存失效事件
      })

    chain.output
        .filename('js/[name].[contenthash:7].js')
        .chunkFilename('js/[name].[contenthash:7].chunk.js')
    
    chain.plugin('mini-css-extract-plugin')
        .use(require('mini-css-extract-plugin'), [{
        ignoreOrder: true,
        filename: 'css/[name].[contenthash:7].css',
        chunkFilename: 'css/[name].[contenthash:7].chunk.css',
        }])
}
