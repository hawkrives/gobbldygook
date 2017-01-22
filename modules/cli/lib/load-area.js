import pify from 'pify'
import yaml from 'js-yaml'
import { enhance } from 'modules/hanson-format'
import map from 'lodash/map'
import filter from 'lodash/filter'
import find from 'lodash/find'
import maxBy from 'lodash/maxBy'
import findAreas from './find-areas'
const fs = pify(require('graceful-fs'))

export async function getArea({ name, type, revision }) {
	type = type.toLowerCase()
	name = name.toLowerCase()

	const root = 'area-data/'
	const areaFiles = findAreas(root)
	let areaData = map(areaFiles, f => fs.readFileAsync(f, 'utf-8'))
	areaData = await Promise.all(areaData)

	const areas = map(areaData, yaml.safeLoad)

	const filteredAreas = filter(areas, area => (
		area.type.toLowerCase() === type &&
		area.name.toLowerCase() === name
	))

	if (!revision) {
		// maxBy returns the entire object that it matched
		return maxBy(filteredAreas, area => Number(area.revision.split('-')[0]))
	}

	return find(filteredAreas, { revision })
}

export default async function loadArea({ name, type, revision, source, isCustom }) {
	let obj = isCustom
		? yaml.safeLoad(source)
		: await getArea({ name, type, revision })

	let result
	try {
		// console.log(obj)
		result = enhance(obj)
	}
	catch (err) {
		console.error(`Problem enhancing area "${name}"`, err)
	}

	return result
}
