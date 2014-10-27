'use strict';

// Include gulp and tools
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var size = require('gulp-size');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('webpack');

var config = require('./webpack-config');
var reload = browserSync.reload;
var compiler = webpack(config);

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


// Build JS for the browser
gulp.task('webpack', function(callback){
	compiler.run(function(err, stats) {
		if (err) {
			 notify.onError({
				message: 'webpack error: <%= err.message %>'
			})
		}
		callback();
	})
});

gulp.task('scripts', ['webpack']);

// Lint JavaScript
gulp.task('jshint', function () {
	return gulp.src('app/scripts/**/*.{js,es6}')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});


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
		.pipe(size({title: 'styles:css'}))
});

// Compile Any Other Sass Files You Added (app/styles)
gulp.task('styles:scss', function () {
	return gulp.src('app/styles/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write())
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

// Watch Files For Changes & Reload
gulp.task('serve', ['webpack', 'html', 'styles', 'fonts'], function () {
	browserSync({
		notify: true,
		minify: false,
		server: {
			baseDir: ['dist', './']
		}
	});

	gulp.watch(['app/scripts/**/*.{js,es6}'], ['webpack', reload]);
	gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
	gulp.watch(['dist/**/*.css'], ['styles:css', reload]);
	gulp.watch(['app/scripts/**/*.js'], ['jshint']);
});

gulp.task('default', ['clean'], function(cb) {
	runSequence('styles', ['jshint', 'webpack', 'html', 'fonts'], cb);
});
