import Promise from 'bluebird'
import browserSync from 'browser-sync'
import gulp from 'gulp'
import size from 'gulp-size'
import {copy as config} from '../config'

gulp.task('copy', () => {
	let copyFile = (paths) => {
		return new Promise((resolve) => {
			let [sourcePath, destPath, title] = paths

			return gulp.src(sourcePath)
				.pipe(gulp.dest(destPath))
				.pipe(size({title: 'copy:' + title}))
				.on('end', resolve)
				.pipe(browserSync.reload({ stream: true }))
		})
	}

	return Promise.all(config.map(copyFile))
})
