var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var sass = require('gulp-sass');
var handleErrors = require('../util/handleErrors');
var size = require('gulp-size');
var config = require('../config').sass;

gulp.task('sass', ['fonts'], function () {
	return gulp.src(config.src)
		.pipe(sass())
		.on('error', handleErrors)
		.pipe(autoprefixer({browsers: config.AUTOPREFIXER_BROWSERS}))
		.pipe(gulp.dest(config.dest))
		.pipe(size({title: 'sass'}))
});

