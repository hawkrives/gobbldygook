import props from 'p-props'
import {embedActiveStudentCourses} from './embed-active-student-courses'
import {getStudentStudies} from './get-student-studies'
import {fulfillFulfillments} from './fulfill-fulfillments'

// @throws
export async function getStudentData(student, {areas, courses}) {
	let promisedAreas = getStudentStudies(student, {cache: areas})

	let promisedSchedules = embedActiveStudentCourses(student, {
		cache: courses,
	})

	let promisedFulfillments = fulfillFulfillments(student, {
		cache: courses,
	})

	let data = await props({
		areas: promisedAreas,
		schedules: promisedSchedules,
		fulfilled: promisedFulfillments,
	})

	return {...student, ...data}
}
