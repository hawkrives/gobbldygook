import yaml from 'js-yaml'
import {enhanceHanson as enhance} from '@gob/hanson-format'
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
		throw new Error('could not find area matching', {name, type, revision})
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

async function loadArea({name, type, revision, source, isCustom}) {
	let obj

	if (isCustom) {
		obj = yaml.safeLoad(source)
	} else {
		let foundArea = await findArea({name, type, revision})
		if (!foundArea) {
			throw new Error('could not find area matching', {
				name,
				type,
				revision,
			})
		}
		obj = await getArea(foundArea)
	}

	try {
		return enhance(obj)
	} catch (err) {
		console.error(`Problem enhancing area "${name}"`, err)
	}
}

export default loadArea
