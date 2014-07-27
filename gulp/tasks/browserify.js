/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

var browserify   = require('browserify')
var bundleLogger = require('../util/bundleLogger')
var gulp         = require('gulp')
var handleErrors = require('../util/handleErrors')
var jscs         = require('gulp-jscs')
var source       = require('vinyl-source-stream')
var todo         = require('gulp-todo')
var watchify     = require('watchify')

gulp.task('browserify', function() {
	var b = browserify({
		cache: {},
		packageCache: {},
		fullPaths: true,
		// Specify the entry point of your app
		entries: ['./client/app.js'],
		// Add file extentions to make optional in your requires
		extensions: ['.coffee'],
		// Enable source maps!
		debug: true,
	})

	var bundler = watchify(b)

	var bundle = function() {
		// Log when bundling starts
		var time = bundleLogger()
		time.start()

		return bundler.bundle()
			// Report compile errors
			.on('error', handleErrors)
			// Use vinyl-source-stream to make the stream gulp compatible.
			// Specifiy the desired output filename here.
			.pipe(source('app.js'))
			// Lint the code
			.pipe(jscs())
			// Save any todos to TODO.md
			.pipe(todo())
			// Specify the output destination
			.pipe(gulp.dest('./build/'))
			// Log when bundling completes!
			.on('end', time.end)
	}

	if (global.isWatching) {
		// Rebundle with watchify on changes.
		bundler.on('update', bundle)
	}

	return bundle()
})
