#!/usr/bin/env node

const commander = require('commander')
const packageInfo = require('../package.json')

commander
    .version(packageInfo.version)
    .usage('<command> [options]')
    .command('build', 'build bundle resources with webpack5')
    .command('dev', 'live on the browser with hot-reloaded')
    .parse(process.argv)

