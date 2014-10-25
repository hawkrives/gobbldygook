var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var port = 8080;

var config = {
	devtool: 'source-map',
	entry: [
		"webpack-dev-server/client?http://localhost:"+port,
		// "webpack/hot/dev-server",
		"./app/app.es6",
	],
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
	],
	output: {
		path: __dirname,
		filename: 'app.js',
		publicPath: '/app'
	},
	resolve: {
	    // Allow to omit extensions when requiring these files
	    extensions: ['', '.js', '.es6'],
	},
	module: {
		loaders: [
			{test: /\.es6$/,  loaders: ["6to5-loader", "react-hot"]},
			{test: /\.json$/, loader: "json-loader"},
			{test: /\.scss$/, loader: "style!css!sass?outputStyle=expanded"},
		]
	},
}

var server = new WebpackDevServer(webpack(config), {
	// Enable special support for Hot Module Replacement

	// The page is no longer updated, but a "webpackHotUpdate" message is sent
	// to the content. Use "webpack/hot/dev-server" as additional module in
	// your entry point

	// hot: true,

	// webpack-dev-middleware options
	publicPath: config.publicPath,
	stats: { colors: true }
});

server.listen(port, "localhost", function(err, result) {
	if (err) {
		console.log(err);
	}

	console.log('Listening at localhost:'+port)
});
