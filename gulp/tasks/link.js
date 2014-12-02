var _ = require('lodash');
var gulp = require('gulp');
var symlink = require('gulp-symlink');
var config = require('../config').link;

gulp.task('link', function() {
	var linkFolder = function(paths) {
		var sourcePath = paths[0];
		var destPath = paths[1];

		return gulp.src(sourcePath)
			.pipe(symlink(destPath, config.opts))
	}

	_.zip(config.src, config.dest).forEach(linkFolder);
});
