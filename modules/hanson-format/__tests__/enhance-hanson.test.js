import {expect} from 'chai'
import {enhanceHanson} from '../enhance-hanson'
import {reference, course} from './parse-hanson-string/support'

describe('enhanceHanson', () => {
	it('adds a "slug" key to the top-level', () => {
		const actual = enhanceHanson({
			name: 'test',
			message: 'have a nice day',
		})
		expect(actual).to.have.property('slug', 'test')
	})

	it('marks the top-level as a "requirement"', () => {
		const actual = enhanceHanson({
			message: 'have a nice day',
		})
		expect(actual).to.have.property('$type', 'requirement')
	})

	it('requires the top-level to have certain keys', () => {
		expect(() => enhanceHanson({}))
			.to.throw('enhanceHanson(): could not find any of ["result", "message", "filter"] in ["$type", "slug"].')

		expect(() => enhanceHanson({"message": "have a nice day"}))
			.to.not.throw()

		expect(() => enhanceHanson({"result": "CSCI 121"}))
			.to.not.throw()
	})

	it('enforces a whitelist of keys at the top-level', () => {
		expect(() => enhanceHanson({xxx: 'yyy'}))
			.to.throw(/only \[.*\] keys are allowed/)
	})

	it('expands string-only keys into objects with a "result" key', () => {
		const actual = enhanceHanson({
			result: 'Requirement',
			Requirement: 'CSCI 121',
		})
		expect(actual).to.deep.equal({
			slug: '',
			result: reference('Requirement'),
			$type: 'requirement',
			Requirement: {
				$type: 'requirement',
				result: course('CSCI 121'),
			},
		})
	})
})
