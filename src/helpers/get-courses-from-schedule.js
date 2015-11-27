import getCourses from './get-courses'

export default function getCoursesFromSchedule(schedule) {
	return getCourses(
		schedule.clbids,
		{year: schedule.year, semester: schedule.semester}
	)
}
