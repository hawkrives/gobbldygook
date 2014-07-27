var gulp = require('gulp')

gulp.task('copy', function() {
	return gulp.src('./client/app/*.html').pipe(gulp.dest('./build'))
})
