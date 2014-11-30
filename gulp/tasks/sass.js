var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var size = require('gulp-size');
var config = require('../config').sass;

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var csswring = require('csswring');

var processors = [
    autoprefixer({browsers: config.AUTOPREFIXER_BROWSERS}),
    csswring
]

gulp.task('sass', ['fonts'], function() {
	return gulp.src(config.src)
		.pipe(sass())
		.on('error', handleErrors)
		.pipe(sourcemaps.init())
		.pipe(postcss(processors))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.dest))
		.pipe(size({title: 'sass'}))
});

