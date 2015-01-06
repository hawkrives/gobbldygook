/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var _ = require('lodash')
var gulp  = require('gulp')
var config = require('../config')

gulp.task('watch', ['watchify', 'browserSync'], function() {
	gulp.watch(config.lint, ['lint'])
	gulp.watch(config.sass.src, ['sass'])
	gulp.watch(config.copy.map(_.first), ['copy'])
})
