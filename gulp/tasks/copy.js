var gulp = require('gulp');
var config = require('../config').copy

gulp.task('copy', function() {
	var copyFile = function(paths) {
		var sourcePath = paths[0];
		var destPath = paths[1];

		return gulp.src(sourcePath)
			.pipe(gulp.dest(destPath))
	}

	config.forEach(copyFile);
});
