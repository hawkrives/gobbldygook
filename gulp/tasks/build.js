import gulp from 'gulp'

gulp.task('prepare-build', ['link', 'copy'])
gulp.task('build', ['prepare-build', 'browserify', 'sass'])
