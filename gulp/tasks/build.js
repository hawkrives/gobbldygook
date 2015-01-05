var gulp = require('gulp');

gulp.task('build', ['link', 'copy', 'browserify', 'sass']);
