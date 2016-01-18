import db from './db'
import {enhance as enhanceHanson} from '../area-tools'
import some from 'lodash/collection/some'
import max from 'lodash/collection/max'
import isArray from 'lodash/lang/isArray'
import yaml from 'js-yaml'

function resolveArea(areas) {
	if (some(areas, possibility => 'dateAdded' in possibility)) {
		return max(areas, 'dateAdded')
	}
	else {
		return max(areas, possibility => possibility.sourcePath.length)
	}
}

function loadArea(areaQuery) {
	const {name, type, revision, source, isCustom} = areaQuery

	let area = {...areaQuery}
	if (isCustom && source) {
		return {...areaQuery, _area: enhanceHanson(yaml.safeLoad(source))}
	}

	let dbQuery = {name: [name], type: [type]}
	if (revision) {
		dbQuery.revision = [revision]
	}

	return db.store('areas').query(dbQuery)
		.then(area => {
			if (isArray(area) && area.length) {
				area = resolveArea(area)
			}

			if (area === undefined || isArray(area)) {
				area._error = `the area "${name}" (${type}) could not be found with the query ${JSON.stringify(dbQuery)}`
			}

			return {...areaQuery, _area: enhanceHanson(area)}
		})
		.catch(err => {
			console.error(err)  // we can probably remove this in the future
			area._error = `Could not find area ${JSON.stringify(dbQuery)} (error: ${err.message})`
		})
}


const promiseCache = new Map()

export default function getArea({name, type, revision, source, isCustom}, {cache=[]}) {
	let cachedArea = find(cache, a => a.name === name && a.type === type && a.revision === revision)
	if (cachedArea) {
		console.log('loadArea used cached area')
		return Promise.resolve(cachedArea)
	}

	let id = `{${name}, ${type}, ${revision}}`
	if (promiseCache.has(id)) {
		return promiseCache.get(id)
	}

	let promise = loadArea({name, type, revision, source, isCustom})

	promiseCache.set(id, promise)

	return promiseCache.get(id)
		.then(area => {
			promiseCache.delete(id)
			return area
		})
}
