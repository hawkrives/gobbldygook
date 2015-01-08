import gulp from 'gulp'
import cache from 'gulp-cached'
import jscs from 'gulp-jscs'
// import jshint from 'gulp-jshint'
import {lint as config} from '../config'

gulp.task('lint', () =>
	gulp.src(config)
		.pipe(cache('linting'))
		.pipe(jscs()))
		// .pipe(jshint())
		// .pipe(jshint.reporter('jshint-stylish')))
