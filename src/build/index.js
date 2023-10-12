const HtmlWebpackPlugin = require('html-webpack-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const Config = require('webpack-chain')
const path = require('path')
const { existsSync } = require('fs')
const vueConfig = require('./vue')
const reactConfig = require('./react')
const configBabel = require('./configBabel')
const cache = require('./cache')
const optimization = require('./optimization')
const helper = require('./helper')

const browerlist = [
    'android >= 37',
    'ios_saf >= 10.3',
    'last 2 and_qq version',
    'last 2 and_chr version',
    'last 2 chrome version',
    'last 2 safari version',
    'last 2 edge version',
    'ie 11'
]

const getBabelPresets = function() {
    return [
        require.resolve('@babel/preset-env'),
        {
          bugfixes: true,
          shippedProposals: true,
          targets: browerlist,
        },
    ]
}

module.exports = function packBuild(config, callback) {
    const chain = new Config()

    const options = {
        entry: config.entry || 'src/index',
        html: {

        },
        ...config,
    }

    options.dir = process.cwd()



    chain.merge({
        entry: typeof options.entry === 'object' ? 
            options.entry : {
                main: path.resolve(options.entry)
            },
        output: {
            path: path.resolve('public'),
            filename: 'js/[name].bundle.js',
            chunkFilename: 'js/[name].chunk.js',
            publicPath: '/',
        },

        mode: 'development',

        devtool: options.devtool || 'cheap-module-source-map',

        resolveLoader: {
            modules: [
                path.resolve(process.cwd(), 'node_modules'),
                path.resolve(__dirname, '../../node_modules'),
            ],
        },

        resolve: {
            modules: [
                path.resolve(process.cwd(), 'node_modules'),
                path.resolve(__dirname, '../../node_modules'),
            ],
            extensions: [
                '.js',
                '.jsx',
                '.json',
                '.ts',
                '.tsx',
            ]
        },

        module: {
            rule: {
                css: {
                    test: /\.css$/,
                    use: [{
                        loader: 'style-loader',
                        options: {
                            // emit: false,
                        }
                    }, {
                        loader: 'css-loader',
                        options: {
                            esModule: false, // 禁止 ESModule 转 CommonJS
                        }
                    }, {
                        // PostCSS 负责把 CSS 代码解析成抽象语法树结构，从而实现了 CSS 预处理（pre-processor），如 sass、less
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        }
                    }]
                },
                stylus: {
                    test: /\.styl(us)?$/,
                    use: [{
                        loader: 'style-loader',
                        options: {
                            // emit: false,
                        }
                    }, {
                        loader: 'css-loader',
                        options: {
                            esModule: false, // 禁止 ESModule 转 CommonJS
                        }
                    }, {
                        // PostCSS 负责把 CSS 代码解析成抽象语法树结构，从而实现了 CSS 预处理（pre-processor），如 sass、less
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                plugins: [
                                  postcssPresetEnv({ browsers: browerlist }),
                                ]
                            },
                        }
                    }, {
                        loader: 'stylus-loader',
                        options: {
                            stylusOptions: {
                                includeCSS: true,
                            }
                        }
                    }]
                },
                scss: {
                    test: /\.scss$/,
                    use: [{
                        loader: 'style-loader',
                        options: {
                            // emit: false,
                        }
                    }, {
                        loader: 'css-loader',
                        options: {
                            esModule: false, // 禁止 ESModule 转 CommonJS
                        }
                    }, {
                        // PostCSS 负责把 CSS 代码解析成抽象语法树结构，从而实现了 CSS 预处理（pre-processor），如 sass、less
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                plugins: [
                                  postcssPresetEnv({ browsers: browerlist }),
                                ]
                            },
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                        }
                    }]
                },
                less: {
                    test: /\.less$/,
                    use: [{
                        loader: 'style-loader',
                        options: {
                            // emit: false,
                        }
                    }, {
                        loader: 'css-loader',
                        options: {
                            esModule: false, // 禁止 ESModule 转 CommonJS
                        }
                    }, {
                        // PostCSS 负责把 CSS 代码解析成抽象语法树结构，从而实现了 CSS 预处理（pre-processor），如 sass、less
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                plugins: [
                                  postcssPresetEnv({ browsers: browerlist }),
                                ]
                            },
                        }
                    }, {
                        loader: 'less-loader',
                        options: {
                        }
                    }]
                },
                font: {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    use: {
                      'url-loader': {
                        loader: require.resolve('url-loader'),
                        options: {
                          name: 'fonts/[name].[hash:7].[ext]',
                          limit: 3000,
                        },
                      },
                    },
                },
            }
        },

        plugins: [
        ]
    })

    chain.plugin('HtmlWebpackPlugin').use(HtmlWebpackPlugin, [{
        // inject: false,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyJS: true,
        },
    }])

    const htmlOptions = options.html

    chain.plugin('HtmlWebpackPlugin').tap(args => [{
        ...args[0],
        title: '首页',
        // template: `${require.resolve('../loader/ejs')}!${htmlOptions.template ? path.resolve(process.cwd(), htmlOptions.template) : path.resolve(__dirname, '../template.ejs')}`,
        template: path.resolve(__dirname, '../template.html'),
        favicon: '',
        filename: 'index.html'
    }])

    chain.module
        .rule('babel')
        .test(/\.m?jsx?$/)
        .use('babel-loader')
        .loader(require.resolve('babel-loader'))
        .options({
            // parserOpts: {
            //     allowImportExportEverywhere: true
            // },
            sourceType: 'unambiguous',
            presets: [
                getBabelPresets(),
            ],
            plugins: [
                [
                    require.resolve('@babel/plugin-transform-runtime'),
                    {
                        corejs: { version: 3, proposals: true },
                        useESModules: true,
                    },
                ]
            ]
        })
    
    chain.module
        .rule('typescript')
        .test(/\.tsx?$/)
        .use('babel-loader')
        .loader(require.resolve('babel-loader'))
        .options({
            // parserOpts: {
            //     allowImportExportEverywhere: true
            // },
            sourceType: 'unambiguous',
            presets: [
                [
                    require.resolve('@babel/preset-typescript'), 
                    {
                        allExtensions: true,
                        isTSX: true,
                    }
                ],
                getBabelPresets(),
            ],
            plugins: [
                [
                    require.resolve('@babel/plugin-transform-runtime'),
                    {
                        corejs: { version: 3, proposals: true },
                        useESModules: true,
                    },
                ],
            ],
        })
    
    const TsConfigPath = path.resolve(process.cwd(), 'tsconfig.json')
    if (existsSync(TsConfigPath)) {
        const extensions = {}

        if (config.language === 'react') {

        } else {
            extensions.vue = {
                enabled: true,
                compiler: require.resolve('@vue/compiler-sfc')
            }
        }

        chain.plugin('ts-checker')
            .use(require.resolve('fork-ts-checker-webpack-plugin'), [{
                async: true,
                typescript: {
                    configFile: TsConfigPath,
                    extensions,
                }
            }])
    }

    // https://blog.hhking.cn/2020/08/21/babel-with-node-modules/
    chain.module
        .rule('babel')
        .exclude.add([/\/core-js/, /webpack\/buildin/, /\\core-js/, /webpack\\buildin/])


    if (config.language === 'react') {
        reactConfig(chain, options)
    } else {
        vueConfig(chain, options)
    }

    configBabel(chain, options)

    if (options.chainWebpack) {
        options.chainWebpack(chain, options)
    }

    cache(chain, options)

    optimization(chain, options)

    helper(chain, options)

    const webpackConfig = chain.toConfig()

    return webpackConfig
}