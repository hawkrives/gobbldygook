'use strict';

// Include gulp and tools
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var del = require('del');
var filter = require('gulp-filter');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var symlink = require('gulp-symlink');
var size = require('gulp-size');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');

var reload = browserSync.reload;

var packageJSON  = require('./package.json');
var jshintConfig = packageJSON.jshintConfig;
jshintConfig.lookup = false;

var AUTOPREFIXER_BROWSERS = [
	'ie >= 11',
	'ie_mob >= 11',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 8',
	'opera >= 23',
	'ios >= 8',
	'android >= 4.4',
];

var isWatching = false;

var handleErrors = function() {

  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};

var gutil        = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var startTime;

var bundleLogger = {
  start: function(filepath) {
    startTime = process.hrtime();
    gutil.log('Bundling', gutil.colors.green(filepath) + '...');
  },

  end: function(filepath) {
    var taskTime = process.hrtime(startTime);
    var prettyTime = prettyHrtime(taskTime);
    gutil.log('Bundled', gutil.colors.green(filepath), 'in', gutil.colors.magenta(prettyTime));
  }
};


////
// JavaScript
///


// Build JS for the browser
gulp.task('browserify', function(callback) {
	var bundler = browserify({
		// Required watchify args
		cache: {}, packageCache: {}, fullPaths: true,
		// Specify the entry point of your app
		entries: './app/app.es6',
		// Enable source maps!
		debug: true,
	});

	bundler.transform('6to5-browserify');

	var bundle = function() {
		// Log when bundling starts
		bundleLogger.start('app.js');

		return bundler
			.bundle()
			// Report compile errors
			.on('error', handleErrors)
			// Use vinyl-source-stream to make the
			// stream gulp compatible. Specifiy the
			// desired output filename here.
			.pipe(source('app.js'))
			// Specify the output destination
			.pipe(gulp.dest('./dist'))
			.on('end', reportFinished);
	};

	if (isWatching) {
		// Wrap with watchify and rebundle on changes
		bundler = watchify(bundler);
		// Rebundle on update
		bundler.on('update', bundle);
	}

	var reportFinished = function() {
		// Log when bundling completes
		bundleLogger.end('app.js')
	}

	return bundle();
});

// Lint JavaScript
gulp.task('lint', function() {
	// When we update to JSCS 1.8, add these rules back in:
	// "requireSpaceBeforeKeywords": true,
	// "requireTrailingComma": {"ignoreSingleValue": true,"ignoreSingleLine": true},
	return gulp.src('app/**/*.{js,es6}')
		// .pipe(jshint(jshintConfig))
		// .pipe(jshint.reporter('jshint-stylish'))
		.pipe(jscs({configPath: './package.json'}));
});

gulp.task('scripts', ['browserify', 'lint']);

// Copy Web Fonts To Dist
gulp.task('fonts:woff', function () {
	return gulp.src('app/styles/fonts/**')
		.pipe(gulp.dest('dist/fonts'))
		.pipe(size({title: 'fonts'}));
});

// Copy Icons To Dist
gulp.task('fonts:ionicons', function () {
	return gulp.src('app/styles/ionicons/font/*.woff')
		.pipe(gulp.dest('dist/ionicons'))
		.pipe(size({title: 'ionicons'}))
});

gulp.task('fonts', ['fonts:woff', 'fonts:ionicons'])


// Automatically Prefix CSS
gulp.task('styles:css', function () {
	return gulp.src('app/styles/**/*.css')
		.pipe(changed('app/styles'))
		.pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream: true}))
		.pipe(size({title: 'styles:css'}))
});

// Compile Any Other Sass Files You Added (app/styles)
gulp.task('styles:scss', function () {
	return gulp.src('app/styles/**/*.scss')
		.pipe(sass({
			sourcemap: true,
			sourcemapPath: '../sass'
		}))
		.on('error', notify.onError({
			message: 'styles:scss error: <%= error.message %>'
		}))
		.pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
		.pipe(gulp.dest('dist'))
		.pipe(size({title: 'styles:scss'}))
});

// Output Final CSS Styles
gulp.task('styles', ['styles:scss', 'styles:css']);

// Copy the html file
gulp.task('html', function () {
	return gulp.src('app/index.html')
		.pipe(gulp.dest('dist'))
		.pipe(size({title: 'html'}));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['dist']));

gulp.task('link', function() {
	return gulp.src('data')
		.pipe(symlink('dist/data', {force: true}))
});

gulp.task('setWatch', function() {
	isWatching = true;
	return isWatching;
});

// Watch Files For Changes & Reload
gulp.task('serve', ['setWatch', 'browserify', 'html', 'styles', 'fonts', 'link'], function () {
	browserSync.init({
		notify: true,
		minify: false,
		browser: "google chrome",
		server: {
			baseDir: ['dist']
		},
		files: [
			"dist/**",
			// Exclude Map files
			"!/dist/**.map",
		]
	});

	gulp.watch(['{app,mockups}/**/*.{js,es6}'], ['browserify', 'lint', reload]);
	gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
});

gulp.task('default', ['clean'], function(cb) {
	runSequence('styles', ['lint', 'browserify', 'html', 'fonts', 'link'], cb);
});
