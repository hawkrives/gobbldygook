var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function() {
	return runSequence('clean', 'link', ['browserify', 'sass', 'fonts', 'markup'])
});
