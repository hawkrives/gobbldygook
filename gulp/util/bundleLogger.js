/* bundleLogger
   ------------
   Provides gulp style logs to the bundle method in browserify.js
*/

var gutil        = require('gulp-util')
var prettyHrtime = require('pretty-hrtime')
var notify       = require('gulp-notify')

module.exports = function bundleLogger() {
	var startTime = undefined

	var start = function() {
		startTime = process.hrtime()
		gutil.log('Running', gutil.colors.green('"bundle"') + '...')
	}

	var end = function() {
		var taskTime = process.hrtime(startTime)
		var prettyTime = prettyHrtime(taskTime)
		gutil.log('Finished', gutil.colors.green('"bundle"'), 'in', gutil.colors.magenta(prettyTime))
		notify({message: 'Finished "bundle" in ' + prettyTime, activate: 'com.apple.Terminal'})
	}

	return {start: start, end: end}
}
