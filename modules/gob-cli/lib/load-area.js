// @flow

import yaml from 'js-yaml'
import {enhanceHanson as enhance} from '@gob/hanson-format'
import {type AreaQuery} from '@gob/object-student'
import maxBy from 'lodash/maxBy'
import got from 'got'

const BASE = 'https://hawkrives.github.io/gobbldygook-area-data'

const getInfoFile = () =>
	got(`${BASE}/info.json`, {json: true}).then(r => r.body)

async function findArea({name, type, revision}) {
	type = type.toLowerCase()
	name = name.toLowerCase()

	let info = await getInfoFile()

	let matches = info.files.filter(
		area =>
			area.type.toLowerCase() === type &&
			area.name.toLowerCase() === name,
	)

	if (!matches.length) {
		let ser = JSON.stringify({name, type, revision})
		throw new Error(`could not find area matching ${ser}`)
	}

	if (!revision || revision === 'latest') {
		// maxBy returns the entire object that it matched
		return maxBy(matches, area => Number(area.revision.split('-')[0]))
	}

	return matches.find(a => a.revision === revision)
}

function getArea({path}) {
	return got(`${BASE}/${path}`).then(r => yaml.safeLoad(r.body))
}

async function loadArea({name, type, revision}: AreaQuery) {
	let foundArea = await findArea({name, type, revision})
	if (!foundArea) {
		let ser = JSON.stringify({name, type, revision})
		throw new Error(`could not find area matching ${ser}`)
	}
	let obj = await getArea(foundArea)
	return enhance(obj)
}

export default loadArea
