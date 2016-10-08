import {expect} from 'chai'
import {customParser} from './support'
const parseWhere = customParser({allowedStartRules: ['Where']})
const parseQualifier = customParser({allowedStartRules: ['Qualifier']})
const parseQualificationValue = customParser({allowedStartRules: ['Where']})

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
		expect(parseQualifier('{a = b}')).to.deep.equal({
			$key: 'a',
			$operator: '$eq',
			$type: 'qualification',
			$value: 'b',
		})
	})
	it('value may include numbers', () => {
		expect(() => parseQualifier('{a = 1}')).not.to.throw()
	})
	it('if value is an integer, it is coerced to an integer', () => {
		expect(parseQualifier('{a = 1}')).to.deep.equal({
			$key: 'a',
			$operator: '$eq',
			$type: 'qualification',
			$value: 1,
		})
	})
	it('value may include hyphens', () => {
		expect(() => parseQualifier('{a = BTS-B}')).not.to.throw()
	})
	it('value may include underscores', () => {
		expect(() => parseQualifier('{a = BTS_B}')).not.to.throw()
	})
})

describe('qualification value may be compared by', () => {
	it('= (single equals)', () => {
		expect(parseQualifier('{a = b}')).to
			.have.property('$operator', '$eq')
	})
	it('== (double equals)', () => {
		expect(parseQualifier('{a == b}')).to
			.have.property('$operator', '$eq')
	})
	it('!= (not equal to)', () => {
		expect(parseQualifier('{a != b}')).to
			.have.property('$operator', '$ne')
	})
	it('< (less than)', () => {
		expect(parseQualifier('{a < b}')).to
			.have.property('$operator', '$lt')
	})
	it('<= (less than or equal to)', () => {
		expect(parseQualifier('{a <= b}')).to
			.have.property('$operator', '$lte')
	})
	it('> (greater than)', () => {
		expect(parseQualifier('{a > b}')).to
			.have.property('$operator', '$gt')
	})
	it('=> (greater than or equal to)', () => {
		expect(parseQualifier('{a >= b}')).to
			.have.property('$operator', '$gte')
	})
})

describe('qualifiers can use boolean logic', () => {
	it('can be separated by &', () => {
		expect(() => parseQualifier('{a = b & c = d}')).not.to.throw()
	})
	it('can be separated by |', () => {
		expect(() => parseQualifier('{a = b | c = d}')).not.to.throw()
	})
	it('can used in boolean logic: a & b | c', () => {
		expect(() => parseQualifier('{a = b & c = d | c = e}')).not.to.throw()
	})
	it('can used in boolean logic: a | b & c', () => {
		expect(() => parseQualifier('{a = b | c = d & c = e}')).not.to.throw()
	})
	it('boolean logic can be overridden by parens: (a | b) & c', () => {
		expect(() => parseQualifier('{ dept = THEAT & (num = 233 | num = 253) }')).not.to.throw()
	})


	it('value may be a boolean and-list', () => {
		expect(() => parseWhere('four courses where { dept = THEAT & (num = (233 & 253) ) }')).not.to.throw()
	})
	it('value may be a boolean or-list', () => {
		expect(() => parseWhere('four courses where { dept = THEAT & (num = (233 | 253) ) }')).not.to.throw()
	})
})

describe('nested qualifiers', () => {
	xit('value may rely on a nested qualifier', () => {})

	it('function may optionally include a space between the name and the paren', () => {
		const expected = {
			$type: 'where',
			$count: {$operator: '$gte', $num: 1},
			$where: {
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
			},
			$distinct: false,
		}

		expect(parseWhere('one course where { year = max (year) from courses where {gereqs=year} }')).to.deep.equal(expected)
		expect(parseWhere('one course where { year = max(year) from courses where {gereqs=year} }')).to.deep.equal(expected)
	})
})
