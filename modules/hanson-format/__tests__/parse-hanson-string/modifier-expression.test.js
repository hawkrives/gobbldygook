// @flow
import {expect} from 'chai'
import {customParser, reference, qualification} from './parse-hanson-string.support'
const parse = customParser({allowedStartRules: ['Modifier']})

describe('ModifierExpression', () => {
	it('can count courses', () => {
		expect(parse('one course from children')).to.deep.equal({
			$type: 'modifier',
			$count: {$operator: '$gte', $num: 1},
			$what: 'course',
			$from: 'children',
			$children: '$all',
		})
	})

	it('can count credits', () => {
		expect(parse('one credit from children')).to.deep.equal({
			$type: 'modifier',
			$count: {$operator: '$gte', $num: 1},
			$what: 'credit',
			$from: 'children',
			$children: '$all',
		})
	})

	it('can count departments', () => {
		expect(parse('one department from children')).to.deep.equal({
			$type: 'modifier',
			$count: {$operator: '$gte', $num: 1},
			$what: 'department',
			$from: 'children',
			$children: '$all',
		})
	})

	it('will refuse to count departments from courses-where', () => {
		expect(() => parse('one department from children')).not.to.throw()
		expect(() => parse('one department from filter')).not.to.throw()
		expect(() => parse('one department from courses where {a = b}')).to.throw('cannot use a modifier with "departments"')
	})

	it('can count from children', () => {
		expect(parse('one course from children')).to.deep.equal({
			$type: 'modifier',
			$count: {$operator: '$gte', $num: 1},
			$what: 'course',
			$from: 'children',
			$children: '$all',
		})
	})

	it('can count from specified children', () => {
		expect(parse('one course from (A, B)')).to.deep.equal({
			$type: 'modifier',
			$count: {$operator: '$gte', $num: 1},
			$what: 'course',
			$from: 'children',
			$children: [reference('A'), reference('B')],
		})

		expect(parse('one course from (BTS-B, B)', {abbreviations: {'BTS-B': 'Bible'}})).to.deep.equal({
			$type: 'modifier',
			$count: {$operator: '$gte', $num: 1},
			$what: 'course',
			$from: 'children',
			$children: [reference('Bible'), reference('B')],
		})
	})

	it('can count from filter', () => {
		expect(parse('one course from filter')).to.deep.equal({
			$type: 'modifier',
			$count: {$operator: '$gte', $num: 1},
			$what: 'course',
			$from: 'filter',
		})
	})

	it('can count from filter, then apply a where-clause', () => {
		expect(parse('one course from filter where {a = b}')).to.deep.equal({
			$type: 'modifier',
			$count: {$operator: '$gte', $num: 1},
			$what: 'course',
			$from: 'filter-where',
			$where: qualification('eq', 'a', 'b'),
		})
	})

	it('can count from a where-statement', () => {
		expect(parse('one course from courses where {a = b}')).to.deep.equal({
			$type: 'modifier',
			$count: {$operator: '$gte', $num: 1},
			$what: 'course',
			$from: 'where',
			$where: qualification('eq', 'a', 'b'),
		})
	})

	it('can count from a where-statement, with the input filtered by all children', () => {
		expect(parse('one course from children where {a = b}')).to.deep.equal({
			$type: 'modifier',
			$count: {$operator: '$gte', $num: 1},
			$what: 'course',
			$from: 'children-where',
			$children: '$all',
			$where: qualification('eq', 'a', 'b'),
		})
	})

	it('can count from a where-statement, with the input filtered by some children', () => {
		expect(parse('one course from (A, B) where {a = b}')).to.deep.equal({
			$type: 'modifier',
			$count: {$operator: '$gte', $num: 1},
			$what: 'course',
			$from: 'children-where',
			$children: [
				reference('A'),
				reference('B'),
			],
			$where: qualification('eq', 'a', 'b'),
		})
	})

	it('will refuse to count anything but courses from children-where', () => {
		expect(() => parse('one department from children where {a = b}'))
			.to.throw('must use "courses from" with "children where"')

		expect(() => parse('one credit from children where {a = b}'))
			.to.throw('must use "courses from" with "children where"')

		expect(() => parse('one course from children where {a = b}')).not.to.throw()
	})
})
