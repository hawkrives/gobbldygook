/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

import gulp from 'gulp'
import {forEach} from 'lodash'
import config from '../config'

gulp.task('watch', ['copy', 'sass', 'watchify'], () => {
	gulp.run('browser-sync')
	gulp.watch(config.lint, ['lint'])
	gulp.watch(config.sass.src, ['sass'])

	forEach(config.copy, pathInfo => {
		let [sourcePath, destPath, title] = info
		gulp.watch(sourcePath, ['copy:' + title])
	})
})
