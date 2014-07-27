var gulp = require('gulp');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
	gulp.watch('client/app/styles/**', ['compass'])
	gulp.watch('client/app/index.html', ['copy'])
	// Note: The browserify task handles js recompiling with watchify
})
