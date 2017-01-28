/* global module, __dirname */
'use strict'

const pkg = require('./package.json')
const webpack = require('webpack')
const url = require('url')
const reject = require('lodash/reject')
const endsWith = require('lodash/endsWith')

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
const DefinePlugin = webpack.DefinePlugin
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin
const LoaderOptionsPlugin = webpack.LoaderOptionsPlugin
const NormalModuleReplacementPlugin = webpack.NormalModuleReplacementPlugin
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlPlugin = require('./scripts/webpack/html-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')

const isProduction = (process.env.NODE_ENV === 'production')
const isDevelopment = (process.env.NODE_ENV === 'development')
const isTest = (process.env.NODE_ENV === 'test')

let style = 'style-loader'
let css = 'css-loader'
let sass = 'sass-loader'
let cssModules = { loader: css, query: { modules: true, localIdentName: '[path][name]·[local]·[hash:base64:5]' } }

const outputFolder = __dirname + '/build/'
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

const entries = {
	bfr: 'buffer',
	hanson: './modules/hanson-format',
	common: [
		'debug',
		'delay',
		'listify',
		'ord',
		'p-props',
		'p-queue',
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
	react: [
		'classnames',
		'dnd-core',
		'history',
		'react',
		'react-dnd',
		'react-dnd-html5-backend',
		'react-dom',
		'react-modal',
		'react-redux',
		'react-router',
		'react-side-effect',
	],
	yaml: [ 'js-yaml' ],
	idb: [ 'treo', 'idb-range', 'idb-request' ],
	cm: [ 'codemirror' ],
	html: [ 'htmlparser2', 'css-select' ],
}

let cssFilename = isDevelopment ? 'app.css' : `${pkg.name}.[contenthash].css`

const config = {
	devtool: isProduction
		? 'source-map'
		: 'eval',

	stats: {},

	entry: Object.assign(
		{},
		{ main: [ './modules/web/index.js' ] },
		entries
	),

	output: {
		path: outputFolder,
		publicPath: publicPath,

		// extract-text-plugin uses [contenthash], and webpack uses [hash].
		filename: isDevelopment ? 'app.js' : `${pkg.name}.[hash].js`,
		chunkFilename: 'chunk.[name].[chunkhash].js',

		// Add /*filename*/ comments to generated require()s in the output.
		pathinfo: true,
	},

	devServer: {
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
	},

	node: {
		process: false,
		Buffer: false,
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

						<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/nhhpgddphdimipafjfiggjnbbmcoklld">

						${isProduction ?
							'<script src="//d2wy8f7a9ursnm.cloudfront.net/bugsnag-3.min.js" data-apikey="7e393deddaeb885f5b140b4320ecef6b"></script>'
							: ''}

						${context.css ?
							`<link rel="stylesheet" href="${publicPath}${context.css}">`
							: ''}

						<body><main id="gobbldygook"></main></body>

						<script src="${publicPath}${context.manifest}"></script>
						${Object.keys(entries)
							.map(k => `<script src="${publicPath}${context[k]}"></script>`)
							.join('\n')}
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
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),

		// Extract the common libraries into a single file so that the chunks
		// don't need to individually bundle them.
		new CommonsChunkPlugin({
			names: [
				'react',
				'common',
				'yaml',
				'cm',
				'html',
				'idb',
				'hanson',
				'bfr',
				'manifest',
			],
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

		new DuplicatePackageCheckerPlugin(),
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules\/(?!preact-compat|p-.*\/).*/,
				use: [ { loader: 'babel-loader', options: { cacheDirectory: true } } ],
			},
			{
				test: /\.worker.js$/,
				exclude: /node_modules/,
				use: [ 'worker-loader', { loader: 'babel-loader', options: { cacheDirectory: true } } ],
			},
			{
				test: /\.json$/,
				use: [ 'json-loader' ],
			},
			{
				test: /\.(otf|eot|ttf|woff2?)$/,
				use: [ { loader: 'url-loader', options: { limit: urlLoaderLimit } } ],
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				use: [ { loader: 'url-loader', options: { limit: urlLoaderLimit } } ],
			},

			{ test: /\.css$/, use: [ style, css ] },
			{ test: /\.scss$/, use: [ style, css, sass ] },
			{ test: /\.module.css$/, use: [ style, cssModules ] },
			{ test: /\.module.scss$/, use: [ style, cssModules, sass ] },
		],
	},
}


if (isDevelopment) {
	// add dev server and hotloading clientside code
	config.entry.main.unshift(
		// 'react-hot-loader/patch',
		'webpack-dev-server/client?/',
		'webpack/hot/only-dev-server'
	)

	// add dev plugins
	config.plugins.push(new HotModuleReplacementPlugin())
}

else if (isProduction) {
	config.stats.children = false

	// minify in production
	config.plugins = config.plugins.concat([
		new UglifyJsPlugin({
			sourceMap: true,
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
		new ExtractTextPlugin({
			filename: cssFilename,
			allChunks: true,
		}),
		new LoaderOptionsPlugin({
			minimize: true,
		}),
	])

	// remove css plugins
	const endsInCss = rule => endsWith(rule.test.toString(), 'css$/')
	config.module.rules = reject(config.module.rules, endsInCss)
	config.module.rules = config.module.rules.concat([
		{ test: /\.css$/, loader: ExtractTextPlugin.extract({ fallbackLoader: style, loader: [ css ] }) },
		{ test: /\.scss$/, loader: ExtractTextPlugin.extract({ fallbackLoader: style, loader: [ css, sass ] }) },
		{ test: /\.module.css$/, loader: ExtractTextPlugin.extract({ fallbackLoader: style, loader: [ cssModules ] }) },
		{ test: /\.module.scss$/, loader: ExtractTextPlugin.extract({ fallbackLoader: style, loader: [ cssModules, sass ] }) },
	])
}

module.exports = config
