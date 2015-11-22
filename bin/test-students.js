import includes from 'lodash/collection/includes'
import path from 'path'
import {testStudent} from './test-a-student.js'
import {readdirSync} from 'graceful-fs'

const studentDir = './test/example-students/'

function getStudentNames() {
	return readdirSync(studentDir)
		.filter(filename => includes(['.json', '.yaml'], path.extname(filename)))
		.map(filename => path.resolve(studentDir + filename))
}

export function cli() {
	for (const studentFilename of getStudentNames()) {
		testStudent(studentFilename)
	}
}
