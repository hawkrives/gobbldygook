import yaml from 'js-yaml'
import {enhanceHanson as enhance} from '@gob/hanson-format'
import maxBy from 'lodash/maxBy'
import got from 'got'

const Keyv = require('keyv')
const KeyvFile = require('keyv-file')

const keyv = new Keyv({
	store: new KeyvFile(),
})

const BASE = 'https://hawkrives.github.io/gobbldygook-area-data'

const getInfoFile = async () => {
	let url = `${BASE}/info.json`
	return (await got(url, {json: true, cache: keyv})).body
}

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
		let msg = `could not find area matching ${JSON.stringify({
			name,
			type,
			revision,
		})}`
		throw new Error(msg)
	}

	if (!revision || revision === 'latest') {
		// maxBy returns the entire object that it matched
		return maxBy(matches, area => Number(area.revision.split('-')[0]))
	}

	return matches.find(a => a.revision === revision)
}

async function getArea({path}) {
	let url = `${BASE}/${path}`
	return yaml.safeLoad((await got(url, {cache: keyv})).body)
}

async function loadArea({name, type, revision, source, isCustom}) {
	let obj

	if (isCustom) {
		obj = yaml.safeLoad(source)
	} else {
		let foundArea
		try {
			foundArea = await findArea({name, type, revision})
		} catch (error) {
			console.error(error.message)
			return null
		}
		obj = await getArea(foundArea)
	}

	try {
		return enhance(obj)
	} catch (err) {
		console.error(`Problem enhancing area "${name}": ${err.message}`)
		return null
	}
}

export default loadArea
