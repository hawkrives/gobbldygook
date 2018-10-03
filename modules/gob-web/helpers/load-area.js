// @flow

import {db} from './db'
import {enhanceHanson, type ParsedHansonFile} from '@gob/hanson-format'
import some from 'lodash/some'
import maxBy from 'lodash/maxBy'
import find from 'lodash/find'
import kebabCase from 'lodash/kebabCase'
import yaml from 'js-yaml'
import {type AreaQuery} from '@gob/object-student'
import {pluralizeArea} from '@gob/examine-student'
import {status, text} from '@gob/lib'

function resolveArea(areas, query) {
	if (areas.length === 1) {
		return areas[0]
	}

	if (!('revision' in query)) {
		return maxBy(areas, 'revision')
	} else if (some(areas, possibility => 'dateAdded' in possibility)) {
		return maxBy(areas, 'dateAdded')
	} else {
		return maxBy(areas, possibility => possibility.sourcePath.length)
	}
}

type ResultOrError<T> =
	| {error: true, message: string, data: T}
	| {error: false, data: T}

function loadAreaFromDatabase(areaQuery: AreaQuery) {
	const {name, type, revision} = areaQuery

	let dbQuery = {}
	dbQuery.name = [name]
	dbQuery.type = [type]
	if (revision && revision !== 'latest') {
		dbQuery.revision = [revision]
	}

	return db
		.store('areas')
		.query(dbQuery)
		.then(result => {
			if (!result || !result.length) {
				let q = JSON.stringify(dbQuery)
				return {
					error: true,
					message: `the area "${name}" (${type}) could not be found with the query ${q}`,
					data: dbQuery,
				}
			}

			result = resolveArea(result, dbQuery)
			return {error: false, data: enhanceHanson(result)}
		})
		.catch(err => {
			let q = JSON.stringify(dbQuery)
			return {
				error: true,
				message: `Could not find area ${q} (error: ${err.message})`,
				data: dbQuery,
			}
		})
}

export function loadArea(
	areaQuery: AreaQuery,
): ResultOrError<ParsedHansonFile> {
	let {name, type, revision} = areaQuery

	return loadAreaFromDatabase({name, type, revision})
}
