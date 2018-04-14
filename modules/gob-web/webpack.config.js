/* global module, __dirname */
/* eslint-disable camelcase */
// @flow
'use strict'

const pkg = require('./package.json')
const webpack = require('webpack')

const {
    DefinePlugin,
    HotModuleReplacementPlugin,
    LoaderOptionsPlugin,
    NormalModuleReplacementPlugin,
    NamedModulesPlugin,
    optimize: {CommonsChunkPlugin},
} = webpack

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlPlugin = require('./scripts/webpack/html-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const isCI = Boolean(process.env.CI)
const outputFolder = __dirname + '/build/'

function config() {
    const isProduction = process.env.NODE_ENV === 'production'
    const isDevelopment = !isProduction
    const publicPath = '/'

    const devtool = isProduction ? 'source-map' : 'eval'

    const stats = {}
    if (isProduction) {
        stats.children = false
    }

    const entry = {
        main: ['./modules/gob-web/index.js'],
    }

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
    }

    const plugins = [
        // clean out the build folder between builds
        new CleanWebpackPlugin([outputFolder]),

        // Generates an index.html for us.
        new HtmlPlugin(context => {
            let cssPath = context.css ? `${publicPath}${context.css}` : null
            let bugsnag = isProduction
                ? '<script src="https://d2wy8f7a9ursnm.cloudfront.net/bugsnag-3.min.js" data-apikey="7e393deddaeb885f5b140b4320ecef6b"></script>'
                : ''
            let polyfills = isProduction
                ? '<script src="https://cdn.polyfill.io/v2/polyfill.js"></script>'
                : ''

            return `
                <!DOCTYPE html>
                <html lang="en-US">
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Gobbldygook</title>

                <link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/nhhpgddphdimipafjfiggjnbbmcoklld">

                ${bugsnag}
                ${polyfills}
                ${cssPath ? `<link rel="stylesheet" href="${cssPath}">` : ''}

                <main id="gobbldygook"></main>
                <script src="${publicPath}${context.main}"></script>
                </html>
            `
        }),

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
            'process.env.TRAVIS_COMMIT': JSON.stringify(
                process.env.TRAVIS_COMMIT || process.env.COMMIT_REF
            ),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),

        // Extract the common libraries into a single file so that the chunks
        // don't need to individually bundle them.
        new CommonsChunkPlugin({
            name: 'commons',
            filename: '[name].js',
            children: true,
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
        new CopyWebpackPlugin([{from: 'modules/gob-web/static/*', flatten: true}]),
    ]

    if (isProduction) {
        // minify in production
        plugins.push(
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    ecma: 8,
                    warnings: false,
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
        options: {cacheDirectory: !isCI},
    }
    const urlLoader = {loader: 'url-loader', options: {limit: 10000}}
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
