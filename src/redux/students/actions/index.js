/* globals module */

import {default as loadStudents, loadStudent} from './load-students'
import importStudent from './import-student'
import initStudent from './init-student'
import destroyStudent from './destroy-student'
import saveStudent from './save-student'

import * as areas from './areas'
import * as change from './change'
import * as check from './check-student'
import * as courses from './courses'
import * as fabrications from './fabrications'
import * as overrides from './overrides'
import * as schedules from './schedules'

module.exports = {
	__esModule: true,
	loadStudents,
	loadStudent,
	importStudent,
	initStudent,
	destroyStudent,
	saveStudent,
	...areas,
	...change,
	...check,
	...courses,
	...fabrications,
	...overrides,
	...schedules,
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
