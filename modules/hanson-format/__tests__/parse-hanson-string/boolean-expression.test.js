import {expect} from 'chai'
import {parse} from '../../parse-hanson-string'

describe('BooleanExpression', () => {
	it('parses courses seperated by | as being or-d', () => {
		expect(parse('CSCI 121 | CSCI 125')).to.deep.equal({
			$type: 'boolean',
			$or: [
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 121,
					},
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 125,
					},
				},
			],
		})
	})

	it('parses courses seperated by & as being and-d', () => {
		expect(parse('CSCI 121 & CSCI 125')).to.deep.equal({
			$type: 'boolean',
			$and: [
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 121,
					},
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 125,
					},
				},
			],
		})
	})

	it('parses courses with no departments after an prior department', () => {
		expect(parse('CSCI 121 | 125')).to.deep.equal({
			$type: 'boolean',
			$or: [
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 121,
					},
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 125,
					},
				},
			],
		})
	})

	it('changes departments when given a new one', () => {
		expect(parse('CSCI 121 | PSCI 125')).to.deep.equal({
			$type: 'boolean',
			$or: [
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 121,
					},
				},
				{
					$type: 'course',
					$course: {
						department: ['PSCI'],
						number: 125,
					},
				},
			],
		})
	})

	it('allows several &-d courses in a row', () => {
		expect(parse('CSCI 121 & 125 & 126 & 123')).to.deep.equal({
			$type: 'boolean',
			$and: [
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 121,
					},
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 125,
					},
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 126,
					},
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 123,
					},
				},
			],
		})
	})

	it('allows several |-d courses in a row', () => {
		expect(parse('CSCI 121 | 125 | 126 | 123')).to.deep.equal({
			$type: 'boolean',
			$or: [
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 121,
					},
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 125,
					},
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 126,
					},
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 123,
					},
				},
			],
		})
	})

	it('keeps duplicates in a list of courses', () => {
		expect(parse('CSCI 121 | 121 | 125')).to.deep.equal({
			$type: 'boolean',
			$or: [
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 121,
					},
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 121,
					},
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 125,
					},
				},
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
						{
							$type: 'course',
							$course: {
								department: ['CSCI'],
								number: 121,
							},
						},
						{
							$type: 'course',
							$course: {
								department: ['CSCI'],
								number: 122,
							},
						},
					],
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 123,
					},
				},
			],
		})
	})

	it('allows a | b & c – boolean logic for courses', () => {
		expect(parse('CSCI 121 | 122 & 123')).to.deep.equal({
			$type: 'boolean',
			$or: [
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 121,
					},
				},
				{
					$type: 'boolean',
					$and: [
						{
							$type: 'course',
							$course: {
								department: ['CSCI'],
								number: 122,
							},
						},
						{
							$type: 'course',
							$course: {
								department: ['CSCI'],
								number: 123,
							},
						},
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
						{
							$type: 'course',
							$course: {
								department: ['CSCI'],
								number: 121,
							},
						},
						{
							$type: 'course',
							$course: {
								department: ['CSCI'],
								number: 122,
							},
						},
					],
				},
				{
					$type: 'course',
					$course: {
						department: ['CSCI'],
						number: 123,
					},
				},
			],
		})
	})
})
