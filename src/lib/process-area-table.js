import compact from 'lodash/array/compact'
import pluck from 'lodash/collection/pluck'
import tableToJson from './table-to-json'

export default function processAreaTable(areaTable) {
	let jsonRepresentation = tableToJson(areaTable)
	let majors = compact(pluck(jsonRepresentation, 'majors'))
	let concentrations = compact(pluck(jsonRepresentation, 'concentrations'))
	let emphases = compact(pluck(jsonRepresentation, 'emphases'))
	return {majors, concentrations, emphases}
}
