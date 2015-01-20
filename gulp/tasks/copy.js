import Promise from 'bluebird'
import browserSync from 'browser-sync'
import gulp from 'gulp'
import size from 'gulp-size'
import {copy as config} from '../config'

let copyFile = (info) => new Promise((resolve) => {
	let [sourcePath, destPath, title] = info

	gulp.src(sourcePath)
		.pipe(size({title: 'copy:' + title}))
		.pipe(gulp.dest(destPath))
		.on('end', resolve)
})

let copyAll = () => Promise.all(config.map(copyFile))

gulp.task('copy', copyAll)
