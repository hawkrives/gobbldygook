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

const HtmlPlugin = require('@gob/webpack-plugin-html')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isCI = Boolean(process.env.CI)
const outputFolder = __dirname + '/build/'

const html = ({cssHref, scriptSrc}) => {
	let cssLink = cssHref ? `<link rel="stylesheet" href="${cssHref}">` : ''

	return `
<!DOCTYPE html>
<html lang="en-US">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Area Editor - Gobbldygook</title>
${cssLink}
<script async type="module" src="${scriptSrc}"></script>

<main id="app"></main>
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
		[entryPointName]: ['./start.js'],
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
		port: 4000, // for webpack-dev-server

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
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),

		// copy files – into the webpack {output} directory
		new CopyWebpackPlugin([]),
	]

	if (isProduction) {
		plugins = [
			...plugins,
			new MiniCssExtractPlugin({
				filename: isDevelopment ? 'app.css' : 'app.[contenthash].css',
				chunkFilename: 'chunk.[name].[chunkhash].css',
			}),
			new LoaderOptionsPlugin({minimize: true}),
		]
	}

	const babelLoader = {
		loader: 'babel-loader',
		options: {
			cacheDirectory: !isCI,
			...babelConfig,
		},
	}

	const module = {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [babelLoader],
			},
			{
				test: /\.css$/,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader',
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
