/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   This task is set up to generate multiple separate bundles, from different
   sources, and to use Watchify when run from the default task.

   See browserify.bundleConfigs in gulp/config.js
*/

import _ from 'lodash'
import browserify from 'browserify'
import browserSync from 'browser-sync'
import bundleLogger from '../util/bundleLogger'
import exorcist from 'exorcist'
import gulp from 'gulp'
import gulpif from 'gulp-if'
import handleErrors from '../util/handleErrors'
import mold from 'mold-source-map'
import source from 'vinyl-source-stream'
import to5ify from '6to5ify'
import watchify from 'watchify'
import {browserify as config} from '../config'

function browserifyTask(callback, devMode) {
	let bundleQueue = config.bundleConfigs.length

	let browserifyThis = (bundleConfig) => {
		if (devMode) {
			// Add watchify args and debug (sourcemaps) option
			_.extend(bundleConfig, watchify.args, { debug: true })
			// A watchify require/external bug that prevents proper recompiling,
			// so (for now) we'll ignore these options during development
			bundleConfig = _.omit(bundleConfig, ['external', 'require'])
		}

		let b = browserify(bundleConfig)

		b.transform(to5ify.configure({
			blacklist: ['generators'],
		}))

		let bundle = () => {
			// Log when bundling starts
			bundleLogger.start(bundleConfig.outputName)

			return b
				.bundle()
				// Report compile errors
				.on('error', handleErrors)
				// Make the sourcemap relative
				.pipe(gulpif(devMode === true, mold.transformSourcesRelativeTo('.')))
				// Use exorcist to remove the map file
				.pipe(exorcist(bundleConfig.mapFile))
				// Use vinyl-source-stream to make the stream gulp compatible.
				// Specifiy the desired output filename here.
				.pipe(source(bundleConfig.outputName))
				// Specify the output destination
				.pipe(gulp.dest(bundleConfig.dest))
				.on('end', reportFinished)
				.pipe(browserSync.reload({ stream: true }))
		}

		if (devMode) {
			// Wrap with watchify and rebundle on changes
			b = watchify(b)
			// Rebundle on update
			b.on('update', bundle)
			bundleLogger.watch(bundleConfig.outputName)
		}
		else {
			// Sort out shared dependencies.
			// b.require exposes modules externally
			if (bundleConfig.require) {
				b.require(bundleConfig.require)
			}
			// b.external excludes modules from the bundle, and expects
			// they'll be available externally
			if (bundleConfig.external) {
				b.external(bundleConfig.external)
			}
		}

		let reportFinished = function() {
			// Log when bundling completes
			bundleLogger.end(bundleConfig.outputName)

			if (bundleQueue) {
				bundleQueue -= 1
				if (bundleQueue === 0) {
					// If queue is empty, tell gulp the task is complete.
					// https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
					callback()
				}
			}
		}

		return bundle()
	}

	// Start bundling with Browserify for each bundleConfig specified
	return config.bundleConfigs.map(browserifyThis)
}

gulp.task('browserify', browserifyTask)

// Exporting the task so we can call it directly in our watch task, with the 'devMode' option
export default browserifyTask
