import gulp from 'gulp'
import browserifyTask from './browserify'

gulp.task('watchify', (callback) => {
	// Start browserify task with devMode set to true
	browserifyTask(callback, true)
})
