import concatAndMerge from '../../src/helpers/concat-and-merge'
import {merge} from 'lodash'

describe('concatAndMerge', () => {
	it('merges two objects together, concatenating any arrays', () => {
		let obj1 = {a: 'a', b: [1, 2]}
		let obj2 = {c: 'c', b: [3, 4]}

		let expectedResult = {
			a: 'a',
			b: [1, 2, 3, 4],
			c: 'c',
		}

		expect(concatAndMerge(obj1, obj2)).to.eql(expectedResult)
	})

	it('works with lodash.merge', () => {
		let obj1 = {a: 'a', b: [1, 2]}
		let obj2 = {c: 'c', b: [3, 4]}

		let expectedResult = {
			a: 'a',
			b: [1, 2, 3, 4],
			c: 'c',
		}

		expect(merge(obj1, obj2, concatAndMerge)).to.eql(expectedResult)
	})
})
