import nom from 'nomnom'
import fs from 'graceful-fs'
import yaml from 'js-yaml'
import enhanceHanson from '../src/area-tools/enhance-hanson'

export function cli() {
	const args = nom()
		.script('compile-student')
		.option('filename', {
			position: 0,
			required: true,
			help: 'the file to process',
		})

	const data = fs.readFileSync(args.filename, {encoding: 'utf-8'})
	const obj = yaml.safeLoad(data)
	const enhanced = enhanceHanson(obj)
	console.log(JSON.stringify(enhanced, null, 2))
}
