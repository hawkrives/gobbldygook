import map from 'lodash/map'
import fromPairs from 'lodash/fromPairs'
import mapKeys from 'lodash/mapKeys'
import unzip from 'lodash/unzip'
import filter from 'lodash/filter'
import { selectAll, selectOne } from 'css-select'
import { partitionByIndex } from 'modules/lib'
import { getText } from './lib'

function extractInformationFromInfoTable(table) {
	// So "info" is the first table; it's essentially key-value pairs, in column-row fashion.
	// We start out by grabbing all <td> elements under "info"
  let infoText = map(selectAll('td', table), getText)
	// Next, because they're k/v pairs, we want to group them into two arrays: keys, and values.
	// `partition` groups elements of an array into two arrays based on the predicate function, which we've built around the index.
  let infoKeysValues = partitionByIndex(infoText)
	// The fromPairs(unzip()) dance builds an object from the k/v paired arrays.
	// `unzip` turns the [[keys], [values]] array into [[k,v], [k,v], ...], which `fromPairs` turns into an object.
  let info = fromPairs(unzip(infoKeysValues))
	// `mapKeys` purpose is to remove the ':' from the end of the keys, and to lower-case the keys.
  info = mapKeys(info, (val, key) => key.replace(':', '').toLowerCase())

	// The advisor's name also includes their department. We don't care about the department, so we remove it.
  info.advisor = info.advisor.replace(/\s-\s.*/, '')

	// Now we're just cleaning up some of the longer key names.
  info.graduation = Number(info['class year'])
  delete info['class year']
  info.matriculation = Number(info['curriculum year'])
  delete info['curriculum year']

  return info
}

function extractInformationFromAreaTable(table) {
	// Alright! Now we're going to grab all <td> elements from the "areas" table.
  let areas = map(selectAll('td', table), getText)

	// This table is organized into rows.
	// The number of rows is equal to the largest category of areas.
	// If you have three majors, and one concentration, there will be three rows.
	// If you have one major, and onetwo concentrations, there will be two rows.

	// Thus, we go through here and split out the items based on their index.
	// (also, we remove any 0-length strings, because we don't care about them.)
  let majors         = filter(areas, (item, i) => i % 3 === 0 && item.length)
  let emphases       = filter(areas, (item, i) => i % 3 === 1 && item.length)
  let concentrations = filter(areas, (item, i) => i % 3 === 2 && item.length)

  return {
    majors,
    emphases,
    concentrations,
  }
}

export function extractInformationFromDegreeAudit(auditInfo, infoElement) {
  let [ degreeType ] = getText(selectOne('h3', auditInfo)).match(/B\.[AM]\./)
  if (degreeType === 'B.A.') {
    degreeType = 'Bachelor of Arts'
  }
  else if (degreeType === 'B.M.') {
    degreeType = 'Bachelor of Music'
  }

	// There are two tables that are children of another table
	// yay, tables for layout.
  let [ infoTable, areaTable ] = selectAll('table table', infoElement)

  let info = extractInformationFromInfoTable(infoTable)
  let areas = extractInformationFromAreaTable(areaTable)

  return {
    ...info,
    ...areas,
    degree: degreeType,
  }
}
