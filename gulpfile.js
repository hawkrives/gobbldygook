var gulp = require('gulp')
var gutil = require('gulp-util')
var source = require('vinyl-source-stream')
var watchify = require('watchify')
var prefix = require('gulp-autoprefixer')
var livereload = require('gulp-livereload')
var csscomb = require('gulp-csscomb')
var jscs = require('gulp-jscs')
var sass = require('gulp-sass')
var notify = require('gulp-notify')

var prettyHrtime = require('pretty-hrtime')

var appSrc = './client'
var appDest = './static'

/*
	gulpfile.js
	===========
	Rather than manage one giant configuration file responsible
	for creating multiple tasks, each task has been broken out into
	its own file in gulp/tasks. Any file in that folder gets automatically
	required by the loop in ./gulp/index.js (required below).

	To add a new task, simply add a new task file to gulp/tasks.
*/

require('./gulp');

// gulp.task('browserify', function() {
// 	var bundler = watchify({
// 		entries: [appSrc + '/app.js']
// 	})

// 	bundler.on('update', bundle)

// 	var bundle = function() {
// 		// Log when bundling starts
// 		var time = bundleLogger()
// 		time.start()

// 		return bundler
// 			// Enable source maps
// 			.bundle({debug: true})
// 			// log errors if they happen
// 			.on('error', handleErrors)
// 			// Use vinyl-source-stream to make the
// 			// stream gulp compatible. Specifiy the
// 			// desired output filename here.
// 			.pipe(source('bundle.js'))
// 			// Specify the output destination
// 			.pipe(gulp.dest(appDest))
// 			// Log when bundling completes!
// 			.on('end', time.end)
// 			// .pipe(jscs())
// 			// .pipe(todo('TODO.md'))
// 			// .pipe(livereload())
// 			// .pipe(notify('built js'))
// 	}

// 	return bundle()
// })

// gulp.task('style', function() {
// 	var sassOptions = {
// 		errLogToConsole: true,
// 		sourceMap: 'sass',
// 		sourceComments: 'map',
// 	}
// 	gulp.src(appSrc + '/styles/*.scss')
// 		.pipe(sass(sassOptions))
// 		.pipe(prefix(['last 2 versions']))
// 		// .pipe(csscomb())
// 		// .pipe(livereload())
// 		// .pipe(notify('built css'))
// 		.pipe(gulp.dest(appDest))
// })

// gulp.task('clean', function () {
// 	return gulp.src(appDest, {read: false}).pipe(clean())
// })

// gulp.task('watch', function() {
// 	// gulp.watch([appSrc + '/**/*.js'], ['browserify'])
// 	var styleWatcher = gulp.watch([appSrc + '/**/*.scss'], ['style']);
// 	styleWatcher.on('change', function(event) {
// 		gutil.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
// 	})
// })

// gulp.task('default', ['watch', 'style', 'browserify'])
