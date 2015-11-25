import Promise from 'bluebird'
import yaml from 'js-yaml'
import enhanceHanson from '../../src/area-tools/enhance-hanson'
import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import find from 'lodash/collection/find'
import max from 'lodash/collection/max'
import findAreas from './find-areas'
const fs = Promise.promisifyAll(require('graceful-fs'))

export async function getArea({name, type, revision}) {
	type = type.toLowerCase()
	name = name.toLowerCase()

	const root = 'area-data/'
	const areaFiles = findAreas(root)
	const areaData = map(areaFiles, f => fs.readFileSync(f, 'utf-8'))

	const areas = map(areaData, yaml.safeLoad)

	const filteredAreas = filter(areas, area => (
		area.type.toLowerCase() === type &&
		area.name.toLowerCase() === name
	))

	if (!revision) {
		// max returns the entire object that it matched
		return max(filteredAreas, area => Number(area.revision.split('-')[0]))
	}

	return find(filteredAreas, {revision})
}

export default async function loadArea({name, type, revision, source, isCustom}) {
	let obj = isCustom
		? yaml.safeLoad(source)
		: await getArea({name, type, revision})

	let result
	try {
		// console.log(obj)
		result = enhanceHanson(obj, {topLevel: true})
	}
	catch (err) {
		console.error(`Problem enhancing area "${name}"`, err)
	}

	return result
}
