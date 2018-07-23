/* global module, __dirname */
/* eslint-disable camelcase */
'use strict'

const pkg = require('./package.json')
const webpack = require('webpack')

const {DefinePlugin} = webpack
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('@gob/webpack-plugin-html')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isCI = Boolean(process.env.CI)
const outputFolder = __dirname + '/build/'

function config(_, {mode}) {
	const isProduction = mode === 'production'
	const isDevelopment = !isProduction
	const publicPath = '/'

	const devtool = 'source-map'//isProduction ? 'source-map' : 'eval'

	const stats = {}
	if (isProduction) {
		stats.children = false
	}

	const entry = {
		main: ['./index.js'],
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
//
// 	const devServer = {
// 		port: 3000, // for webpack-dev-server
//
// 		stats: {
// 			assets: false,
// 			version: false,
// 			hash: false,
// 			timings: false,
// 			chunks: false,
// 			chunkModules: false,
// 		},
// 		contentBase: outputFolder,
//
// 		// Makes webpack serve /index.html as the response to any request to
// 		// webpack-dev-server, so GET / and GET /s/1234 both get the index
// 		// page.
// 		historyApiFallback: true,
//
// 		// We also do the manual entry above and the manual adding of the hot
// 		// module replacment plugin below.
// 		// hot: true,
// 	}

	let plugins = [
		// clean out the build folder between builds
		new CleanWebpackPlugin([outputFolder]),

		// Generates an index.html for us.
		new HtmlPlugin(context => {
			// let cssLink = context.styles
			// 	? `<link rel="stylesheet" href="${publicPath}${
			// 			context.styles
			// 	  }">`
			// 	: null
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
                ${/*cssLink ? cssLink : ''*/''}

                <main id="gobbldygook"></main>
                <script src="${publicPath}${context.main}"></script>
                </html>
            `
		}),

		// Ignore the "full" schema in js-yaml's module, because it brings in esprima
		// to support the !!js/function type. We don't use and have no need for it, so
		// tell webpack to ignore it.
		// new NormalModuleReplacementPlugin(/schema\/default_full$/, result => {
		// 	result.request = result.request.replace(
		// 		'default_full',
		// 		'default_safe',
		// 	)
		// }),

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

		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output;
			// both options are optional
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),

		// copy files – into the webpack {output} directory
		new CopyWebpackPlugin([{from: './static/*', flatten: true}]),
	]

	const babelLoader = {
		loader: 'babel-loader',
		options: {cacheDirectory: !isCI},
	}
	const urlLoader = {loader: 'url-loader', options: {limit: 10000}}
	let cssLoader = isProduction
		? [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
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
		devtool,
		stats,
		entry,
		output,
		devServer,
		plugins,
		module,
		optimization,
	}
}

module.exports = config
