var gulp = require('gulp');
var jscs = require('gulp-jscs');
var config = require('../config').lint;

gulp.task('lint', function() {
	// When we update to JSCS 1.8, add these rules back in:
	// "requireSpaceBeforeKeywords": true,
	// "requireTrailingComma": {"ignoreSingleValue": true,"ignoreSingleLine": true},
	return gulp.src(config.src)
		.pipe(jscs({configPath: './package.json'}));
});
