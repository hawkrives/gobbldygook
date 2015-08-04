import cleanThePage from './clean-the-page'
import nameTheTables from './name-the-tables'
import processCoursesTable from './process-courses-table'
import processInfoTable from './process-info-table'
import processAreaTable from './process-area-table'
import makeStudent from './make-student'

export default function parseSIS(html) {
	const [rawTables, degreeType] = cleanThePage(html)
	const tables = nameTheTables(rawTables)

	const cleanedTables = {
		courses: processCoursesTable(tables.courses),
		info: processInfoTable(tables.info),
		areas: processAreaTable(tables.areas),
	}

	return makeStudent(cleanedTables, degreeType)
}
