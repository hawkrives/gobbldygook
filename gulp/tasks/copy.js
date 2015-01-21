import {map, bind} from 'lodash'
import gulp from 'gulp'
import cache from 'gulp-cached'
import size from 'gulp-size'
import {copy as config} from '../config'

let copyFile = (info) => {
	let [sourcePath, destPath, title] = info

	return gulp.src(sourcePath)
		.pipe(size({title: `copy:${title}`}))
		.pipe(gulp.dest(destPath))
}

let copyTasks = map(config, pathInfo => {
	let [sourcePath, destPath, title] = pathInfo
	let taskName = `copy:${title}`
	gulp.task(taskName, bind(copyFile, this, pathInfo))

	return taskName
})

gulp.task('copy', copyTasks)
