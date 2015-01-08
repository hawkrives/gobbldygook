import gulp from 'gulp'
import size from 'gulp-size'
import uglify from 'gulp-uglify'
import {production as config} from '../config'

gulp.task('uglify-js', ['browserify'], () =>
	gulp.src(config.js)
		.pipe(uglify())
		.pipe(gulp.dest(config.dest))
		.pipe(size({title: 'uglified'})))
