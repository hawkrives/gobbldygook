var csscomb      = require('gulp-csscomb')
var gulp         = require('gulp')
var handleErrors = require('../util/handleErrors')
var notify       = require('gulp-notify')
var prefix       = require('gulp-autoprefixer')
var sass         = require('gulp-sass')
var browserSync  = require('browser-sync')
var reload       = browserSync.reload

gulp.task('compass', function() {
	var sassOptions = {
		errLogToConsole: true,
		sourceMap: 'sass',
		sourceComments: 'map',
	}

	gulp.src('./client/styles/**/*.scss')
		.pipe(sass(sassOptions))
		.on('error', handleErrors)
		.pipe(csscomb())
		.pipe(prefix('last 2 versions', {map: false}))
		.pipe(gulp.dest('./build'))
		.pipe(reload({stream: true}))
})
