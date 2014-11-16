var gulp = require('gulp');
var symlink = require('gulp-symlink');
var config = require('../config').link;

gulp.task('link', function() {
	return gulp.src(config.src)
		.pipe(symlink(config.dest, config.opts))
});
