import compact from 'lodash/array/compact'
import tableToJson from './table-to-json'
import map from 'lodash/collection/map'

function mungeArea(type) {
	return area => ({name: area, type})
}

export default function processAreaTable(areaTable) {
	// The areas table is layed out in columns, like so:
	//
	// Majors        | Emphases | Concentrations
	// ------------- | -------- | --------------
	// CompSci       |          | Japan Studies
	// Asian Studies |          |
	//
	// Therefore, we loop over the rows, and pull out the data from there.

	const jsonRepresentation = tableToJson(areaTable)

	const majors = compact(map(jsonRepresentation, row => row.majors))
	const concentrations = compact(map(jsonRepresentation, row => row.concentrations))
	const emphases = compact(map(jsonRepresentation, row => row.emphases))

	return [
		...map(majors, mungeArea('major')),
		...map(concentrations, mungeArea('concentration')),
		...map(emphases, mungeArea('emphasis')),
	]
}
