/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

import gulp from 'gulp'
import config from '../config'

gulp.task('watch', ['copy', 'sass', 'lint', 'watchify'], () => {
	gulp.run('browser-sync')
	gulp.watch(config.lint, ['lint'])
	gulp.watch(config.sass.src, ['sass'])
	gulp.watch(config.copy.map(pathSet => pathSet[0]), ['copy'])
})
