import gulp from 'gulp'
import jscs from 'gulp-jscs'
import {lint as config} from '../config'

gulp.task('lint', () =>
	gulp.src(config)
		.pipe(jscs()))
