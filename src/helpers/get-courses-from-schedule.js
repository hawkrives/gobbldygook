import getCourses from './get-courses'

export default async function getCoursesFromSchedule(schedule) {
	return getCourses(schedule.clbids, {year: schedule.year, semester: schedule.semester})
}
