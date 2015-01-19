/*
 * Rather than manage one giant configuration file responsible for
 * creating multiple tasks, each task has been broken out into its own
 * file in gulp/tasks. All files in that directory are required below.
 *
 * To add a new task, simply add a new task file that directory, and
 * require it here. `gulp/tasks/default.js` specifies the default set
 * of tasks to run when you run `gulp`.
 *
 * Derived from <https://github.com/greypants/gulp-starter>.
*/

require('6to5-core/register')

require('./gulp/tasks/browserify')
require('./gulp/tasks/browser-sync')
require('./gulp/tasks/build')
require('./gulp/tasks/copy')
require('./gulp/tasks/lint')
require('./gulp/tasks/sass')
require('./gulp/tasks/watch')
require('./gulp/tasks/watchify')

require('./gulp/tasks/default')
