var gulp = require('gulp');
var size = require('gulp-size');
var config = require('../config').fonts;

gulp.task('fonts', function () {
	return gulp.src(config.src)
		.pipe(gulp.dest(config.dest))
		.pipe(size({title: 'fonts'}));
});
