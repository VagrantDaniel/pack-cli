#!/usr/bin/env node

const commander = require('commander')
const webpack = require('webpack')
const Server = require('webpack-dev-server')
const { merge } = require('webpack-merge')
const chalk = require('chalk')
const path = require('path')

const builder = require('../src/build')
const { defaultConfigFile } = require('../src/const')

commander
    .usage('[options]')
    .option('-p, --port <port>', 'set dev server port')

commander.on('--help', () => {
    normal('  Examples:')
    normal()
    normal(chalk.gray('    # run app with default arguments'))
    normal('    $ pack dev')
    normal()
    normal(chalk.gray('    # run app with specified config file'))
    normal('    $ pack dev -c ./config.js')
})

commander.parse(process.argv)

const rootPath = commander.dir || process.cwd()
const configFilePath = path.resolve(rootPath, commander.config || `./${defaultConfigFile}`)
const packageFilePath = path.resolve(rootPath, './package.json')
const config = require(configFilePath)
config.pkg = require(packageFilePath)

const webpackConfig = builder(config)
const compiler = webpack(webpackConfig)

const devServerConfig = merge({
    open: true,
    historyApiFallback: true,
    port: 1388,
    client: {
      logging: 'warn',
      overlay: false,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  }, config.devServer || {})

const server = new Server({ ...devServerConfig, open: true }, compiler)

server.start()

