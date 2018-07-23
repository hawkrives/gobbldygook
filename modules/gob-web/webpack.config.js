/* global module, __dirname */
'use strict'

const pkg = require('./package.json')
const webpack = require('webpack')

const {DefinePlugin, NormalModuleReplacementPlugin} = webpack
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const HtmlPlugin = require('@gob/webpack-plugin-html')

const webpackServeWaitpage = require('webpack-serve-waitpage')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')

const isCI = Boolean(process.env.CI)
const outputFolder = __dirname + '/build/'

function config({mode}) {
	let isProduction = mode === 'production'
	let isDevelopment = !isProduction
	let publicPath = '/'

	let devtool = isProduction ? 'source-map' : 'eval'

	let entry = './index.js'

	let output = {
		path: outputFolder,
		publicPath: publicPath,

		// extract-text-plugin uses [contenthash], and webpack uses [hash].
		filename: isDevelopment ? 'app.js' : 'app.[hash].js',
		chunkFilename: 'chunk.[name].[chunkhash].js',

		// Add /*filename*/ comments to generated require()s in the output.
		pathinfo: true,
	}

	let serve = {
		clipboard: false,
		port: 3000,
		content: [outputFolder],
		hotClient: false,
		add(app, middleware, options) {
			// changes the requested location to index.html whenever there is
			// a request which fulfills the following criteria:
			// - The request is a GET request which accepts text/html,
			// - is not a direct file request, i.e. the requested path does not contain a . (DOT) character
			app.use(convert(history()))

			// Instead of waiting for webpack to finish compiling, see a nice progress page
			// (Options are: "default", "dark", "material")
			app.use(webpackServeWaitpage(options))
		},
	}

	let plugins = [
		// clean out the build folder between builds
		new CleanWebpackPlugin([outputFolder]),

		// Generates an index.html for us.
		new HtmlPlugin(context => {
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

                ${polyfills}

                <main id="gobbldygook"></main>
                <script src="${publicPath}${context.main}"></script>
                <script src="${publicPath}${context.styles}"></script>
                </html>
            `
		}),

		// Ignore the "full" schema in js-yaml's module, because it brings in esprima
		// to support the !!js/function type. We don't use and have no need for it, so
		// tell webpack to ignore it.
		new NormalModuleReplacementPlugin(/schema\/default_full$/, result => {
			result.request = result.request.replace(
				'default_full',
				'default_safe',
			)
		}),

		// DefinePlugin makes some variables available to the code.
		new DefinePlugin({
			VERSION: JSON.stringify(pkg.version),
			// APP_BASE is used in react-router, to set its base appropriately
			// across both local dev and gh-pages.
			APP_BASE: JSON.stringify(publicPath),
			'process.env.TRAVIS_COMMIT': JSON.stringify(
				process.env.TRAVIS_COMMIT || process.env.COMMIT_REF,
			),
		}),

		// Watcher doesn't work well if you mistype casing in a path so we use
		// a plugin that prints an error when you attempt to do this.
		new CaseSensitivePathsPlugin(),

		// copy files – into the webpack {output} directory
		new CopyWebpackPlugin([{from: './static/*', flatten: true}]),
	]

	if (isProduction) {
		plugins = [
			...plugins,
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output;
				// both options are optional
				filename: '[name].css',
				chunkFilename: '[id].css',
			}),
			new DuplicatePackageCheckerPlugin(),
		]
	}

	let babelLoader = {
		loader: 'babel-loader',
		options: {cacheDirectory: !isCI},
	}

	let urlLoader = {
		loader: 'url-loader',
		options: {limit: 10000},
	}

	let cssLoader = isProduction
		? [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
		: ['style-loader', 'css-loader', 'sass-loader']

	let module = {
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

	let optimization = {
		splitChunks: {
			cacheGroups: {
				react: {
					test: /\/node_modules\/(react.*|redux.*|styled-components)\//,
					name: 'react',
					// chunks: 'all',
					enforce: true,
				},
				vendor: {
					test: /\/node_modules\/(?!react.*|redux.*|styled-components)\//,
					name: 'vendor',
					//chunks: 'all',
					enforce: true,
				},
				styles: {
					name: 'styles',
					test: /\.css$/,
					chunks: 'all',
					enforce: true,
				},
			},
		},
	}

	return {
		target: 'web',
		mode,
		devtool,
		entry,
		output,
		serve,
		plugins,
		module,
		optimization,
	}
}

module.exports = config
