import evaluate from '../src/lib/evaluate'
import loadArea from './lib/load-area'

import {readFileSync, readdirSync} from 'graceful-fs'

import path from 'path'

import {describe, it} from 'mocha'
import {expect} from 'chai'
import yaml from 'js-yaml'

const studentDir = './test/example-students/'

function loadStudent(filename) {
	const data = yaml.safeLoad(readFileSync(filename, {encoding: 'utf-8'}))
	data.areas = data.areas.map(loadArea)
	data.filename = filename
	return data
}

function getStudentNames() {
	return readdirSync(studentDir)
		.filter(filename => path.extname(filename) === '.json')
		.map(filename => path.resolve(studentDir + filename))
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
	getStudentNames().forEach(testStudent)
}
