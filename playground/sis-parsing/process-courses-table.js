import tableToJson from './table-to-json'
import prettyifyCourses from './prettyify-courses'

export default function processCoursesTable(coursesTable) {
	let jsonRepresentation = tableToJson(coursesTable)
	jsonRepresentation.pop() // remove the extra row at the end

	// loop to query each of the ugly
	let coursesArr = prettyifyCourses(jsonRepresentation)

	return coursesArr
}
