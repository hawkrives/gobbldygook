import browserSync from 'browser-sync'
import gulp from 'gulp'
import {browserSync as config} from '../config'

gulp.task('browser-sync', () => {
	browserSync(config)
})
