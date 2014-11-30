/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp  = require('gulp');
var runSequence = require('run-sequence');
var config = require('../config');

gulp.task('watch', ['setWatch', 'build', 'browserSync'], function() {
	gulp.watch(config.lint.src, ['lint']);
	gulp.watch(config.sass.src, ['sass']);
	gulp.watch(config.fonts.src, ['fonts']);
	gulp.watch(config.markup.src, ['markup']);
});
