import Bluebird from 'bluebird'
import embedActiveStudentCourses from './embed-active-student-courses'
import getStudentStudies from './get-student-studies'
import fulfillFulfillments from './fulfill-fulfillments'

export default function getStudentData(student, {areas, courses}) {
	const promisedAreas = getStudentStudies(student, {cache: areas})
	const promisedSchedules = embedActiveStudentCourses(student, {cache: courses})
	const promisedFulfillments = fulfillFulfillments(student, {cache: courses})

	return Bluebird
		.props({
			areas: promisedAreas,
			schedules: promisedSchedules,
			fulfilled: promisedFulfillments,
		})
		.then(data => ({
			...student,
			...data,
		}))
		.catch(err => {
			throw err
		})
}
