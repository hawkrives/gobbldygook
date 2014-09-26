// generated on 2014-09-19 using generator-gulp-webapp 0.1.0
'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var cache = require('gulp-cache');
var clean = require('gulp-clean');
var connect = require('connect');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');
var gulp = require('gulp');
var gutil = require('gulp-util');
var http = require('http');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var opn = require('opn');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var subtree = require('gulp-subtree');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var vinylSourceStream = require('vinyl-source-stream');
var watchify = require('watchify');
var watchify = require('watchify');
var wiredep = require('wiredep');

connect.livereload = require('connect-livereload');
jshint.stylish = require('jshint-stylish');

/////////

gulp.task('styles', function () {
	return gulp.src('app/styles/app.less')
		.pipe(less())
		.pipe(autoprefixer('last 1 version'))
		.pipe(gulp.dest('dist'))
		.pipe(size());
});

function buildScripts(watch) {
	var useWatch = watch === undefined ? false : watch;

	var bundler = browserify({
		cache: {}, packageCache: {}, fullPaths: true,
		entries: ['./app/app.js'],
		debug: true,
	});

	if (useWatch) {
		bundler = watchify(bundler);
	}

	var bundle = function() {
		// Use vinyl-source-stream to make the stream gulp compatible.
		return bundler.bundle()
			.pipe(vinylSourceStream('app.js')) // Specifiy the desired output filename here.
			// .pipe(jshint())
			// .pipe(jshint.reporter(require('jshint-stylish')))
			.pipe(gulp.dest('dist'));
	}

	// Rebundle with watchify on changes.
	bundler.on('update', bundle);

	return bundle();
}

gulp.task('scripts', function() {
	return buildScripts(false);
})

gulp.task('watchScripts', function() {
	return buildScripts(true);
})

gulp.task('html', function () {
	return gulp.src('app/*.html')
		.pipe(gulp.dest('dist'))
		.pipe(size());
});

gulp.task('fonts', function () {
	return gulp.src('app/fonts/**/*')
		.pipe(filter('**/*.{eot,svg,ttf,woff}'))
		.pipe(flatten())
		.pipe(gulp.dest('dist/fonts'))
		.pipe(size());
});

gulp.task('extras', function () {
	return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
		.pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
	return gulp.src(['.tmp', 'dist'], { read: false })
		.pipe(clean());
});

gulp.task('build', ['html', 'fonts', 'extras']);

gulp.task('default', function () {
	console.log('gulp build');
	console.log('gulp watch');
	console.log('gulp deploy');
});

gulp.task('connect', function () {
	var app = connect()
		.use(connect.livereload({ port: 35729 }))
		.use(connect.static('public'))
		.use(connect.static('dist'))
		.use(connect.directory('dist'));

	http.createServer(app)
		.listen(9000)
		.on('listening', function () {
			console.log('Started connect web server on http://localhost:9000');
		});
});

gulp.task('serve', ['connect', 'html', 'styles', 'watchScripts'], function () {
	opn('http://localhost:9000');
});

gulp.task('deploy', ['build'], function () {
	return gulp.src('dist')
		.pipe(subtree())
		.pipe(clean());
});

gulp.task('watch', ['serve'], function () {
	var server = livereload();

	// watch for changes
	gulp.watch([
		'app/*.html',
		'app/images/**/*',
		'dist/**/*.css',
		'dist/**/*.js',
	]).on('change', function (file) {
		server.changed(file.path);
	});

	gulp.watch('app/styles/**/*.less', ['styles']);
});
