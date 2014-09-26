'use strict';

var autoprefixer = require('gulp-autoprefixer');
var clean        = require('gulp-clean');
var gulp         = require('gulp');
var gutil        = require('gulp-util');
var jshint       = require('gulp-jshint');
var opn          = require('opn');
var path         = require("path");
var plumber      = require('gulp-plumber');
var sass         = require('gulp-ruby-sass');
var server       = require("webpack-dev-server");
var size         = require('gulp-size');
var subtree      = require('gulp-subtree');
var symlink      = require('gulp-symlink');
var webpack      = require('webpack');

jshint.stylish = require('jshint-stylish');

/////////

gulp.task('styles', function () {
	return gulp.src('app/styles/app.scss')
	    .pipe(plumber())
	    .pipe(sass({
			style: 'expanded',
			precision: 10
	    }))
		.pipe(autoprefixer('last 1 version'))
		.pipe(gulp.dest('dist'))
		.pipe(size());
});

gulp.task('html', function () {
	// Copy index.html to dist
	return gulp.src('app/index.html').pipe(gulp.dest('dist'));
});

gulp.task('link', function() {
	gulp.src('public/data').pipe(symlink('dist'))
	gulp.src('bower_components').pipe(symlink('dist'))
})

//////////

var webpackConfig = {
	cache: true,
	entry: {
		app: "./app/app.js"
	},
	output: {
		contentBase: path.join(__dirname, "dist/"),
		path: path.join(__dirname, "dist/"),
		publicPath: "dist/",
		filename: "[name].js",
		chunkFilename: "[chunkhash].js"
	},
	plugins: []
};


// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);
gulp.task("serve", ["webpack-dev-server"]);

// Build and watch cycle (another option for development)
//// Advantage: No server required, can run app from filesystem
//// Disadvantage: Requests are not blocked until bundle is available,
////   can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function() {
	gulp.watch(["app/**/*"], ["webpack:build-dev"]);
});

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("prepare-build", ['html', 'styles', 'link'])

gulp.task("webpack:build", ['prepare-build'], function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "source-map";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", ['prepare-build'], function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("webpack-dev-server", ['prepare-build'], function(callback) {
	gulp.watch('app/styles/**/*.scss', ['styles']);

	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = "source-map";
	myConfig.debug = true;

	// Start a webpack-dev-server
	new server(webpack(myConfig), {
		contentBase: myConfig.output.contentBase,
		path: myConfig.output.path,
		publicPath: "/" + myConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		var url = "http://localhost:8080/webpack-dev-server/index.html";
		gutil.log("[webpack-dev-server]", url);
		opn(url);
	});
});

//////////

gulp.task('deploy', ['build'], function () {
	return gulp.src('dist')
		.pipe(subtree())
		.pipe(clean());
});

gulp.task('clean', function () {
	return gulp.src(['.tmp', 'dist'], { read: false }).pipe(clean());
});

// gulp.task('default', function () {
// 	console.log('gulp build');
// 	console.log('gulp watch');
// 	console.log('gulp deploy');
// });
