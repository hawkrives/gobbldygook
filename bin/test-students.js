import includes from 'lodash/collection/includes'
import path from 'path'
import {readdirSync} from 'graceful-fs'
import junk from 'junk'
import Mocha from 'mocha'
import {testStudent} from './test-a-student.js'

const studentDir = './test/example-students/'

function getStudentNames() {
	return readdirSync(studentDir)
		.filter(filename => includes(['.json', '.yaml'], path.extname(filename)))
		.filter(junk.not)
		.map(filename => path.resolve(studentDir + filename))
}

export async function cli() {
	const mochaInstance = new Mocha()

	for (const studentFilename of getStudentNames()) {
		await testStudent(studentFilename, mochaInstance)
	}

	mochaInstance.run()
}
