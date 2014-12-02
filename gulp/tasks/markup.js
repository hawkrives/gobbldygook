var _ = require('lodash');
var gulp = require('gulp');
var config = require('../config').markup

gulp.task('markup', function() {
	var copyFile = function(paths) {
		var sourcePath = paths[0];
		var destPath = paths[1];

		return gulp.src(sourcePath)
			.pipe(gulp.dest(destPath))
	}

	_.zip(config.src, config.dest).forEach(copyFile);
});
