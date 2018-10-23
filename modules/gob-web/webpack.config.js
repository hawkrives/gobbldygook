/* global module, __dirname */
// @flow
'use strict'

const pkg = require('./package.json')
const webpack = require('webpack')

const babelConfig = require('../../babel.config.js')

const {
	DefinePlugin,
	LoaderOptionsPlugin,
	NormalModuleReplacementPlugin,
} = webpack

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlPlugin = require('@gob/webpack-plugin-html')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const PacktrackerPlugin = require('@packtracker/webpack-plugin')

const isCI = Boolean(process.env.CI)
const outputFolder = __dirname + '/build/'

const html = ({cssHref, scriptSrc}) => {
	let cssLink = cssHref ? `<link rel="stylesheet" href="${cssHref}">` : ''

	return `
<!DOCTYPE html>
<html lang="en-US">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Gobbldygook</title>
${cssLink}
<script async type="module" src="${scriptSrc}"></script>

<main id="gobbldygook"></main>
</html>
`.trim()
}

const entryPointName = 'main'

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
		[entryPointName]: ['./index.js'],
	}

	if (isDevelopment) {
		// add dev server client-side code
		entry[entryPointName].unshift('webpack-dev-server/client?/')
	}

	const output = {
		path: outputFolder,
		publicPath: publicPath,

		// extract-text-plugin uses [contenthash], and webpack uses [hash].
		filename: isDevelopment ? 'app.js' : 'app.[hash].js',
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
	}

	let plugins = [
		// clean out the build folder between builds
		new CleanWebpackPlugin([outputFolder]),

		// Generates an index.html for us.
		new HtmlPlugin(entryPointName, context => {
			let cssHref = context.htmlPluginCss
				? `${publicPath}${context.htmlPluginCss}`
				: null
			let scriptSrc = `${publicPath}${context.htmlPluginJs}`

			if (isDevelopment && !context.htmlPluginJs) {
				scriptSrc = `${publicPath}app.js`
			}

			return html({cssHref, scriptSrc})
		}),

		// Ignore the "full" schema in js-yaml's module, because it brings in esprima
		// to support the !!js/function type. We don't use and have no need for it, so
		// tell webpack to ignore it.
		new NormalModuleReplacementPlugin(/schema\/default_full$/, result => {
			result.request = result.request.replace('default_full', 'core')
		}),
		new NormalModuleReplacementPlugin(/schema\/default_safe$/, result => {
			result.request = result.request.replace('default_safe', 'core')
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
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
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
				filename: isDevelopment ? 'app.css' : 'app.[contenthash].css',
				chunkFilename: 'chunk.[name].[chunkhash].css',
			}),
			new LoaderOptionsPlugin({
				minimize: true,
			}),
			new DuplicatePackageCheckerPlugin(),
		]
	}

	if (isCI) {
		plugins = [
			...plugins,
			new PacktrackerPlugin({
				project_token: process.env.PACKTRACKER_API_KEY,
				upload: true,
			}),
		]
	}

	const babelLoader = {
		loader: 'babel-loader',
		options: {
			cacheDirectory: !isCI,
			...babelConfig,
		},
	}

	const urlLoader = {loader: 'url-loader', options: {limit: 10000}}

	const module = {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [babelLoader],
			},
			// {
			// 	test: /\.worker\.js$/,
			// 	exclude: /node_modules/,
			// 	use: ['worker-loader', babelLoader],
			// },
			{
				test: /check-student\.worker\.js$/,
				use: [
					{
						loader: 'worker-loader',
						options: {name: 'worker.check-student.[hash].js'},
					},
					babelLoader,
				],
			},
			{
				test: /load-data\.worker\.js$/,
				use: [
					{
						loader: 'worker-loader',
						options: {name: 'worker.load-data.[hash].js'},
					},
					babelLoader,
				],
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
				use: [
					isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							implementation: require('dart-sass'),
						},
					},
				],
			},
		],
	}

	return {
		mode: isProduction ? 'production' : 'development',
		target: 'web',
		devtool,
		stats,
		entry,
		output,
		devServer,
		plugins,
		module,
	}
}

module.exports = config
