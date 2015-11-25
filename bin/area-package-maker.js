import nomnom from 'nomnom'
import yaml from 'js-yaml'
import stringify from 'json-stable-stringify'
import fs from 'graceful-fs'
import sha1 from 'sha1'
import path from 'path'
import findAreas from './lib/find-areas'

export function processAreasDir(dir) {
	const sources = findAreas(dir)

	const output = {
		files: [],
		type: 'areas',
	}

	sources
		.forEach(filename => {
			const file = fs.readFileSync(filename, {encoding: 'utf-8'})
			const hash = sha1(file)
			const data = yaml.safeLoad(file)

			output.files.push({
				hash: hash,
				path: filename.replace('build/', '').replace('areas/', ''),
				type: data.type.toLowerCase(),
				revision: data.revision,
			})
		})

	return stringify(output, {space: '\t'}) + '\n'
}

export function cli() {
	const args = nomnom
		.script('area-package-maker')
		.option('dir', {position: 0, required: true, help: 'The directory to process'})
		.option('save', {flag: true, help: 'Save the info file to `dir/info.json`'})
		.parse()

	const inDir = args.dir

	const data = processAreasDir(inDir)
	if (args.save) {
		fs.writeFileSync(path.join(inDir, 'info.json'), data, {encoding: 'utf-8'})
	}
	else {
		console.log(data)
	}
}
