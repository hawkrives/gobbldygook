import db from './db'
import { enhanceHanson } from 'modules/hanson-format'
import some from 'lodash/some'
import maxBy from 'lodash/maxBy'
import yaml from 'js-yaml'
import debug from 'debug'
const log = debug('worker:load-area')

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
	const { name, type, revision, source, isCustom } = areaQuery

	let area = { ...areaQuery }
	if (isCustom && source) {
		return Promise.resolve({ ...areaQuery, _area: enhanceHanson(yaml.safeLoad(source)) })
	}

	let dbQuery = { name: [ name ], type: [ type ] }
	if (revision && revision !== 'latest') {
		dbQuery.revision = [ revision ]
	}

	return db.store('areas').query(dbQuery)
		.then(result => {
			if (result === undefined) {
				return { ...areaQuery, _error: `the area "${name}" (${type}) could not be found with the query ${JSON.stringify(dbQuery)}` }
			}

			if (result.length === 1) {
				result = result[0]
			}
			else if (result.length >= 2) {
				result = resolveArea(result, dbQuery)
			}
			else {
				return { name, type, revision, _error: `the area "${name}" (${type}) could not be found with the query ${JSON.stringify(dbQuery)}` }
			}

			return { ...areaQuery, _area: enhanceHanson(result) }
		})
		.catch(err => {
			log(err)  // we can probably remove this in the future
			area._error = `Could not find area ${JSON.stringify(dbQuery)} (error: ${err.message})`
			return area
		})
}


const promiseCache = Object.create(null)

export default function getArea({ name, type, revision, source, isCustom }, { cache=[] }) {
	let cachedArea = find(cache, a => (a.name === name) && (a.type === type) && (revision === 'latest' ? true : a.revision === revision))
	if (cachedArea) {
		log('loadArea used cached area')
		return cachedArea
	}

	let id = `{${name}, ${type}, ${revision}}`
	if (promiseCache.hasOwnProperty(id)) {
		return promiseCache[id]
	}

	let promise = loadArea({ name, type, revision, source, isCustom })

	promiseCache[id] = promise

	return promiseCache[id].then(area => {
		delete promiseCache[id]
		return area
	})
}
