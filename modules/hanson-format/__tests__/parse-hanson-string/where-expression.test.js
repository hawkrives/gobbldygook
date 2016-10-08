import {expect} from 'chai'
import {parse} from '../../parse-hanson-string'

describe('WhereExpression', () => {

})

describe('qualifications', () => {
	it('can be separated by &', () => {
		expect(() => parse('one course where {a = b & c = d}')).not.to.throw()
	})
	it('can be separated by |', () => {
		expect(() => parse('one course where {a = b | c = d}')).not.to.throw()
	})
	it('can used in boolean logic: a & b | c', () => {
		expect(() => parse('one course where {a = b & c = d | c = e}')).not.to.throw()
	})
	it('can used in boolean logic: a | b & c', () => {
		expect(() => parse('one course where {a = b | c = d & c = e}')).not.to.throw()
	})
	it('boolean logic can be overridden by parens: (a | b) & c', () => {
		expect(() => parse('four courses where { dept = THEAT & (num = 233 | num = 253) }')).not.to.throw()
	})

	it('key must be a string', () => {
		expect(() => parse('one course where {a = b}')).not.to.throw()
		expect(() => parse('one course where {1 = b}')).to.throw('Expected expression but "o" found.')
	})
	it('value may include numbers', () => {
		expect(() => parse('one course where {a = 1}')).not.to.throw()
	})
	it('may require distinct course', () => {
		expect(() => parse('two distinct courses where {a = 1}')).not.to.throw()
	})
	it('if value is an integer, it is coerced to an integer', () => {
		expect(parse('one course where {a = 1}')).to.deep.equal({
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
	it('value may include hyphens', () => {
		expect(() => parse('one course where {a = BTS-B}')).not.to.throw()
	})
	it('value may include underscores', () => {
		expect(() => parse('one course where {a = BTS_B}')).not.to.throw()
	})

	it('value may be a boolean and-list', () => {
		expect(() => parse('four courses where { dept = THEAT & (num = (233 & 253) ) }')).not.to.throw()
	})
	it('value may be a boolean or-list', () => {
		expect(() => parse('four courses where { dept = THEAT & (num = (233 | 253) ) }')).not.to.throw()
	})

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

		expect(parse('one course where { year = max (year) from courses where {gereqs=year} }')).to.deep.equal(expected)
		expect(parse('one course where { year = max(year) from courses where {gereqs=year} }')).to.deep.equal(expected)
	})

	describe('value may be compared by', () => {
		it('= (single equals)', () => {
			expect(parse('one course where {a = b}')).to
				.have.deep.property('$where.$operator', '$eq')
		})
		it('== (double equals)', () => {
			expect(parse('one course where {a == b}')).to
				.have.deep.property('$where.$operator', '$eq')
		})
		it('!= (not equal to)', () => {
			expect(parse('one course where {a != b}')).to
				.have.deep.property('$where.$operator', '$ne')
		})
		it('< (less than)', () => {
			expect(parse('one course where {a < b}')).to
				.have.deep.property('$where.$operator', '$lt')
		})
		it('<= (less than or equal to)', () => {
			expect(parse('one course where {a <= b}')).to
				.have.deep.property('$where.$operator', '$lte')
		})
		it('> (greater than)', () => {
			expect(parse('one course where {a > b}')).to
				.have.deep.property('$where.$operator', '$gt')
		})
		it('=> (greater than or equal to)', () => {
			expect(parse('one course where {a >= b}')).to
				.have.deep.property('$where.$operator', '$gte')
		})
	})
})
