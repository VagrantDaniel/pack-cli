#!/usr/bin/env node

const commander = require('commander')
const webpack = require('webpack')
const chalk = require('chalk')
const ora = require('ora')
const path = require('path')

const builder = require('../src/build')
const { defaultConfigFile } = require('../src/const')

const normal = console.log
const fatal = function fatal(err) {
    const msg = err.message || err

    console.error(chalk.red('x'), 'pack', chalk.gray('.'), msg)

    process.exit(1)
}

commander
    .usage('[options]')
    .option('-c, --config <path>', 'set pack\'s config file [default: ./pack.config.js]')

commander.on('--help', () => {
    normal('  Examples:')
    normal()
    normal(chalk.gray('   # build app with default arguments'))
    normal('  pack build')
    normal()
    normal(chalk.gray('   # build app with specified arguments'))
    normal(`  pack build -c ./xxx.config.js`)
    normal()
})

commander.parse(process.argv)

const spinner = ora({
    text: 'pack build started'
})
const rootPath = commander.dir || process.cwd()
const configFilePath = path.resolve(rootPath, commander.config || `./${defaultConfigFile}`)
const packageFilePath = path.resolve(rootPath, './package.json')
const config = require(configFilePath)
config.pkg = require(packageFilePath)

spinner.start()

const webpackConfig = builder(config)

webpack(webpackConfig, (err, stats) => {
    if (err) {
        spinner.fail('pack build failed.')
        fatal(err)
    }

    normal()
    spinner.succeed('pack build success.')

    if (stats) {
        normal(stats.toString({
            modules: true,
            chunks: true,
            children: true,
            colors: true,
        }))

        if (stats.hasErrors()) {
            spinner.fail('pack build failed')
            process.exit(1)
        }
    }
})