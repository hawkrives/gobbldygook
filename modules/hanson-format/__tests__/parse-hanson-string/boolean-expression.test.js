import {expect} from 'chai'
import {course} from './support'
import {customParser} from './support'
const parse = customParser({allowedStartRules: ['Or']})

describe('BooleanExpression', () => {
	it('parses courses seperated by | as being or-d', () => {
		expect(parse('CSCI 121 | CSCI 125')).to.deep.equal({
			$type: 'boolean',
			$or: [
				course('CSCI 121'),
				course('CSCI 125'),
			],
		})
	})

	it('parses courses seperated by & as being and-d', () => {
		expect(parse('CSCI 121 & CSCI 125')).to.deep.equal({
			$type: 'boolean',
			$and: [
				course('CSCI 121'),
				course('CSCI 125'),
			],
		})
	})

	it('parses courses with no departments after an prior department', () => {
		expect(parse('CSCI 121 | 125')).to.deep.equal({
			$type: 'boolean',
			$or: [
				course('CSCI 121'),
				course('CSCI 125'),
			],
		})
	})

	it('changes departments when given a new one', () => {
		expect(parse('CSCI 121 | PSCI 125')).to.deep.equal({
			$type: 'boolean',
			$or: [
				course('CSCI 121'),
				course('PSCI 125'),
			],
		})
	})

	it('allows several &-d courses in a row', () => {
		expect(parse('CSCI 121 & 125 & 126 & 123')).to.deep.equal({
			$type: 'boolean',
			$and: [
				course('CSCI 121'),
				course('CSCI 125'),
				course('CSCI 126'),
				course('CSCI 123'),
			],
		})
	})

	it('allows several |-d courses in a row', () => {
		expect(parse('CSCI 121 | 125 | 126 | 123')).to.deep.equal({
			$type: 'boolean',
			$or: [
				course('CSCI 121'),
				course('CSCI 125'),
				course('CSCI 126'),
				course('CSCI 123'),
			],
		})
	})

	it('keeps duplicates in a list of courses', () => {
		expect(parse('CSCI 121 | 121 | 125')).to.deep.equal({
			$type: 'boolean',
			$or: [
				course('CSCI 121'),
				course('CSCI 121'),
				course('CSCI 125'),
			],
		})
	})

	it('allows a & b | c – boolean logic for courses', () => {
		expect(parse('CSCI 121 & 122 | 123')).to.deep.equal({
			$type: 'boolean',
			$or: [
				{
					$type: 'boolean',
					$and: [
						course('CSCI 121'),
						course('CSCI 122'),
					],
				},
				course('CSCI 123'),
			],
		})
	})

	it('allows a | b & c – boolean logic for courses', () => {
		expect(parse('CSCI 121 | 122 & 123')).to.deep.equal({
			$type: 'boolean',
			$or: [
				course('CSCI 121'),
				{
					$type: 'boolean',
					$and: [
						course('CSCI 122'),
						course('CSCI 123'),
					],
				},
			],
		})
	})

	it('supports parentheses to control order-of-operations - (a | b) & c', () => {
		expect(parse('(CSCI 121 | 122) & 123')).to.deep.equal({
			$type: 'boolean',
			$and: [
				{
					$type: 'boolean',
					$or: [
						course('CSCI 121'),
						course('CSCI 122'),
					],
				},
				course('CSCI 123'),
			],
		})
	})
})
