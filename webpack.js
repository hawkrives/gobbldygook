var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var config = {
	devtool: 'source-map',
	entry: [
		"webpack-dev-server/client?http://localhost:8080",
		"webpack/hot/dev-server",
		"./app/app.es6",
	],
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
	],
	output: {
		path: __dirname,
		filename: 'app.js',
		publicPath: '/'
	},
	resolve: {
	    // Allow to omit extensions when requiring these files
	    extensions: ['', '.js', '.es6'],
	},
	module: {
		loaders: [
			{test: /\.es6$/,  loaders: ["6to5-loader", "react-hot"]},
			{test: /\.json$/, loader: "json-loader"},
		]
	},
}

var server = new WebpackDevServer(webpack(config), {

	// Enable special support for Hot Module Replacement
	// Page is no longer updated, but a "webpackHotUpdate" message is send to the content
	// Use "webpack/hot/dev-server" as additional module in your entry point
	hot: true,

	// webpack-dev-middleware options
	// quiet: false,
	// noInfo: false,
	// lazy: true,
	// watchDelay: 300,
	publicPath: config.publicPath,
	stats: { colors: true }
});
server.listen(8080, "localhost", function(err, result) {
	if (err) {
		console.log(err);
	}

	console.log('Listening at localhost:8080')
});
