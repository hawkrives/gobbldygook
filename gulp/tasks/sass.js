var autoprefixer = require('gulp-autoprefixer');
var changed = require('gulp-changed');
var filter = require('gulp-filter');
var gulp = require('gulp');
var sass = require('gulp-sass');
var handleErrors = require('../util/handleErrors');
var sourcemaps = require('gulp-sourcemaps');
var size = require('gulp-size');
var config = require('../config').sass;

gulp.task('sass', ['fonts'], function () {
	return gulp.src(config.src)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.on('error', handleErrors)
		.pipe(autoprefixer({browsers: config.AUTOPREFIXER_BROWSERS}))
		.pipe(gulp.dest(config.dest))
		.pipe(filter('**/*.css'))
		.pipe(size({title: 'sass'}))
});

