import {expect} from 'chai'
import {parse} from '../../src/area-tools/parse-hanson-string'

describe('parse hanson-string', () => {
	describe('course parsing', () => {
		it('parses courses with a single department', () => {
			expect(parse('CSCI 121')).to.deep.equal({
				$type: 'course',
				$course: {
					department: ['CSCI'],
					number: 121,
				},
			})
		})

		it('parses courses with a two departments', () => {
			expect(parse('AS/ES 121')).to.deep.equal({
				$type: 'course',
				$course: {
					department: ['ASIAN', 'ENVST'],
					number: 121,
				},
			})
		})

		it('parses courses with no departments as having no department', () => {
			expect(parse('121')).to.deep.equal({
				$type: 'course',
				$course: {number: 121},
			})
		})

		it('parses courses with sections', () => {
			expect(parse('CSCI 121.A')).to.deep.equal({
				$type: 'course',
				$course: {
					department: ['CSCI'],
					number: 121,
					section: 'A',
				},
			})
		})

		it('requires that sections be an uppercase letter or apostrophe', () => {
			expect(() => parse('CSCI 121.A')).not.to.throw()
			expect(() => parse('CSCI 121.*')).not.to.throw()
			expect(() => parse('CSCI 121.a')).to.throw('A course section must be either an uppercase letter [A-Z] or an asterisk [*].')
		})

		it('parses courses with years', () => {
			expect(parse('CSCI 121.A.2014')).to.deep.equal({
				$type: 'course',
				$course: {
					department: ['CSCI'],
					number: 121,
					section: 'A',
					year: 2014,
				},
			})
		})

		it('parses courses with semesters', () => {
			expect(parse('CSCI 121.A.2014.1')).to.deep.equal({
				$type: 'course',
				$course: {
					department: ['CSCI'],
					number: 121,
					section: 'A',
					year: 2014,
					semester: 1,
				},
			})
		})

		it('requires section to be present if year is', () => {
			expect(() => parse('CSCI 121.2014')).to.throw('A course section must be either an uppercase letter [A-Z] or an asterisk [*].')
		})

		it('requires section and year to be present if semester is', () => {
			expect(() => parse('CSCI 121.A.5')).to.throw('A course year must be either a four-digit year [e.g. 1994] or an asterisk [*].')
			expect(() => parse('CSCI 121.5')).to.throw('A course section must be either an uppercase letter [A-Z] or an asterisk [*].')
		})

		it('supports wildcard sections', () => {
			expect(parse('CSCI 121.*')).to.deep.equal({
				$type: 'course',
				$course: {
					department: ['CSCI'],
					number: 121,
					section: '*',
				},
			})
		})

		it('supports wildcard years', () => {
			expect(parse('CSCI 121.*.*')).to.deep.equal({
				$type: 'course',
				$course: {
					department: ['CSCI'],
					number: 121,
					section: '*',
					year: '*',
				},
			})
		})

		it('supports wildcard semesters', () => {
			expect(parse('CSCI 121.*.*.*')).to.deep.equal({
				$type: 'course',
				$course: {
					department: ['CSCI'],
					number: 121,
					section: '*',
					year: '*',
					semester: '*',
				},
			})
		})

		it('supports international courses', () => {
			expect(parse('CSCI 121I')).to.deep.equal({
				$type: 'course',
				$course: {
					department: ['CSCI'],
					number: 121,
					international: true,
				},
			})
		})

		it('supports labs', () => {
			expect(parse('CSCI 121L')).to.deep.equal({
				$type: 'course',
				$course: {
					department: ['CSCI'],
					number: 121,
					type: 'Lab',
				},
			})
		})

		it('requires the lab to be immediately after the number', () => {
			expect(() => parse('CHEM 125 L')).to.throw('Expected "&", "|" or end of input but "L" found.')
			expect(() => parse('CHEM 125IL')).to.not.throw()
			expect(() => parse('CHEM 125L')).to.not.throw()
		})

		it('supports international labs', () => {
			expect(parse('CSCI 121IL')).to.deep.equal({
				$type: 'course',
				$course: {
					department: ['CSCI'],
					number: 121,
					international: true,
					type: 'Lab',
				},
			})
		})

		it('requires international labs to be in IL order', () => {
			expect(() => parse('CSCI 121LI')).to.throw('Expected "&", "|" or end of input but "I" found.')
		})
	})

	describe('boolean parsing', () => {
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

	describe('counters', () => {
		it('n may be in english from "zero" to "ten"', () => {
			expect(() => parse('zero occurrences of AAAA 101')).to.not.throw()
			expect(() => parse('one occurrence of AAAA 101')).to.not.throw()
			expect(() => parse('two occurrences of AAAA 101')).to.not.throw()
			expect(() => parse('three occurrences of AAAA 101')).to.not.throw()
			expect(() => parse('four occurrences of AAAA 101')).to.not.throw()
			expect(() => parse('five occurrences of AAAA 101')).to.not.throw()
			expect(() => parse('six occurrences of AAAA 101')).to.not.throw()
			expect(() => parse('seven occurrences of AAAA 101')).to.not.throw()
			expect(() => parse('eight occurrences of AAAA 101')).to.not.throw()
			expect(() => parse('nine occurrences of AAAA 101')).to.not.throw()
			expect(() => parse('ten occurrences of AAAA 101')).to.not.throw()
		})
		it('may be prefixed by "at most" (≤)', () => {
			expect(parse('at most ten occurrences of AAAA 101'))
				.to.have.property('$count').deep.equal({$num: 10, $operator: '$lte'})
		})
		it('may be prefixed by "exactly" (==)', () => {
			expect(parse('exactly ten occurrences of AAAA 101'))
				.to.have.property('$count').deep.equal({$num: 10, $operator: '$eq'})
		})
		it('with no prefix are assumed to be ≥', () => {
			expect(parse('ten occurrences of AAAA 101'))
				.to.have.property('$count').deep.equal({$num: 10, $operator: '$gte'})
		})
	})

	describe('of-statements', () => {
		it('supports of statements of the form "n of ()"', () => {
			expect(() => parse('one of (CHEM 121)')).to.not.throw()
		})
		xit('allows "n" to be a number', () => {
			expect(() => parse('1 of (A, B, C)')).to.not.throw()
		})
		it('allows "n" to be a counter', () => {
			expect(() => parse('three of (A, B, C)')).to.not.throw()
		})
		it('allows "n" to be "all"', () => {
			expect(() => parse('all of (A, B, C)')).to.not.throw()
		})
		it('if n is "all", it is the number of items in the of-parens', () => {
			const result = parse('all of (A, B, C)')
			expect(result).to.have.property('$count')
			expect(result.$count).to.deep.equal({$operator: '$eq', $num: 3, $was: 'all'})
		})
		it('allows "n" to be "any"', () => {
			expect(() => parse('any of (A, B, C)')).to.not.throw()
		})
		it('allows "n" to be "none"', () => {
			expect(() => parse('none of (A, B, C)')).to.not.throw()
		})

		it('supports boolean statements within the parens', () => {
			expect(parse('one of (A | B & C, D)')).to.deep.equal({
				$type: 'of',
				$count: {$operator: '$gte', $num: 1},
				$of: [
					{
						$type: 'boolean',
						$or: [
							{
								$type: 'reference',
								$requirement: 'A',
							},
							{
								$type: 'boolean',
								$and: [
									{$type: 'reference', $requirement: 'B'},
									{$type: 'reference', $requirement: 'C'},
								],
							},
						],
					},
					{$type: 'reference', $requirement: 'D'},
				],
			})
		})
		it('supports courses within the parens', () => {
			expect(parse('one of (CSCI 121)')).to.deep.equal({
				$type: 'of',
				$count: {$operator: '$gte', $num: 1},
				$of: [
					{
						$type: 'course',
						$course: {
							department: ['CSCI'],
							number: 121,
						},
					},
				],
			})
		})
		it('supports where-clauses within the parens', () => {
			expect(parse('one of (CSSCI 121, one course where {gereqs = WRI})')).to
				.have.property('$of').and.length(2)
		})
		it('supports occurrences within the parens', () => {
			expect(parse('one of (two occurrences of CSCI 121, CSCI 308)')).to
				.have.property('$of').and.length(2)
		})
		it('supports references within the parens', () => {
			expect(parse('one of (A, B, C, D)')).to
				.have.property('$of').and.length(4)
		})
		it('supports modifiers within the parens', () => {
			expect(parse('one of (two courses from children, two courses from filter, two credits from courses where {year <= 2016})')).to
				.have.property('$of').and.length(3)
		})

		xit('requires that items be seperated by commas', () => {})
		it('supports trailing commas', () => {
			expect(parse('one of (121,)')).to.deep.equal({
				$type: 'of',
				$count: {$operator: '$gte', $num: 1},
				$of: [
					{$type: 'course', $course: {number: 121}},
				],
			})
		})

		it('throws an error if more items are required than are provided', () => {
			expect(() => parse('three of (CSCI 121, 125)')).to.throw('you requested 3 items, but only gave 2 options ([{"$type":"course","$course":{"department":["CSCI"],"number":121}},{"$type":"course","$course":{"department":["CSCI"],"number":125}}])')
		})
	})
	describe('where-statements', () => {
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
	})
	describe('occurrences', () => {
		it('requires a course to check for occurrences of', () => {
			expect(parse('one occurrence of CSCI 121')).to.deep.equal({
				$type: 'occurrence',
				$count: {$operator: '$gte', $num: 1},
				$course: {
					department: [
						'CSCI',
					],
					number: 121,
				},
			})
		})
	})
	describe('references', () => {
		it('can reference a requirement', () => {
			expect(parse('BTS-B')).to.deep.equal({
				$type: 'reference',
				$requirement: 'BTS-B',
			})
		})
		it('handles a full requirement title', () => {
			expect(parse('Biblical Studies (BTS-B)')).to
				.have.property('$requirement', 'Biblical Studies (BTS-B)')
		})
		it('returns a full requirement title when given an abbreviation', () => {
			expect(parse('BTS-B', {abbreviations: {'BTS-B': 'Biblical Studies (BTS-B)'}})).to
				.have.property('$requirement', 'Biblical Studies (BTS-B)')
		})
		it('returns a full requirement title when given the title-minus-abbreviation', () => {
			expect(parse('Biblical Studies', {titles: {'Biblical Studies': 'Biblical Studies (BTS-B)'}})).to
				.have.property('$requirement', 'Biblical Studies (BTS-B)')
		})
		describe('titles may include', () => {
			it('letters "A-Z"', () => {
				expect(() => parse('ABC')).not.to.throw()
				expect(() => parse('A')).not.to.throw()
			})
			it('numbers "0-9"', () => {
				expect(() => parse('A0')).not.to.throw()
				expect(() => parse('0')).not.to.throw()
				expect(() => parse('0A')).not.to.throw()
			})
			it('hyphen "-"', () => {
				expect(() => parse('ABC-D')).not.to.throw()
			})
			it('underscore "_"', () => {
				expect(() => parse('ABC_D')).not.to.throw()
			})
			it('parentheses "()"', () => {
				expect(() => parse('A0 (B)')).not.to.throw()
				expect(() => parse('A0 (B-B)')).not.to.throw()
			})
			it('may only begin with a letter or number', () => {
				expect(() => parse('0A')).not.to.throw()
				expect(() => parse('A0')).not.to.throw()
				expect(() => parse('_A0')).to.throw('Expected expression but "_" found.')
				expect(() => parse('-A0')).to.throw('Expected expression but "-" found.')
				expect(parse('(A0)')).to.have.property('$type', 'reference')
			})
		})
	})
	describe('modifiers', () => {
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
			expect(() => parse('one department from courses where {a = b}')).to.throw('cannot use a modifier with "departments from courses where {}"')
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
				$children: [{$requirement: 'A', $type: 'reference'}, {$requirement: 'B', $type: 'reference'}],
			})

			expect(parse('one course from (BTS-B, B)', {abbreviations: {'BTS-B': 'Bible'}})).to.deep.equal({
				$type: 'modifier',
				$count: {$operator: '$gte', $num: 1},
				$what: 'course',
				$from: 'children',
				$children: [{$requirement: 'Bible', $type: 'reference'}, {$requirement: 'B', $type: 'reference'}],
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
				$where: {
					$key: 'a',
					$operator: '$eq',
					$type: 'qualification',
					$value: 'b',
				},
			})
		})
		it('can count from a where-statement', () => {
			expect(parse('one course from courses where {a = b}')).to.deep.equal({
				$type: 'modifier',
				$count: {$operator: '$gte', $num: 1},
				$what: 'course',
				$from: 'where',
				$where: {
					$type: 'qualification',
					$key: 'a',
					$operator: '$eq',
					$value: 'b',
				},
			})
		})
		it('can count from a where-statement, with the input filtered by all children', () => {
			expect(parse('one course from children where {a = b}')).to.deep.equal({
				$type: 'modifier',
				$count: {$operator: '$gte', $num: 1},
				$what: 'course',
				$from: 'children-where',
				$children: '$all',
				$where: {
					$type: 'qualification',
					$key: 'a',
					$operator: '$eq',
					$value: 'b',
				},
			})
		})
		it('can count from a where-statement, with the input filtered by some children', () => {
			expect(parse('one course from (A, B) where {a = b}')).to.deep.equal({
				$type: 'modifier',
				$count: {$operator: '$gte', $num: 1},
				$what: 'course',
				$from: 'children-where',
				$children: [
					{$requirement: 'A', $type: 'reference'},
					{$requirement: 'B', $type: 'reference'},
				],
				$where: {
					$type: 'qualification',
					$key: 'a',
					$operator: '$eq',
					$value: 'b',
				},
			})
		})
		it('will refuse to count anything but courses from children-where', () => {
			expect(() => parse('one department from children where {a = b}')).to.throw('must use "courses from" with "children where"')
			expect(() => parse('one credit from children where {a = b}')).to.throw('must use "courses from" with "children where"')
			expect(() => parse('one course from children where {a = b}')).not.to.throw()
		})
	})
})
