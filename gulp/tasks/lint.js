var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var config = require('../config').lint;

gulp.task('lint', function() {
	// When we update to JSCS 1.8, add these rules back in:
	// "requireSpaceBeforeKeywords": true,
	// "requireTrailingComma": {"ignoreSingleValue": true,"ignoreSingleLine": true},
	return gulp.src(config.src)
		// .pipe(jshint(jshintConfig))
		// .pipe(jshint.reporter('jshint-stylish'))
		.pipe(jscs({configPath: './package.json'}));
});
