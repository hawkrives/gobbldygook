import nom from 'nomnom'
import path from 'path'
import yaml from 'js-yaml'
import {describe, it} from 'mocha'
import {expect} from 'chai'
import {readFileSync} from 'graceful-fs'

import evaluate from '../src/lib/evaluate'
import loadArea from './lib/load-area'

async function loadStudent(filename) {
	console.log(filename)
	const data = yaml.safeLoad(readFileSync(filename, 'utf-8'))
	console.log(filename)
	data.areas = await Promise.all(data.areas.map(loadArea))
	console.log(filename)
	data.filename = filename
	console.log(filename)
	return data
}

export function testStudent(studentFileName) {
	loadStudent(studentFileName).then(({
		areas,
		courses,
		expectation=true,
		filename,
		overrides,
		pending=false,
	}) => {
		const func = pending ? describe.skip : describe

		func(path.basename(filename), () => {
			areas.forEach(data => {
				it(`${expectation ? 'should' : 'should not'} pass ${data.name}`, () => {
					const result = evaluate({courses, overrides}, data)
					expect(result).to.have.property('computed', expectation)
				})
			})
		})
	})
}

export function cli() {
	const args = nom()
		.option('filename', {
			required: true,
			position: 0,
			help: 'a student file',
		})
		.parse()

	testStudent(args.filename)
}
