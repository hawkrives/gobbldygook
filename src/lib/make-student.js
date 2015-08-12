import findAreasOfStudy from './find-areas-of-study'
import createSchedules from './create-schedules'

export default function makeStudent(tables, degreeType) {
	const {info, areas, courses} = tables

	return {
		name: info.name,
		advisor: info.advisor,
		matriculation: info.matriculation,
		graduation: info.graduation,

		studies: findAreasOfStudy(areas, degreeType),
		courses: courses,
		schedules: createSchedules(courses),
	}
}
