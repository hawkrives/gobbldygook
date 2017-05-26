/* global module, __dirname */
/* eslint-disable camelcase */
// @flow
'use strict'

const pkg = require('./package.json')
const webpack = require('webpack')
const url = require('url')

// TODO: remove me after upgrading to babel-loader@7
process.noDeprecation = true

const {
    DefinePlugin,
    HotModuleReplacementPlugin,
    LoaderOptionsPlugin,
    NormalModuleReplacementPlugin,
    NamedModulesPlugin,
    optimize: { CommonsChunkPlugin, UglifyJsPlugin },
} = webpack

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlPlugin = require('./scripts/webpack/html-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const isCI = Boolean(process.env.CI)
const outputFolder = __dirname + '/build/'

const entries = {
    bfr: 'buffer',
    hanson: './modules/hanson-format',
    common: [
        'classnames',
        'debug',
        'delay',
        'listify',
        'ord',
        'p-props',
        'p-series',
        'p-settle',
        'plur',
        'redux',
        'redux-promise',
        'redux-thunk',
        'redux-undo',
        'serialize-error',
        'stabilize',
        'whatwg-fetch',
    ],
    react: ['react', 'react-dom', 'react-router', 'history'],
    reactCommon: [
        'react-modal',
        'react-redux',
        'react-side-effect',
        'dnd-core',
        'react-dnd',
        'react-dnd-html5-backend',
    ],
    yaml: ['js-yaml'],
    idb: ['treo', 'idb-range', 'idb-request'],
    cm: ['codemirror'],
    html: ['htmlparser2', 'css-select'],
}

// We have to manually list these so they are loaded in the correct order.
const bundleNames = [
    'reactCommon',
    'react',
    'common',
    'yaml',
    'cm',
    'html',
    'idb',
    'hanson',
    'bfr',
]

const allBundleNames = Object.keys(entries)
const missingNames = allBundleNames.filter(name => !bundleNames.includes(name))
const extraNames = bundleNames.filter(name => !allBundleNames.includes(name))
if (missingNames.length) {
    throw new Error(`'bundleNames' is missing ${missingNames.join(', ')}`)
} else if (extraNames.length) {
    throw new Error(
        `'bundleNames' has too many names! ${extraNames.join(', ')}`
    )
}

function config() {
    const isProduction = process.env.NODE_ENV === 'production'
    const isDevelopment = !isProduction

    let publicPath = '/'
    if (isProduction) {
        // We use "homepage" field to infer "public path" at which the app is served.
        // Webpack needs to know it to put the right <script> hrefs into HTML even in
        // single-page apps that may serve index.html for nested URLs like /todos/42.
        // We can't use a relative path in HTML because we don't want to load something
        // like /todos/42/static/js/bundle.7289d.js. We have to know the root.
        publicPath = pkg.homepage ? url.parse(pkg.homepage).pathname : '/'
        if (!publicPath.endsWith('/')) {
            // If we don't do this, file assets will get incorrect paths.
            publicPath += '/'
        }
    }

    const devtool = isProduction ? 'source-map' : 'eval'

    const stats = {}
    if (isProduction) {
        stats.children = false
    }

    const entry = Object.assign(
        {},
        { main: ['./modules/web/index.js'] },
        entries
    )

    if (isDevelopment) {
        // add dev server and hotloading clientside code
        entry.main.unshift(
            // 'react-hot-loader/patch',
            'webpack-dev-server/client?/',
            'webpack/hot/only-dev-server'
        )
    }

    const output = {
        path: outputFolder,
        publicPath: publicPath,

        // extract-text-plugin uses [contenthash], and webpack uses [hash].
        filename: isDevelopment ? 'app.js' : `${pkg.name}.[hash].js`,
        chunkFilename: 'chunk.[name].[chunkhash].js',

        // Add /*filename*/ comments to generated require()s in the output.
        pathinfo: true,
    }

    const devServer = {
        port: 3000, // for webpack-dev-server

        stats: {
            assets: false,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false,
        },
        contentBase: outputFolder,

        // Makes webpack serve /index.html as the response to any request to
        // webpack-dev-server, so GET / and GET /s/1234 both get the index
        // page.
        historyApiFallback: true,

        // We also do the manual entry above and the manual adding of the hot
        // module replacment plugin below.
        hot: true,
    }

    const node = {
        process: false,
        Buffer: false,
    }

    const plugins = [
        // clean out the build folder between builds
        new CleanWebpackPlugin([outputFolder]),

        // Generates an index.html for us.
        new HtmlPlugin(
            context => `
            <!DOCTYPE html>
            <html lang="en-US">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Gobbldygook</title>

            <!-- Start Single Page Apps for GitHub Pages -->
            <script>
                // Single Page Apps for GitHub Pages
                // https://github.com/rafrex/spa-github-pages
                (function(l) {
                    if (l.search) {
                        var query = {}
                        l.search.slice(1).split('&').forEach(function(val) {
                            var a = val.split('=')
                            query[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&')
                        })
                        if (query.p !== undefined) {
                            window.history.replaceState(null, null,
                                l.pathname.slice(0, -1) + (query.p || '') +
                                (query.query ? ('?' + query.query) : '') +
                                l.hash
                            )
                        }
                    }
                }(window.location))
            </script>
            <!-- End Single Page Apps for GitHub Pages -->

            <link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/nhhpgddphdimipafjfiggjnbbmcoklld">

            ${isProduction ? '<script src="https://d2wy8f7a9ursnm.cloudfront.net/bugsnag-3.min.js" data-apikey="7e393deddaeb885f5b140b4320ecef6b"></script>' : ''}
            ${isProduction ? '<script src="https://cdn.polyfill.io/v2/polyfill.js"></script>' : ''}

            ${context.css ? `<link rel="stylesheet" href="${publicPath}${context.css}">` : ''}

            <body><main id="gobbldygook"></main></body>

            <script src="${publicPath}${context.manifest}"></script>
            ${Object.keys(entries)
                .map(k => `${publicPath}${context[k]}`)
                .map(path => `<script src="${path}"></script>`)
                .join('\n')}
            <script src="${publicPath}${context.main}"></script>
            </html>
        `
        ),

        // Ignore the "full" schema in js-yaml's module, because it brings in esprima
        // to support the !!js/function type. We don't use and have no need for it, so
        // tell webpack to ignore it.
        new NormalModuleReplacementPlugin(/schema\/default_full$/, result => {
            result.request = result.request.replace(
                'default_full',
                'default_safe'
            )
        }),

        // DefinePlugin makes some variables available to the code.
        new DefinePlugin({
            VERSION: JSON.stringify(pkg.version),
            // APP_BASE is used in react-router, to set its base appropriately
            // across both local dev and gh-pages.
            APP_BASE: JSON.stringify(publicPath),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),

        // Extract the common libraries into a single file so that the chunks
        // don't need to individually bundle them.
        new CommonsChunkPlugin({
            names: [...bundleNames, 'manifest'],
            filename: '[name].[hash].js',
            minChunks: Infinity,
        }),

        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        new CaseSensitivePathsPlugin(),

        new LoaderOptionsPlugin({
            options: {
                worker: {
                    output: {
                        filename: '[hash].worker.js',
                        chunkFilename: '[id].[hash].worker.js',
                    },
                },
            },
        }),

        new NamedModulesPlugin(),

        // copy files – into the webpack {output} directory
        new CopyWebpackPlugin([
            { from: 'modules/web/static/*', flatten: true }
        ])
    ]

    if (isProduction) {
        // minify in production
        plugins.push(
            new UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    warnings: false,
                    pure_getters: true,
                    screw_ie8: true,
                    unsafe: true,
                },
                mangle: {
                    screw_ie8: true,
                },
                output: {
                    comments: false,
                    screw_ie8: true,
                },
            })
        )
        plugins.push(
            new ExtractTextPlugin({
                filename: isDevelopment
                    ? 'app.css'
                    : `${pkg.name}.[contenthash].css`,
                allChunks: true,
            })
        )
        plugins.push(
            new LoaderOptionsPlugin({
                minimize: true,
            })
        )
        plugins.push(new DuplicatePackageCheckerPlugin())
    }

    if (isDevelopment) {
        // add dev plugins
        plugins.push(new HotModuleReplacementPlugin())
    }

    const babelLoader = {
        loader: 'babel-loader',
        options: { cacheDirectory: !isCI },
    }
    const babelForNodeModules = {
        loader: 'babel-loader',
        options: {
            cacheDirectory: !isCI,
            plugins: ['transform-es2015-modules-commonjs'],
        },
    }
    const urlLoader = { loader: 'url-loader', options: { limit: 10000 } }
    const cssLoader = isProduction
        ? ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', 'sass-loader'],
          })
        : ['style-loader', 'css-loader', 'sass-loader']

    const module = {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [babelLoader],
            },
            {
                test: /\.js$/,
                include: /node_modules[/]p-.*[/].*[.]js$/,
                use: [babelForNodeModules],
            },
            {
                test: /\.worker\.js$/,
                exclude: /node_modules/,
                use: ['worker-loader', babelLoader],
            },
            {
                test: /\.json$/,
                use: ['json-loader'],
            },
            {
                test: /\.otf|eot|ttf|woff2?$/,
                use: [urlLoader],
            },
            {
                test: /\.jpe?g|png|gif$/,
                use: [urlLoader],
            },
            {
                test: /\.s?css$/,
                use: cssLoader,
            },
        ],
    }

    return {
        target: 'web',
        devtool,
        stats,
        entry,
        output,
        devServer,
        node,
        plugins,
        module,
    }
}

module.exports = config
