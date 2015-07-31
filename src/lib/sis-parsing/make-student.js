import findAreasOfStudy from './find-areas-of-study'
import createSchedules from './create-schedules'

export default function makeStudent(tables, degreeType) {
	let student = {}

	student.name = tables.info.name
	student.advisor = tables.info.advisor
	student.matriculation = tables.info.matriculation
	student.graduation = tables.info.graduation

	student.studies = findAreasOfStudy(tables.areas, degreeType)
	student.courses = tables.courses
	student.schedules = createSchedules(tables.courses)

	return student
}
