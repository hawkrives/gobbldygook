import cleanThePage from './clean-the-page'
import nameTheTables from './name-the-tables'
import processCoursesTable from './process-courses-table'
import processInfoTable from './process-info-table'
import processAreaTable from './process-area-table'

function expandDegreeType(type) {
	if (type === 'B.A.') {
		return 'Bachelor of Arts'
	}
	else if (type === 'B.M.') {
		return 'Bachelor of Music'
	}
	return type
}

export default function parseSIS(html) {
	const [rawTables, degreeType] = cleanThePage(html)
	const tables = nameTheTables(rawTables)

	const cleanedTables = {
		courses: processCoursesTable(tables.courses),
		areas: processAreaTable(tables.areas),
		...processInfoTable(tables.info),
	}

	cleanedTables.areas.degrees = [expandDegreeType(degreeType)]

	return cleanedTables
}
