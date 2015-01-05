var browserSync  = require('browser-sync');
var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../config').sass;

var autoprefixer = require('autoprefixer-core');
var csswring = require('csswring');

var processors = [
    autoprefixer(),
    csswring,
]

gulp.task('sass', function() {
	return gulp.src(config.src)
		// prepare to handle sourcemaps
		.pipe(sourcemaps.init())

		// run the stylesheets through node-sass
		.pipe(sass(config.settings))
		.on('error', handleErrors)

		// run the css through the postcss processors
		.pipe(postcss(processors))

		// and map the sourcemaps to the same directory they came in with
		.pipe(sourcemaps.write('.'))

		// write out the compiled styles
		.pipe(gulp.dest(config.dest))
		.pipe(size({title: 'sass'}))
		.pipe(browserSync.reload({ stream: true }));
});
