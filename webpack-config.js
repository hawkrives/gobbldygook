var webpack = require('webpack');

var port = 8080;

module.exports = {
	devtool: 'source-map',
	debug: true,
	port: port,
	entry: [
		"webpack-dev-server/client?http://localhost:"+port,
		// "webpack/hot/dev-server",
		"./app/app.es6",
	],
	plugins: [
		// new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		// new webpack.optimize.DedupePlugin(),
		// new webpack.optimize.UglifyJsPlugin(),
		// new webpack.optimize.OccurenceOrderPlugin(),
	],
	output: {
		path: './dist',
		filename: 'app.js',
		publicPath: '/app'
	},
	resolve: {
	    // Allow to omit extensions when requiring these files
	    extensions: ['', '.js', '.es6'],
	},
	module: {
		loaders: [
			{test: /\.es6$/,  loader: "6to5-loader"},
			{test: /\.json$/, loader: "json-loader"},
		]
	},
}
