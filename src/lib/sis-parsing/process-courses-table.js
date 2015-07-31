import tableToJson from './table-to-json'
import prettifyCourses from './prettify-courses'

export default function processCoursesTable(coursesTable) {
	let jsonRepresentation = tableToJson(coursesTable)
	jsonRepresentation.pop() // remove the extra row at the end

	// loop to query each of the ugly
	let coursesArr = prettifyCourses(jsonRepresentation)

	return coursesArr
}
