const path = require('path')
const fs = require('fs')
const typeToExtension = (type) => type === 'domhtml' ? 'html' : type;

function saveResults(results, artifacts, flags) {
    let promise = Promise.resolve(results);
    const cwd = process.cwd();

    Promise.all([
        import('lighthouse/cli/printer.js'), 
        import('lighthouse/report/generator/file-namer.js'), 
        import('lighthouse/core/lib/asset-saver.js')
    ]).then((promises) => {
        const [Printer, { getFilenamePrefix }, assetSaver] = promises

        const configuredPath = !flags.outputPath || flags.outputPath === 'stdout' ?
            getFilenamePrefix(Object.keys(results.lhr)[0]) : flags.outputPath.replace(/\.\w{2,4}$/, '');
        const resolvedPath = path.resolve(cwd, configuredPath);

        if (flags.saveArtifacts) {
            assetSaver.saveArtifacts(artifacts, resolvedPath);
        }
    
        if (flags.saveAssets) {
            promise = promise.then(_ => assetSaver.saveAssets(artifacts, results.audits, resolvedPath));
        }
    
        return promise.then(_ => {
            if (Array.isArray(flags.output)) {
                return flags.output.reduce((innerPromise, outputType) => {
                    const outputPath = `${resolvedPath}.report.${typeToExtension(outputType)}`;
                    return innerPromise.then((_) => Printer.write(results, outputType, outputPath));
                }, Promise.resolve(results));
            } else {
                const outputPath =
                    flags.outputPath || `${resolvedPath}.report.${typeToExtension(flags.output)}`;
                    return Printer.write(results.report, flags.output, outputPath).then(results => {
                        if (flags.output === Printer.OutputMode[Printer.OutputMode.html] ||
                            flags.output === Printer.OutputMode[Printer.OutputMode.domhtml]) {
                            if (flags.view) {
                                // opn(outputPath, {wait: false});
                            } else {
                            console.log(
                                'CLI',
                                'Protip: Run lighthouse with `--view` to immediately open the HTML report in your browser');
                            }
                        }
                
                        return results;
                    });
            }
        });
    })
}

// 启动 lighthouse，测试 address 性能
function lighthouseRun(address, config, chrome) {
    const cwd = process.cwd();

    return import('lighthouse').then(lib => {
        return lib.default(address, {
            logLevel: 'info',
            output: 'html',
            port: chrome.port,
            ...config,
        }).then(results => {
            
            const artifacts = results.artifacts
            // fs.writeFileSync(`${path.resolve(cwd, 'lighthouse-results', '.json')}`, JSON.stringify(results))

            // return Promise.resolve(chrome)
            delete results.artifacts
            return saveResults(results, artifacts, {
                saveArtifacts: true,
                saveAssets: true,
                output: 'html',
            })
        })
    })
}

// 启动空头浏览器
function launchChromeAndRun(address) {
    import('chrome-launcher').then(chromeLauncher => {
        const launcher = new chromeLauncher.Launcher({})
        launcher.isDebuggerReady().catch(() => {
            console.log('Lighthouse CLI', 'Launching Chrome...')
            return chromeLauncher.launch().then(chrome => chrome)
        }).then((chrome) => lighthouseRun(address, this.options, chrome))
        .then((chrome) => chrome.kill())
    })
}

class WebpackLighthousePlugin {

    constructor(options) {
        this.options = options
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('lighthousePlugin', (compilation, callback) => {
            launchChromeAndRun(this.options.url)
            callback()
        })
    }
}

module.exports = WebpackLighthousePlugin