var compass      = require('gulp-compass')
var csscomb      = require('gulp-csscomb')
var gulp         = require('gulp')
var handleErrors = require('../util/handleErrors')
var notify       = require('gulp-notify')
var prefix       = require('gulp-autoprefixer')
var sass         = require('gulp-sass')

// gulp.task('compass', function() {
// 	return gulp.src('./client/styles/app.scss')
// 		.pipe(compass({
// 			sourcemap: true,
// 			css: 'build',
// 			sass: 'client/styles'
// 		}))
// 		.on('error', handleErrors)
// })

gulp.task('compass', function() {
	var sassOptions = {
		errLogToConsole: true,
		sourceMap: 'sass',
		sourceComments: 'map',
	}
	gulp.src('./client/styles/app.scss')
		.pipe(sass(sassOptions))
		.on('error', handleErrors)
		.pipe(prefix('last 2 versions', {map: false}))
		.pipe(csscomb())
		.pipe(gulp.dest('./build'))
})
