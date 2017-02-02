import pify from 'pify'
const fs = pify(require('graceful-fs'))
import nom from 'nomnom'
import path from 'path'
import Mocha, { Test } from 'mocha'
import { expect } from 'chai'

import flatten from 'lodash/flatten'
import junk from 'junk'

import { evaluate } from 'modules/examine-student'
import loadStudent from '../../cli/lib/load-student'

function testStudent(student, mochaInstance) {
	let {
		areas,
		courses,
		expectation=true,
		filename,
		overrides,
		pending=false,
	} = student

	if (pending) {
		return
	}

	let suiteInstance = Mocha.Suite.create(mochaInstance.suite, path.basename(filename))

	areas.forEach(data => {
		suiteInstance.addTest(new Test(`${expectation ? 'should' : 'should not'} pass ${data.name}`, () => {
			let result = evaluate({ courses, overrides }, data)
			expect(result).to.have.property('computed', expectation)
		}))
	})
}

function loadFile(filepath) {
	return fs.readFileAsync(filepath, 'utf-8')
}

async function loadDir(dirpath) {
	let promises = (await fs.readdirAsync(dirpath))
		.filter(filename => path.extname(filename) === '.json' ||
							path.extname(filename) === '.yaml')
		.filter(junk.not)
		.map(filename => path.resolve(dirpath, filename))
		.map(loadFile)
	return Promise.all(promises)
}

async function loadDirOrFile(path) {
	let stats = await fs.statAsync(path)
	if (stats.isDirectory()) {
		return loadDir(path)
	}
	return loadFile(path)
}

async function loadInput(paths) {
	let filePromises = paths.map(loadDirOrFile)
	let files = flatten(await Promise.all(filePromises))
	let loaded = await Promise.all(files.map(data => loadStudent(data, { isFile: false })))
	return loaded
}

export async function cli() {
	let args = nom()
		.option('input', {
			required: true,
			position: 0,
			list: true,
			default: [ './test/example-students/' ],
			help: 'a student file or folder of student files, or stdin',
		})
		.parse()

	let students = await loadInput(args.input)

	let mochaInstance = new Mocha()
	students.forEach(student => testStudent(student, mochaInstance))
	mochaInstance.run()
}
