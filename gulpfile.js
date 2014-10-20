'use strict';

// Include gulp and tools
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var del = require('del');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var size = require('gulp-size');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var to5 = require("6to5-browserify");
var watchify = require('watchify');

gulp.if = require('gulp-if');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
	'ie >= 11',
	'ie_mob >= 11',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 8',
	'opera >= 23',
	'ios >= 8',
	'android >= 4.4'
];

// Build JS for the browser
var watch = false; // set to true when `default` task is run
gulp.task('watchify', function(){
	var bundler = browserify('./app/app.js');
	if (watch) {
		bundler = watchify(bundler, {
			basedir: './app',
			debug: true
		});
	}

	bundler.transform(to5);

	var rebundle = function() {
		return bundler.bundle()
			.on('error', notify.onError({
				message: 'watchify error: <%= error.message %>'
			}))
			.pipe(source('app.js'))
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
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(gulp.if(!browserSync.active, jshint.reporter('fail')));
});

// Copy all files in /app
gulp.task('copy', function () {
	// return gulp.src(['app/*','!app/*.html'], {dot: true})
		// .pipe(gulp.dest('dist'))
		// .pipe(size({title: 'copy'}));
});

// Copy Web Fonts To Dist
gulp.task('fonts:woff', function () {
	return gulp.src(['app/styles/fonts/**'])
		.pipe(gulp.dest('dist/fonts'))
		.pipe(size({title: 'fonts'}));
});

// Copy Icons To Dist
gulp.task('fonts:ionicons', function () {
	return gulp.src(['app/styles/ionicons/font/*.woff'])
		.pipe(gulp.dest('dist/ionicons'))
		.pipe(size({title: 'ionicons'}));
});

gulp.task('fonts', ['fonts:woff', 'fonts:ionicons'])


// Automatically Prefix CSS
gulp.task('styles:css', function () {
	return gulp.src('app/styles/**/*.css')
		.pipe(changed('app/styles'))
		.pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
		.pipe(gulp.dest('dist'))
		.pipe(size({title: 'styles:css'}));
});

// Compile Any Other Sass Files You Added (app/styles)
gulp.task('styles:scss', function () {
	return gulp.src(['app/styles/**/*.scss'])
		// .pipe(sourcemaps.init())
		.pipe(sass())
		// .pipe(sourcemaps.write())
		.on('error', notify.onError({
			message: 'styles:scss error: <%= error.message %>'
		}))
		.pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
		.pipe(gulp.dest('dist'))
		.pipe(size({title: 'styles:scss'}));
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
// Add: `watchify` task dependency
gulp.task('serve', ['watchify', 'html', 'styles', 'fonts', 'copy'], function () {
	watch = true;

	browserSync({
		notify: true,
		minify: false,
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
