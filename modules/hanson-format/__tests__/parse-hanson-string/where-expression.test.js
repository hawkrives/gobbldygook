import {expect} from 'chai'
import {customParser, qualification, boolean} from './parse-hanson-string.support'
const parseWhere = customParser({allowedStartRules: ['Where']})
const parseQualifier = customParser({allowedStartRules: ['Qualifier']})

describe('WhereExpression', () => {
	it('describes courses "where" a fact is true', () => {
		expect(parseWhere('one course where {a = 1}')).to.deep.equal({
			$count: {$num: 1, $operator: '$gte'},
			$type: 'where',
			$where: {
				$key: 'a',
				$operator: '$eq',
				$type: 'qualification',
				$value: 1,
			},
			$distinct: false,
		})
	})

	it('may require distinct course', () => {
		expect(parseWhere('two distinct courses where {a = 1}')).to.deep.equal({
			$count: {$num: 2, $operator: '$gte'},
			$type: 'where',
			$where: {
				$key: 'a',
				$operator: '$eq',
				$type: 'qualification',
				$value: 1,
			},
			$distinct: true,
		})
	})
})

describe('qualifiers syntax', () => {
	it('key must be a string', () => {
		expect(() => parseQualifier('{a = b}')).not.to.throw()
		expect(() => parseQualifier('{1 = b}')).to.throw('SyntaxError: Expected qualification-or but "1" found.')
	})

	it('value may be a number (coerced to integers)', () => {
		expect(parseQualifier('{a = 1}')).to.deep.equal({
			$key: 'a',
			$operator: '$eq',
			$type: 'qualification',
			$value: 1,
		})
	})

	it('value may include hyphens', () => {
		expect(parseQualifier('{a = BTS-B}')).to.deep.equal({
			$key: 'a',
			$operator: '$eq',
			$type: 'qualification',
			$value: 'BTS-B',
		})
	})

	it('value may include underscores', () => {
		expect(parseQualifier('{a = BTS_B}')).to.deep.equal({
			$key: 'a',
			$operator: '$eq',
			$type: 'qualification',
			$value: 'BTS_B',
		})
	})
})

describe('qualification value may be compared by', () => {
	it('= (single equals)', () => {
		expect(parseQualifier('{a = b}')).to.deep.equal(qualification('eq', 'a', 'b'))
	})

	it('== (double equals)', () => {
		expect(parseQualifier('{a == b}')).to.deep.equal(qualification('eq', 'a', 'b'))
	})

	it('!= (not equal to)', () => {
		expect(parseQualifier('{a != b}')).to.deep.equal(qualification('ne', 'a', 'b'))
	})

	it('< (less than)', () => {
		expect(parseQualifier('{a < b}')).to.deep.equal(qualification('lt', 'a', 'b'))
	})

	it('<= (less than or equal to)', () => {
		expect(parseQualifier('{a <= b}')).to.deep.equal(qualification('lte', 'a', 'b'))
	})

	it('> (greater than)', () => {
		expect(parseQualifier('{a > b}')).to.deep.equal(qualification('gt', 'a', 'b'))
	})

	it('=> (greater than or equal to)', () => {
		expect(parseQualifier('{a >= b}')).to.deep.equal(qualification('gte', 'a', 'b'))
	})
})

describe('qualifiers can use boolean logic', () => {
	it('can be separated by &', () => {
		expect(parseQualifier('{a = b & c = d}')).to.deep.equal(boolean('and', [
			qualification('eq', 'a', 'b'),
			qualification('eq', 'c', 'd'),
		]))
	})
	it('can be separated by |', () => {
		expect(parseQualifier('{a = b | c = d}')).to.deep.equal(boolean('or', [
			qualification('eq', 'a', 'b'),
			qualification('eq', 'c', 'd'),
		]))
	})
	it('can used in boolean logic: a & b | c', () => {
		expect(parseQualifier('{a = b & c = d | c = e}')).to.deep.equal(boolean('or', [
			boolean('and', [
				qualification('eq', 'a', 'b'),
				qualification('eq', 'c', 'd'),
			]),
			qualification('eq', 'c', 'e'),
		]))
	})
	it('can used in boolean logic: a | b & c', () => {
		expect(parseQualifier('{a = b | c = d & c = e}')).to.deep.equal(boolean('or', [
			qualification('eq', 'a', 'b'),
			boolean('and', [
				qualification('eq', 'c', 'd'),
				qualification('eq', 'c', 'e'),
			]),
		]))
	})
	it('boolean logic can be overridden by parens: (a | b) & c', () => {
		expect(parseQualifier('{ dept = THEAT & (num = 233 | num = 253) }')).to.deep.equal(boolean('and', [
			qualification('eq', 'dept', 'THEAT'),
			boolean('or', [
				qualification('eq', 'num', 233),
				qualification('eq', 'num', 253),
			]),
		]))
	})


	it('value may be a boolean and-list', () => {
		expect(parseQualifier('{ dept = THEAT & (num = (233 & 253) ) }')).to.deep.equal(boolean('and', [
			qualification('eq', 'dept', 'THEAT'),
			qualification('eq', 'num', boolean('and', [233, 253])),
		]))
	})
	it('value may be a boolean or-list', () => {
		expect(parseQualifier('{ dept = THEAT & (num = (233 | 253) ) }')).to.deep.equal(boolean('and', [
			qualification('eq', 'dept', 'THEAT'),
			qualification('eq', 'num', boolean('or', [233, 253])),
		]))
	})
})

describe('nested qualifiers', () => {
	xit('value may rely on a nested qualifier', () => {})

	it('function may optionally include a space between the name and the paren', () => {
		const expected = {
			$type: 'qualification',
			$key: 'year',
			$operator: '$eq',
			$value: {
				$name: 'max',
				$prop: 'year',
				$type: 'function',
				$where: {
					$type: 'qualification',
					$key: 'gereqs',
					$operator: '$eq',
					$value: 'year',
				},
			},
		}

		expect(parseQualifier('{ year = max (year) from courses where {gereqs=year} }')).to.deep.equal(expected)
		expect(parseQualifier('{ year = max(year) from courses where {gereqs=year} }')).to.deep.equal(expected)
	})
})
