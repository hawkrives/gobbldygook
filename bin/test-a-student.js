import nom from 'nomnom'
import path from 'path'
import {describe, it} from 'mocha'
import {expect} from 'chai'

import evaluate from '../src/lib/evaluate'
import loadStudent from './lib/load-student'

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
