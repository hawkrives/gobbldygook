import nom from 'nomnom'
import path from 'path'
import yaml from 'js-yaml'
import {describe, it} from 'mocha'
import {expect} from 'chai'
import {readFileSync} from 'graceful-fs'

import evaluate from '../src/lib/evaluate'
import loadArea from './lib/load-area'

function loadStudent(filename) {
	const data = yaml.safeLoad(readFileSync(filename, {encoding: 'utf-8'}))
	data.areas = data.areas.map(loadArea)
	data.filename = filename
	return data
}

export function testStudent(studentFileName) {
	const {courses, overrides, areas, filename, expectation=true, pending=false} = loadStudent(studentFileName)

	const func = pending ? describe.skip : describe

	func(path.basename(filename), () => {
		areas.forEach(data => {
			it(`${expectation ? 'should' : 'should not'} pass ${data.name}`, () => {
				const result = evaluate({courses, overrides}, data)
				expect(result).to.have.property('computed', expectation)
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
