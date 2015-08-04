import evaluate from '../src/lib/evaluate'
import loadArea from './load-area'

import {readFileSync, readdirSync} from 'graceful-fs'

import path from 'path'

import {describe, it} from 'mocha'
import {expect} from 'chai'

const studentDir = './test/example-students/'

function loadStudent(filename) {
	return JSON.parse(readFileSync(filename, {encoding: 'utf-8'}))
}

function getStudentNames() {
	return readdirSync(studentDir)
		.filter((filename) => path.extname(filename) === '.json')
		.map((filename) => path.resolve(studentDir + filename))
}

export function cli() {
	getStudentNames()
		.map(filename => {
			const s = loadStudent(filename)
			s.areas = s.areas.map(loadArea)
			return {...s, filename}
		})
		.forEach(({courses, overrides, areas, filename, expectation=true, pending=false}) => {
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
