import cleanThePage from './clean-the-page'
import nameTheTables from './name-the-tables'
import processCoursesTable from './process-courses-table'
import processInfoTable from './process-info-table'
import processAreaTable from './process-area-table'
import map from 'lodash/collection/map'
import groupBy from 'lodash/collection/groupBy'
import parseInt from 'lodash/string/parseInt'

function expandDegreeType(type) {
	if (type === 'B.A.') {
		return 'Bachelor of Arts'
	}
	else if (type === 'B.M.') {
		return 'Bachelor of Music'
	}
	return type
}

function coallateSchedules(courses) {
	let byTerm = groupBy(courses, 'term')
	return map(byTerm, (courses, term) => {
		console.log('courses', courses)
		return {
			year: parseInt(term.substr(0, 4)),
			semester: parseInt(term[4]),
			clbids: map(courses, c => c.clbid),
		}
	})
}

export default function parseSIS(html) {
	const [rawTables, degreeType] = cleanThePage(html)
	const tables = nameTheTables(rawTables)

	const courses = processCoursesTable(tables.courses)

	const areas = processAreaTable(tables.areas)
	const degree = {type: 'degree', name: expandDegreeType(degreeType)}

	const cleanedTables = {
		...processInfoTable(tables.info),
		studies: [degree, ...areas],
		schedules: coallateSchedules(courses),
	}

	return cleanedTables
}
