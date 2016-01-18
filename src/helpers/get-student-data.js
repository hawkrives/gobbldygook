import embedActiveStudentCourses from './embed-active-student-courses'
import getStudentStudies from './get-student-studies'

export default function getStudentData(student, {areas, courses}) {
	const promisedAreas = getStudentStudies(student, {cache: areas, cacheOnly: true})
	const promisedSchedules = embedActiveStudentCourses(student, {cache: courses, cacheOnly: true})

	return Promise.all([promisedAreas, promisedSchedules])
		.then(([loadedAreas, loadedSchedules]) => ({
			...student,
			areas: loadedAreas,
			schedules: loadedSchedules,
		}))
		.catch(err => {
			throw err
		})
}
