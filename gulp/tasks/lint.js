var gulp = require('gulp');
var jscs = require('gulp-jscs');
var config = require('../config').lint;

gulp.task('lint', function() {
	return gulp.src(config)
		.pipe(jscs());
});
