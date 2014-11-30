var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', ['clean'], function() {
	return runSequence('link', ['markup', 'sass', 'browserify'])
});
