import Promise from 'bluebird'
import gulp from 'gulp'
import symlink from 'gulp-symlink'
import {link as config} from '../config'

gulp.task('link', (cb) => {
	let linkFolder = (paths) => {
		return new Promise((resolve, reject) => {
			let [sourcePath, destPath] = paths

			return gulp.src(sourcePath)
				.pipe(symlink(destPath, config.opts))
				.on('finish', resolve)
		})
	}

	return Promise.all(config.paths.map(linkFolder))
})
