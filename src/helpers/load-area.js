import db from './db'
import {enhance as enhanceHanson} from '../area-tools'
import some from 'lodash/some'
import maxBy from 'lodash/maxBy'
import isArray from 'lodash/isArray'
import yaml from 'js-yaml'

function resolveArea(areas, query) {
	if (!('revision' in query)) {
		return maxBy(areas, 'revision')
	}
	else if (some(areas, possibility => 'dateAdded' in possibility)) {
		return maxBy(areas, 'dateAdded')
	}
	else {
		return maxBy(areas, possibility => possibility.sourcePath.length)
	}
}

function loadArea(areaQuery) {
	const {name, type, revision, source, isCustom} = areaQuery

	let area = {...areaQuery}
	if (isCustom && source) {
		return {...areaQuery, _area: enhanceHanson(yaml.safeLoad(source))}
	}

	let dbQuery = {name: [name], type: [type]}
	if (revision && revision !== 'latest') {
		dbQuery.revision = [revision]
	}

	return db.store('areas').query(dbQuery)
		.then(area => {
			if (isArray(area) && area.length) {
				area = resolveArea(area, dbQuery)
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

export default async function getArea({name, type, revision, source, isCustom}, {cache=[]}) {
	let cachedArea = find(cache, a => a.name === name && a.type === type && a.revision === revision)
	if (cachedArea) {
		console.log('loadArea used cached area')
		return cachedArea
	}

	let id = `{${name}, ${type}, ${revision}}`
	if (promiseCache.has(id)) {
		return promiseCache.get(id)
	}

	let promise = loadArea({name, type, revision, source, isCustom})

	promiseCache.set(id, promise)

	let area = await promiseCache.get(id)

	promiseCache.delete(id)

	return area
}
