import { customParser } from './parse-hanson-string.support'
const parse = customParser({ allowedStartRules: [ 'Course' ] })

describe('CourseExpression', () => {
	it('parses courses with a single department', () => {
		expect(parse('CSCI 121')).toEqual({
			$type: 'course',
			$course: {
				department: [ 'CSCI' ],
				number: 121,
			},
		})
	})

	it('parses courses with a two departments', () => {
		expect(parse('AS/ES 121')).toEqual({
			$type: 'course',
			$course: {
				department: [ 'AS', 'ES' ],
				number: 121,
			},
		})
	})

	it('parses courses with no departments as having no department', () => {
		expect(parse('121')).toEqual({
			$type: 'course',
			$course: { number: 121 },
		})
	})

	it('parses courses with sections', () => {
		expect(parse('CSCI 121.A')).toEqual({
			$type: 'course',
			$course: {
				department: [ 'CSCI' ],
				number: 121,
				section: 'A',
			},
		})
	})

	it('requires that sections be an uppercase letter or apostrophe', () => {
		expect(() => parse('CSCI 121.A')).not.toThrow()
		expect(() => parse('CSCI 121.*')).not.toThrow()
		expect(() => parse('CSCI 121.a')).toThrowError('A course section must be either an uppercase letter [A-Z] or an asterisk [*].')
	})

	it('parses courses with years', () => {
		expect(parse('CSCI 121.A.2014')).toEqual({
			$type: 'course',
			$course: {
				department: [ 'CSCI' ],
				number: 121,
				section: 'A',
				year: 2014,
			},
		})
	})

	it('parses courses with semesters', () => {
		expect(parse('CSCI 121.A.2014.1')).toEqual({
			$type: 'course',
			$course: {
				department: [ 'CSCI' ],
				number: 121,
				section: 'A',
				year: 2014,
				semester: 1,
			},
		})
	})

	it('requires section to be present if year is', () => {
		expect(() => parse('CSCI 121.2014')).toThrowError('A course section must be either an uppercase letter [A-Z] or an asterisk [*].')
	})

	it('requires section and year to be present if semester is', () => {
		expect(() => parse('CSCI 121.A.5')).toThrowError('A course year must be either a four-digit year [e.g. 1994] or an asterisk [*].')
		expect(() => parse('CSCI 121.5')).toThrowError('A course section must be either an uppercase letter [A-Z] or an asterisk [*].')
	})

	it('supports wildcard sections', () => {
		expect(parse('CSCI 121.*')).toEqual({
			$type: 'course',
			$course: {
				department: [ 'CSCI' ],
				number: 121,
				section: '*',
			},
		})
	})

	it('supports wildcard years', () => {
		expect(parse('CSCI 121.*.*')).toEqual({
			$type: 'course',
			$course: {
				department: [ 'CSCI' ],
				number: 121,
				section: '*',
				year: '*',
			},
		})
	})

	it('supports wildcard semesters', () => {
		expect(parse('CSCI 121.*.*.*')).toEqual({
			$type: 'course',
			$course: {
				department: [ 'CSCI' ],
				number: 121,
				section: '*',
				year: '*',
				semester: '*',
			},
		})
	})

	it('supports international courses', () => {
		expect(parse('CSCI 121I')).toEqual({
			$type: 'course',
			$course: {
				department: [ 'CSCI' ],
				number: 121,
				international: true,
			},
		})
	})

	it('supports labs', () => {
		expect(parse('CSCI 121L')).toEqual({
			$type: 'course',
			$course: {
				department: [ 'CSCI' ],
				number: 121,
				type: 'Lab',
			},
		})
	})

	it('requires the lab to be immediately after the number', () => {
		expect(() => parse('CHEM 125 L')).toThrowError('Expected "." or end of input but " " found.')
		expect(() => parse('CHEM 125IL')).not.toThrow()
		expect(() => parse('CHEM 125L')).not.toThrow()
	})

	it('supports international labs', () => {
		expect(parse('CSCI 121IL')).toEqual({
			$type: 'course',
			$course: {
				department: [ 'CSCI' ],
				number: 121,
				international: true,
				type: 'Lab',
			},
		})
	})

	it('requires international labs to be in IL order', () => {
		expect(() => parse('CSCI 121LI')).toThrowError('Expected "." or end of input but "I" found.')
	})
})
