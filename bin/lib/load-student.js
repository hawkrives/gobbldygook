import loadArea from './load-area'
import {readFileSync} from 'graceful-fs'
import yaml from 'js-yaml'

export default async function loadStudent(filename) {
	const data = yaml.safeLoad(readFileSync(filename, 'utf-8'))
	data.areas = await Promise.all(data.areas.map(loadArea))
	data.filename = filename
	return data
}
