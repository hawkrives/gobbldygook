import applyFilter from '../apply-filter'

describe('applyFilter', () => {
	it('filters a list of courses', () => {
		const query = {
			$type: 'filter',
			$filterType: 'where',
			$where: {
				$type: 'qualification',
				$key: 'number',
				$value: 121,
				$operator: '$eq',
			},
		}

		const courses = [
			{ department: ['ASIAN'], number: 100 },
			{ department: ['CSCI'], number: 121 },
			{ department: ['CHEM', 'BIO'], number: 111 },
			{ department: ['CHEM', 'BIO'], number: 112 },
			{ department: ['ART', 'ASIAN'], number: 121 },
		]

		expect(applyFilter(query, courses)).toMatchSnapshot()
	})

	it('filters by where-style queries', () => {
		const query = {
			$type: 'filter',
			$filterType: 'where',
			$where: {
				$type: 'qualification',
				$key: 'number',
				$value: 121,
				$operator: '$eq',
			},
		}

		const courses = [
			{ department: ['ASIAN'], number: 100 },
			{ department: ['CSCI'], number: 121 },
			{ department: ['CHEM', 'BIO'], number: 111 },
			{ department: ['CHEM', 'BIO'], number: 112 },
			{ department: ['ART', 'ASIAN'], number: 121 },
		]

		expect(applyFilter(query, courses)).toMatchSnapshot()
	})

	it('filters by list-of-valid-courses queries', () => {
		const query = {
			$type: 'filter',
			$filterType: 'of',
			$of: [
				{ $type: 'course', department: ['CSCI'], number: 121 },
				{ $type: 'course', department: ['CSCI'], number: 125 },
			],
		}

		const courses = [
			{ department: ['ASIAN'], number: 100 },
			{ department: ['CSCI'], number: 121 },
			{ department: ['CHEM', 'BIO'], number: 111 },
			{ department: ['CHEM', 'BIO'], number: 112 },
			{ department: ['ART', 'ASIAN'], number: 121 },
		]

		expect(applyFilter(query, courses)).toMatchSnapshot()
	})

	it('returns the matches on the expression', () => {
		const query = {
			$type: 'filter',
			$filterType: 'where',
			$where: {
				$type: 'qualification',
				$key: 'number',
				$value: 121,
				$operator: '$eq',
			},
		}

		const courses = [
			{ department: ['ASIAN'], number: 100 },
			{ department: ['CSCI'], number: 121 },
			{ department: ['CHEM', 'BIO'], number: 111 },
			{ department: ['CHEM', 'BIO'], number: 112 },
			{ department: ['ART', 'ASIAN'], number: 121 },
		]

		const result = applyFilter(query, courses)

		expect(result).toMatchSnapshot()
		expect(query._matches).toMatchSnapshot()
	})

	it('returns an empty list when not presented with a filter', () => {
		const query = {}

		const courses = [
			{ department: ['ASIAN'], number: 100 },
			{ department: ['CSCI'], number: 121 },
			{ department: ['CHEM', 'BIO'], number: 111 },
			{ department: ['CHEM', 'BIO'], number: 112 },
			{ department: ['ART', 'ASIAN'], number: 121 },
		]

		expect(applyFilter(query, courses)).toMatchSnapshot()
	})
})
