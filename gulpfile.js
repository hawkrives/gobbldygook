/* global require:false, console:false */
'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var sourcemaps = require('gulp-sourcemaps');

var to5 = require("6to5-browserify");

var AUTOPREFIXER_BROWSERS = [
	'ie >= 10',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

// Build JS for the browser
var watch = false; // set to true when `default` task is run
gulp.task('watchify', function(){
	var bundler = browserify('./app/app.js');
	if (watch) {
		bundler = watchify(bundler, {
			basedir: './app', // (roots __dirname)
			debug: true
		});
	}

	bundler.transform(to5);

	var rebundle = function() {
		return bundler.bundle()
			.on('error', $.notify.onError({
				message: 'watchify error: <%= error.message %>'
			}))
			.pipe(source('app.js'))
			// destination changes when `dist` is set to true
			.pipe(gulp.dest('dist'))
			.pipe(reload({stream: true, once: true}));
	};

	// rebundle on change
	bundler.on('update', rebundle);

	return rebundle();
});

gulp.task('scripts', function() {
	watch = true;
	runSequence('watchify');
})

gulp.task('scripts-nowatch', function() {
	watch = false;
	runSequence('watchify');
})

// Lint JavaScript
gulp.task('jshint', function () {
	return gulp.src('app/scripts/**/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Copy all files in /app
gulp.task('copy', function () {
	// return gulp.src(['app/*','!app/*.html'], {dot: true})
		// .pipe(gulp.dest('dist'))
		// .pipe($.size({title: 'copy'}));
});

// Copy Web Fonts To Dist
gulp.task('fonts:woff', function () {
	return gulp.src(['app/styles/fonts/**'])
		.pipe(gulp.dest('dist/fonts'))
		.pipe($.size({title: 'fonts'}));
});

// Copy Icons To Dist
gulp.task('fonts:ionicons', function () {
	return gulp.src(['app/styles/ionicons/font/*.woff'])
		.pipe(gulp.dest('dist/ionicons'))
		.pipe($.size({title: 'ionicons'}));
});

gulp.task('fonts', ['fonts:woff', 'fonts:ionicons'])


// Automatically Prefix CSS
gulp.task('styles:css', function () {
	return gulp.src('app/styles/**/*.css')
		.pipe($.changed('app/styles'))
		.pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(gulp.dest('dist'))
		.pipe($.size({title: 'styles:css'}));
});

// Compile Any Other Sass Files You Added (app/styles)
gulp.task('styles:scss', function () {
	return gulp.src(['app/styles/**/*.scss'])
		// .pipe(sourcemaps.init())
		.pipe($.sass())
		// .pipe(sourcemaps.write())
		.on('error', $.notify.onError({
			message: 'styles:scss error: <%= error.message %>'
		}))
		.pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(gulp.dest('dist'))
		.pipe($.size({title: 'styles:scss'}));
});

// Output Final CSS Styles
gulp.task('styles', ['styles:scss', 'styles:css']);

// Copy the html file
gulp.task('html', function () {
	return gulp.src('app/index.html')
		.pipe(gulp.dest('dist'))
		.pipe($.size({title: 'html'}));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['dist']));

// Watch Files For Changes & Reload
// Add: `watchify` task dependency
gulp.task('serve', ['watchify', 'html', 'styles', 'fonts', 'copy'], function () {
	watch = true;

	browserSync({
		notify: false,
		server: {
			baseDir: ['dist', './']
		}
	});

	gulp.watch(['app/**/*.html'], reload);
	gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
	gulp.watch(['{dist,app/styles}/**/*.css'], ['styles:css', reload]);
	gulp.watch(['app/scripts/**/*.js'], ['jshint']);
});

gulp.task('default', ['clean'], function(cb) {
	watch = false; // changes Watchify's build destination
	runSequence('styles', ['jshint', 'watchify', 'html', 'fonts', 'copy'], cb);
});
