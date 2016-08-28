/* global module, __dirname */
'use strict'

const pkg = require('./package.json')
const webpack = require('webpack')
const path = require('path')
const url = require('url')

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
const DedupePlugin = webpack.optimize.DedupePlugin
const DefinePlugin = webpack.DefinePlugin
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin
const NormalModuleReplacementPlugin = webpack.NormalModuleReplacementPlugin
const OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlPlugin = require('./scripts/webpack/html-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const isProduction = (process.env.NODE_ENV === 'production')
const isDevelopment = (process.env.NODE_ENV === 'development')
const isTest = (process.env.NODE_ENV === 'test')

const outputFolder = 'build/'
const urlLoaderLimit = 10000
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

const config = {
	replace: null,
	port: 3000, // for webpack-dev-server

	stats: {},

	entry: {
		main: ['./src/index.js'],
		common: ['bluebird', 'dnd-core', 'isomorphic-fetch', 'redux', 'ohcrash', 'js-yaml'],
		react: ['react', 'react-dnd', 'react-redux', 'react-router', 'react-side-effect', 'react-modal'],
	},

	output: {
		path: outputFolder,
		publicPath: publicPath,
		hash: true,

		// extract-text-plugin uses [contenthash], and webpack uses [hash].
		filename: isDevelopment ? 'app.js' : `${pkg.name}.[hash].js`,
		cssFilename: isDevelopment ? 'app.css' : `${pkg.name}.[contenthash].css`,
		chunkFilename: 'chunk.[name].[chunkhash].js',

		// Add /*filename*/ comments to generated require()s in the output.
		pathinfo: true,
	},

	devServer: {
		// If these are enabled, then historyApiFallback doesn't work.
		// info: false,
		// stats: 'errors-only',
		contentBase: outputFolder,

		// Makes webpack serve /index.html as the response to any request to
		// webpack-dev-server, so GET / and GET /s/1234 both get the index
		// page.
		historyApiFallback: {
			index: publicPath,
		},

		// We also do the manual entry above and the manual adding of the hot
		// module replacment plugin below.
		hot: true,
	},

	node: {
		process: false,
		Buffer: false,
	},

	resolve: {
		extensions: ['.js', '.json', ''],
		// Allow us to require things from src/ instead of using giant
		// relative paths everywhere. And, thanks to babel-plugin-webpack-alias,
		// we can use these aliases in testing, too!
		alias: {
			src: path.resolve(__dirname, 'src'),
		},
	},

	plugins: [
		// Generates an index.html for us.
		new HtmlPlugin({
			html(context) {
				return {
					'index.html': `
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

						<script src="https://apis.google.com/js/platform.js" async defer></script>

						${context.css && `<link rel="stylesheet" href="${publicPath}${context.css}">`}
						<body><main id="gobbldygook"></main></body>
						<script src="${publicPath}${context.common}"></script>
						<script src="${publicPath}${context.react}"></script>
						<script src="${publicPath}${context.main}"></script>
						</html>
					`,
				}
			},
			isDev: isDevelopment,
		}),

		// Ignore the "full" schema in js-yaml's module, because it brings in esprima
		// to support the !!js/function type. We don't use and have no need for it, so
		// tell webpack to ignore it.
		new NormalModuleReplacementPlugin(/schema\/default_full$/, result => {
			result.request = result.request.replace('default_full', 'default_safe')
		}),

		// DefinePlugin makes some variables available to the code.
		new DefinePlugin({
			VERSION: JSON.stringify(pkg.version),
			DEVELOPMENT: isDevelopment,
			PRODUCTION: isProduction,
			TESTING: isTest,
			// APP_BASE is used in react-router, to set its base appropriately
			// across both local dev and gh-pages.
			APP_BASE: JSON.stringify(publicPath),
			GOOGLE_APP_ID: JSON.stringify('418758265800-m6c5f81nneo3q0ncige9d5bft66nhk1a.apps.googleusercontent.com'),
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),

		// Extract the common libraries into a single file so that the chunks
		// don't need to individually bundle them.
		new CommonsChunkPlugin({
			names: ['react', 'common'],
			filename: '[name].[hash].js',
			minChunks: Infinity,
		}),

		// Watcher doesn't work well if you mistype casing in a path so we use
		// a plugin that prints an error when you attempt to do this.
		new CaseSensitivePathsPlugin(),
	],

	module: {
		loaders: [
			{
				test: /\.js$/,
				// allow babel to run on lodash-es
				exclude: /node_modules/,
				loaders: ['babel-loader?cacheDirectory'],
			},
			{
				test: /\.worker.js$/,
				// allow babel to run on lodash-es
				exclude: /node_modules/,
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
	config.entry.main.unshift(
		// 'react-hot-loader/patch',
		'webpack-dev-server/client?/',
		'webpack/hot/only-dev-server'
	)

	config.devServer.port = config.port
	config.devServer.host = config.hostname

	// add dev plugins
	config.plugins.push(new HotModuleReplacementPlugin())

	// Add style loaders
	let extractor = new ExtractTextPlugin(config.output.cssFilename, {allChunks: true})
	config.plugins = config.plugins.concat([extractor])
	config.module.loaders.push({test: /\.css$/, loader: extractor.extract('style', ['css'])})
	config.module.loaders.push({test: /\.scss$/, loader: extractor.extract('style', ['css!sass'])})

	let identName = '[path][name]·[local]·[hash:base64:5]'
	config.module.loaders.push({test: /\.module.css$/, loader: extractor.extract('style', [`css?modules&localIdentName=${identName}`])})
	config.module.loaders.push({test: /\.module.scss$/, loader: extractor.extract('style', [`css?modules&localIdentName=${identName}!sass`])})
}

else if (isTest) {
	config.module.loaders.push({test: /\.css$/, loader: 'style!css'})
	config.module.loaders.push({test: /\.module.css$/, loader: 'style!css?modules'})
	config.module.loaders.push({test: /\.scss$/, loader: 'style!css!sass'})
	config.module.loaders.push({test: /\.module.scss$/, loader: 'style!css?modules!sass'})
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
			mangle: {
				screw_ie8: true, // eslint-disable-line camelcase
			},
			output: {
				comments: false,
				screw_ie8: true, // eslint-disable-line camelcase
			},
		}),
		extractor,
	])

	config.module.loaders.push({
		test: /\.css$/,
		loader: extractor.extract('style', ['css']),
	})
	config.module.loaders.push({
		test: /\.scss$/,
		loader: extractor.extract('style', ['css', 'sass']),
	})

	config.module.loaders.push({
		test: /\.module.css$/,
		loader: extractor.extract('style', ['css?modules']),
	})
	config.module.loaders.push({
		test: /\.module.scss$/,
		loader: extractor.extract('style', ['css?modules', 'sass']),
	})
}

else {
	throw new Error('Unknown environment! Not development, production, nor test!')
}

module.exports = config
