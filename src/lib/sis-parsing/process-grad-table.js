import mapKeys from 'lodash/object/mapKeys'
import tableToJson from './table-to-json'

export default function processGradTable(gradTable) {
	const jsonRepresentation = tableToJson(gradTable)
	const result = mapKeys(jsonRepresentation, (value, key) => {
		return key.replace('&nbsp;', ' ')
	})
	return result
}
