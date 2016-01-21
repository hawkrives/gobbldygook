/* global module */
'use strict'

const pkg = require('./package.json')
const webpack = require('webpack')

const ProvidePlugin = webpack.ProvidePlugin
const NormalModuleReplacementPlugin = webpack.NormalModuleReplacementPlugin
const DefinePlugin = webpack.DefinePlugin
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin
const DedupePlugin = webpack.optimize.DedupePlugin
const OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlPlugin = require('./scripts/webpack/html-plugin')
const buildFilename = require('./scripts/webpack/build-filename')
const NotifierPlugin = require('webpack-notifier')

const isProduction = (process.env.NODE_ENV === 'production')
const isDev = (process.env.NODE_ENV === 'development')
const isTest = (process.env.NODE_ENV === 'test')

const outputFolder = 'build/'

const urlLoaderLimit = 10000
const useHash = false

const config = {
	replace: null,
	port: 3000,
	hostname: 'localhost',

	stats: {},

	entry: [
		'./src/start.js',
	],

	output: {
		path: outputFolder + '/',
		publicPath: '',

		filename: isDev ? 'app.js' : buildFilename(pkg, useHash, 'js'),
		cssFilename: isDev ? 'app.css' : buildFilename(pkg, useHash, 'css'),

		hash: useHash,
	},

	devServer: {
		info: false,
		historyApiFallback: true,
		// For some reason simply setting this doesn't seem to be enough, which
		// is why we also do the manual entry above and the manual adding of
		// the hot module replacment plugin below.
		hot: true,
		contentBase: outputFolder,
		stats: false,
	},

	node: {
		process: false,
		Buffer: false,
	},

	resolve: {
		extensions: [
			'',
			'.js',
			'.json',
		],
	},

	plugins: [
		new HtmlPlugin({
			// To serve a default HTML file, or not to serve, that is the question.
			html(context) {
				return {
					'index.html': [
						'<!DOCTYPE html>',
						'<html lang="en-US">',
						'<meta charset="UTF-8">',
						'<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
						'<title>Gobbldygook</title>',
						context.css && `<link rel="stylesheet" href="${context.css}">`,
						'<body>',
						'  <main id="app"></main>',
						'  <aside id="notifications"></aside>',
						'</body>',
						`<script src="${context.main}"></script>`,
						'</html>',
					].join('\n'),
				}
			},
			isDev: isDev,
		}),

		new ProvidePlugin({
			Promise: 'bluebird',
			debug: 'debug',
		}),

		// Ignore the "full" schema in js-yaml's module, because it brings in esprima
		// to support the !!js/function type. We don't use and have no need for it, so
		// tell webpack to ignore it.
		new NormalModuleReplacementPlugin(/schema\/default_full$/, function(result) {
			result.request = result.request.replace('default_full', 'default_safe')
		}),

		new DefinePlugin({
			VERSION: JSON.stringify(pkg.version),
			DEVELOPMENT: isDev,
			PRODUCTION: isProduction,
			TESTING: isTest,
		}),

		new NotifierPlugin({title: `${pkg.name} build`}),
	],

	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: ['babel-loader'],
			},
			{
				test: /\.worker.js$/,
				exclude: /node_modules/,
				loaders: ['worker-loader', 'babel-loader'],
			},
			{
				test: /\.json$/,
				loaders: ['json-loader'],
			},
			{
				test: /\.(otf|eot|ttf|woff2?)$/,
				loader: 'url-loader',
				query: {limit: urlLoaderLimit},
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				loader: 'url-loader',
				query: {limit: urlLoaderLimit},
			},
		],
	},

	postcss: [
		require('autoprefixer')({ browsers: ['last 2 versions', 'Firefox ESR'] }),
	],
}


// dev specific stuff
if (isDev) {
	// debugging option
	config.devtool = 'eval'

	// add dev server and hotloading clientside code
	config.entry.unshift(
		'webpack-dev-server/client?http://' + config.hostname + ':' + config.port,
		'webpack/hot/only-dev-server'
	)

	config.devServer.port = config.port
	config.devServer.host = config.hostname

	// add dev plugins
	config.plugins = config.plugins.concat([
		new HotModuleReplacementPlugin(),
	])

	config.module.loaders.push({
		test: /\.css$/,
		loaders: ['style-loader', 'css-loader', 'postcss-loader'],
	})

	// Add optional loaders
	config.module.loaders.push({
		test: /\.s(c|a)ss$/,
		loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
	})
}

else if (isTest) {
	config.module.loaders.push({
		test: /\.css$/,
		loaders: ['style-loader', 'css-loader', 'postcss-loader'],
	})

	config.module.loaders.push({
		test: /\.s(c|a)ss$/,
		loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
	})
}

// production
else if (isProduction) {
	config.devtool = 'source-map'

	config.stats.children = false

	// minify in production
	config.plugins = config.plugins.concat([
		new DedupePlugin(),
		new OccurenceOrderPlugin(true),
		new UglifyJsPlugin({
			compress: {
				warnings: false,
			},
			output: {
				comments: false,
			},
		}),
		new ExtractTextPlugin(config.output.cssFilename, {
			allChunks: true,
		}),
		new DefinePlugin({
			'process.env': {NODE_ENV: JSON.stringify('production')},
		}),
	])

	config.module.loaders.push({
		test: /\.css$/,
		loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader']),
	})

	config.module.loaders.push({
		test: /\.s(c|a)ss$/,
		loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'sass-loader']),
	})
}

else {
	throw new Error('Unknown environment! Not development, production, nor test!')
}

module.exports = config
