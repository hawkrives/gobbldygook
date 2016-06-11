/* global module */
'use strict'

const pkg = require('./package.json')
const webpack = require('webpack')
const path = require('path')

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
const DedupePlugin = webpack.optimize.DedupePlugin
const DefinePlugin = webpack.DefinePlugin
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin
const NormalModuleReplacementPlugin = webpack.NormalModuleReplacementPlugin
const OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlPlugin = require('./scripts/webpack/html-plugin')
const NotifierPlugin = require('webpack-notifier')

const isProduction = (process.env.NODE_ENV === 'production')
const isDevelopment = (process.env.NODE_ENV === 'development')
const isTest = (process.env.NODE_ENV === 'test')

const outputFolder = 'build/'
const urlLoaderLimit = 10000

const config = {
	replace: null,
	port: 3000,
	hostname: 'localhost',

	stats: {},

	entry: ['./src/index.js'],

	output: {
		path: outputFolder + '/',
		publicPath: '',

		// extract-text-plugin uses [contenthash], and webpack uses [hash].
		filename: isDevelopment ? 'app.js' : `${pkg.name}.[hash].js`,
		cssFilename: isDevelopment ? 'app.css' : `${pkg.name}.[contenthash].css`,
		chunkFilename: 'chunk.[name].[chunkhash].js',

		hash: true,
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
		alias: {
			src: path.resolve(__dirname, 'src'),
		},
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
						'  <main id="gobbldygook"></main>',
						'</body>',
						`<script src="${context.common}"></script>`,
						`<script src="${context.main}"></script>`,
						'</html>',
					].join('\n'),
				}
			},
			isDev: isDevelopment,
		}),

		// Ignore the "full" schema in js-yaml's module, because it brings in esprima
		// to support the !!js/function type. We don't use and have no need for it, so
		// tell webpack to ignore it.
		new NormalModuleReplacementPlugin(/schema\/default_full$/, function(result) {
			result.request = result.request.replace('default_full', 'default_safe')
		}),

		new DefinePlugin({
			VERSION: JSON.stringify(pkg.version),
			DEVELOPMENT: isDevelopment,
			PRODUCTION: isProduction,
			TESTING: isTest,
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),

		new NotifierPlugin({title: `${pkg.name} build`}),

		new CommonsChunkPlugin({
			minChunks: Infinity,
			name: 'common',
			filename: 'commons.[hash].js',
			chunks: [
				'react',
				'bluebird',
				'redux',
				'react-redux',
				'react-dnd',
				'dnd-core',
				'react-modal2',
				'react-gateway',
				'react-side-effect',
			],
		}),
	],

	module: {
		loaders: [
			{
				test: /\.js$/,
				// allow babel to run on lodash-es
				exclude: /(node_modules)(?!\/lodash-es)/,
				loaders: ['babel-loader?cacheDirectory'],
			},
			{
				test: /\.worker.js$/,
				// allow babel to run on lodash-es
				exclude: /(node_modules)(?!\/lodash-es)/,
				loaders: ['worker-loader', 'babel-loader?cacheDirectory'],
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

	postcss: (webpack) => ([
		require('postcss-import')({
			addDependencyTo: webpack,
			resolve(id, base) {
				// this funciton changes the @import resolution to match require().
				// that is, if a path begins with ".", it is a relative path.
				// otherwise, it attempts to look up the path in webpack's list of aliases.
				// if it doesn't exist, it's still a relative path.
				let [firstLevel, ...remaining] = id.split('/')
				let isAliasedDir = Object.keys(config.resolve.alias).includes(firstLevel)

				let newpath = isAliasedDir
					? path.join(
						'/',
						...config.resolve.alias[firstLevel].split('/'),
						...remaining)
					: path.join(base, id)

				newpath = newpath.replace(__dirname, '').substr(1)

				return newpath
			},
		}),
		require('postcss-apply'),
		require('postcss-mixins'),
		require('postcss-cssnext')({
			browsers: ['last 2 versions', 'Firefox ESR'],
		}),
		require('postcss-reporter'),
	]),

	worker: {
		output: {
			filename: '[hash].worker.js',
			chunkFilename: '[id].[hash].worker.js',
		},
	},
}


// dev specific stuff
if (isDevelopment) {
	// debugging option
	config.devtool = 'eval'

	// add dev server and hotloading clientside code
	config.entry.unshift(
		'webpack-dev-server/client?http://' + config.hostname + ':' + config.port,
		'webpack/hot/only-dev-server',
		'react-hot-loader/patch'
	)

	config.devServer.port = config.port
	config.devServer.host = config.hostname

	// add dev plugins
	config.plugins.push(new HotModuleReplacementPlugin())

	// Add style loaders
	let identName = '[path][name]·[local]·[hash:base64:5]'
	config.module.loaders.push({
		test: /\.css$/,
		loader: `style-loader!css-loader?importLoaders=1&localIdentName=${identName}!postcss-loader`,
	})
}

else if (isTest) {
	config.module.loaders.push({
		test: /\.css$/,
		loader: 'style-loader!css-loader?importLoaders=1!postcss-loader',
	})
}

// production
else if (isProduction) {
	config.devtool = 'source-map'
	config.stats.children = false

	// minify in production
	let extractor = new ExtractTextPlugin(config.output.cssFilename, {allChunks: true})
	config.plugins = config.plugins.concat([
		new DedupePlugin(),
		new OccurenceOrderPlugin(true),
		new UglifyJsPlugin({
			compress: {
				warnings: false,
				pure_getters: true, // eslint-disable-line camelcase
				screw_ie8: true, // eslint-disable-line camelcase
				unsafe: true,
			},
			output: { comments: false },
		}),
		extractor,
	])

	config.module.loaders.push({
		test: /\.css$/,
		loader: extractor.extract('style-loader', 'css-loader?-import&importLoaders=1!postcss-loader'),
	})
}

else {
	throw new Error('Unknown environment! Not development, production, nor test!')
}

module.exports = config
