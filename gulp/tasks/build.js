var gulp = require('gulp');

gulp.task('build', ['link', 'browserify', 'sass', 'markup']);
