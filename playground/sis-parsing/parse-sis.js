import cleanThePage from './clean-the-page'
import nameTheTables from './name-the-tables'
import processCoursesTable from './process-courses-table'
import processInfoTable from './process-info-table'
import processAreaTable from './process-area-table'
import makeStudent from './make-student'

export default function parseSIS(html) {
	let [rawTables, degreeType] = cleanThePage(html)
	let tables = nameTheTables(rawTables)
	//console.log(tables)

	let cleanedTables = {
		courses: processCoursesTable(tables.courses),
		info: processInfoTable(tables.info),
		areas: processAreaTable(tables.areas),
	}

	//console.log('cleaned', cleanedTables)
	let student = makeStudent(cleanedTables, degreeType)
	//console.log('student', student)

	return student
}
