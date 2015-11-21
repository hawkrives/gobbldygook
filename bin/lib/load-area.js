import yaml from 'js-yaml'
import enhanceHanson from '../../src/lib/enhance-hanson'
import findAreaPath from '../../src/lib/find-area-path'
import path from 'path'
import fs from 'graceful-fs'

export default function loadArea({name, type, revision, source, isCustom}) {
	let obj = {}
	if (isCustom) {
		obj = yaml.safeLoad(source)
	}
	else {
		const filepath = path.join('area-data', `${findAreaPath({name, type, revision})}.yaml`)
		const data = fs.readFileSync(filepath, {encoding: 'utf-8'})
		obj = yaml.safeLoad(data)
	}


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
