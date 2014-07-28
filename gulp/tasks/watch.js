var gulp = require('gulp');

gulp.task('watch', ['browserSync'], function() {
	gulp.watch('./client/app/styles/**/*.scss', ['compass'])
	gulp.watch('./client/app/*.html', ['copy'])
	// Note: The browserify task handles js recompiling with watchify
})
