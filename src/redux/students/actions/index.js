/* globals module */

import {default as loadStudents, loadStudent} from './load-students'
import importStudent from './import-student'
import initStudent from './init-student'
import destroyStudent from './destroy-student'

import * as change from './change'
import * as areas from './areas'
import * as schedules from './schedules'
import * as courses from './courses'
import * as overrides from './overrides'
import * as fabrications from './fabrications'

module.exports = {
	__esModule: true,
	loadStudents,
	loadStudent,
	importStudent,
	initStudent,
	destroyStudent,
	...change,
	...areas,
	...schedules,
	...courses,
	...overrides,
	...fabrications,
}

// this is the better way to do it
// export {default as loadStudents} from './load-students'
// export {default as importStudent} from './import-student'
// export {default as initStudent} from './init-student'
// export {default as destroyStudent} from './destroy-student'

// webpack dies if these are enabled
// export * from './change'
// export * from './areas'
// export * from './schedules'
// export * from './courses'
// export * from './overrides'
// export * from './fabrications'
