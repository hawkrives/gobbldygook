import browserSync from 'browser-sync'
import gulp from 'gulp'
import handleErrors from '../util/handleErrors'
import postcss from 'gulp-postcss'
import sass from 'gulp-sass'
import size from 'gulp-size'
import sourcemaps from 'gulp-sourcemaps'
import {sass as config} from '../config'

let autoprefixer = require('autoprefixer-core')
import csswring from 'csswring'

let processors = [
    autoprefixer(),
    // csswring,
]

gulp.task('sass', () =>
	gulp.src(config.src)
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
		.pipe(size({title: 'sass'}))
		.pipe(gulp.dest(config.dest)))
