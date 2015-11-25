import {expect} from 'chai'
import {computeWhere} from '../../src/area-tools/compute-chunk'

expect('computeWhere', () => {
	it('can require that the courses be distinct', () => {
		const expr = {
			$type: 'boolean',
			$count: { $operator: '$gte', $num: 2 },
			$where: {
				$type: 'qualification',
				$key: 'gereqs',
				$operator: '$eq',
				$value: 'SPM',
			},
			$distinct: false,
		}

		const shouldHaveOneCourse = [
			{department: ['ESTH'], number: 182, year: 2012, gereqs: ['SPM']},
			{department: ['ESTH'], number: 182, year: 2013, gereqs: ['SPM']},
		]


		expect(computeWhere({expr, shouldHaveOneCourse})).to.deep.equal({
			computedResult: false,
			matches: [shouldHaveOneCourse[0]],
			counted: 1,
		})

		const shouldHaveBothCourses = [
			{department: ['ESTH'], number: 182, year: 2012, gereqs: ['SPM']},
			{department: ['ESTH'], number: 187, year: 2013, gereqs: ['SPM']},
		]

		expect(computeWhere({expr, shouldHaveBothCourses})).to.deep.equal({
			computedResult: false,
			matches: shouldHaveBothCourses,
			counted: 1,
		})
	})
})
