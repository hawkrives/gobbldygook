var browserSync  = require('browser-sync');
var gulp = require('gulp');
var size = require('gulp-size');
var config = require('../config').copy;

gulp.task('copy', function() {
	var copyFile = function(paths) {
		var sourcePath = paths[0];
		var destPath = paths[1];
		var title = paths[2] || '';

		return gulp.src(sourcePath)
			.pipe(gulp.dest(destPath))
			.pipe(size({title: 'copy:' + title}))
			.pipe(browserSync.reload({ stream: true }));
	}

	config.forEach(copyFile);
});
