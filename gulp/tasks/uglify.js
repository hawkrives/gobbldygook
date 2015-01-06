var gulp = require('gulp')
var size = require('gulp-size')
var uglify = require('gulp-uglify')
var config = require('../config').production

gulp.task('uglify-js', ['browserify'], function() {
	return gulp.src(config.js)
		.pipe(uglify())
		.pipe(gulp.dest(config.dest))
		.pipe(size({title: 'uglified'}))
})
