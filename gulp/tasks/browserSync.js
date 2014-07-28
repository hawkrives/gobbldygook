var browserSync = require('browser-sync')
var gulp        = require('gulp')

gulp.task('browserSync', ['build'], function() {
	browserSync.init(['./build/**'], {
		server: {
			baseDir: './build',
			directory: true,
			routes: {
				'/data': './public/data',
				'/libraries': './public/libraries'
			}
		}
	})
})
