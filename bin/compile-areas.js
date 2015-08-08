import meow from 'meow'
import pkg from '../package.json'
import fs from 'graceful-fs'
import yaml from 'js-yaml'
import enhanceHanson from '../src/lib/enhance-hanson'
import findAreas from './find-areas'
import mkdirp from 'mkdirp'
import path from 'path'

export function cli() {
	const args = meow({
		pkg,
		help: `Usage:
			compile-areas input-dir --out-dir output/`,
	})

	if (!args.flags.outDir || !args.input.length) {
		args.showHelp()
	}

	const inDir = args.input[0]
	const outDir = args.flags.outDir
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
