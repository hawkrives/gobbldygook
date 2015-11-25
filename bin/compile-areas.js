import nom from 'nomnom'
import fs from 'graceful-fs'
import yaml from 'js-yaml'
import enhanceHanson from '../src/area-tools/enhance-hanson'
import findAreas from './lib/find-areas'
import mkdirp from 'mkdirp'
import path from 'path'

export function cli() {
	const args = nom
		.script('compile-areas')
		.option('inDir', {
			position: 0,
			required: true,
			metavar: 'DIR',
			help: 'The directory to process',
		})
		.option('outDir', {
			required: true,
			abbr: 'o',
			full: 'out-dir',
			help: 'The directory to output to',
		})
		.parse()

	const {inDir, outDir} = args
	const sources = findAreas(inDir)

	sources
		.forEach((filename, index) => {
			if (index !== 0) {
				console.log()
			}

			console.log(`reading ${filename}`)
			const data = fs.readFileSync(filename, {encoding: 'utf-8'})
			console.log(`loading ${filename}`)
			const obj = yaml.safeLoad(data)
			console.log(`enhancing ${filename}`)
			const enhanced = enhanceHanson(obj, {topLevel: true})
			const outputFile = filename.replace(inDir, outDir).replace('.yaml', '.json')
			mkdirp.sync(path.dirname(outputFile))
			console.log(`writing to ${outputFile}`)
			fs.writeFileSync(outputFile, JSON.stringify(enhanced, null, 2), {encoding: 'utf-8'})
		})
}
