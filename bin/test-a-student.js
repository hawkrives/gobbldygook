import nom from 'nomnom'
import path from 'path'
import Mocha, {Test} from 'mocha'
import {expect} from 'chai'

import evaluate from '../src/area-tools/evaluate'
import loadStudent from './lib/load-student'

export async function testStudent(studentFileName, mochaInstance) {
	const {
		areas,
		courses,
		expectation=true,
		filename,
		overrides,
		pending=false,
	} = await loadStudent(studentFileName)

	if (pending) {
		return
	}

	const suiteInstance = Mocha.Suite.create(mochaInstance.suite, path.basename(filename))

	areas.forEach(data => {
		suiteInstance.addTest(new Test(`${expectation ? 'should' : 'should not'} pass ${data.name}`, () => {
			const result = evaluate({courses, overrides}, data)
			expect(result).to.have.property('computed', expectation)
		}))
	})
}

export async function cli() {
	const args = nom()
		.option('filename', {
			required: true,
			position: 0,
			help: 'a student file',
		})
		.parse()

	const mochaInstance = new Mocha()
	await testStudent(args.filename, mochaInstance)
	mochaInstance.run()
}
