import yaml from 'js-yaml'
import enhanceHanson from '../../src/lib/enhance-hanson'
import findAreaPath from '../../src/lib/find-area-path'
import path from 'path'
import fs from 'graceful-fs'

export default function loadArea({name, type, revision}) {
	const filepath = path.join('area-data', findAreaPath({name, type, revision}))
	const data = fs.readFileSync(filepath, {encoding: 'utf-8'})
	const obj = yaml.safeLoad(data)
	return enhanceHanson(obj, {topLevel: true})
}
