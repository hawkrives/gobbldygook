// @flow
import {expect} from 'chai'
import {filterByQualification} from '../filter-by-where-clause'

describe('filterByQualification', () => {
	it('filters an array of courses by a qualification', () => {
		const basicQualification = {
			$type: 'qualification',
			$key: 'gereqs',
			$value: 'EIN',
			$operator: '$eq',
		}

		const courses = [
			{department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
			{department: ['ASIAN'], number: 275, year: 2016},
			{department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
			{department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
			{department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
		]

		expect(filterByQualification(courses, basicQualification)).to.deep.equal([
			{department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
		])
	})

	it('filters an array of courses by a boolean qualification-value', () => {
		const basicQualification = {
			$type: 'qualification',
			$key: 'gereqs',
			$value: {$type: 'boolean', $or: ['EIN', 'BTS-T']},
			$operator: '$eq',
		}

		const courses = [
			{department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
			{department: ['ASIAN'], number: 275, year: 2016},
			{department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
			{department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
			{department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
		]

		expect(filterByQualification(courses, basicQualification)).to.deep.equal([
			{department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
			{department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
			{department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
		])
	})

	it('requires that a boolean qualification-value be either $and or $or', () => {
		const basicQualification = {
			$type: 'qualification',
			$key: 'gereqs',
			$value: {$type: 'boolean', $xor: ['EIN', 'BTS-T']},
			$operator: '$eq',
		}

		const courses = [
			{department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
			{department: ['ASIAN'], number: 275, year: 2016},
			{department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
			{department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
			{department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
		]

		expect(() => filterByQualification(courses, basicQualification)).to.throw(TypeError)
	})

	it('filters an array based on a nested where-query with the max function', () => {
		const advancedQualificationMax = {
			$type: 'qualification',
			$key: 'year',
			$operator: '$lte',
			$value: {
				$name: 'max',
				$prop: 'year',
				$type: 'function',
				$where: {
					$type: 'qualification',
					$key: 'gereqs',
					$operator: '$eq',
					$value: 'BTS-T',
				},
			},
		}

		const courses = [
			{department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
			{department: ['ASIAN'], number: 275, year: 2016},
			{department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
			{department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
			{department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
		]

		expect(filterByQualification(courses, advancedQualificationMax)).to.deep.equal([
			{department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
			{department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
			{department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
			{department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
		])
	})

	it('filters an array based on a nested where-query with the min function', () => {
		const advancedQualificationMin = {
			$type: 'qualification',
			$key: 'year',
			$operator: '$lte',
			$value: {
				$name: 'min',
				$prop: 'year',
				$type: 'function',
				$where: {
					$type: 'qualification',
					$key: 'gereqs',
					$operator: '$eq',
					$value: 'BTS-T',
				},
			},
		}

		const courses = [
			{department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
			{department: ['ASIAN'], number: 275, year: 2016},
			{department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
			{department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
			{department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
		]

		expect(filterByQualification(courses, advancedQualificationMin)).to.deep.equal([
			{department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
			{department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
		])
	})

	it('must use either min or max as a function for a nested where-query', () => {
		const advancedQualificationBad = {
			$type: 'qualification',
			$key: 'year',
			$operator: '$lte',
			$value: {
				$name: 'not-max-nor-min',
				$prop: 'year',
				$type: 'function',
				$where: {
					$type: 'qualification',
					$key: 'gereqs',
					$operator: '$eq',
					$value: 'BTS-T',
				},
			},
		}

		const courses = [
			{department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
			{department: ['ASIAN'], number: 275, year: 2016},
			{department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
			{department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
			{department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
		]

		expect(() => filterByQualification(courses, advancedQualificationBad))
			.to.throw(ReferenceError)
	})

	it('must specify a function when utilizing a nested where-query', () => {
		const advancedQualificationBad = {
			$type: 'qualification',
			$key: 'year',
			$operator: '$lte',
			$value: {
				$name: 'max',
				$prop: 'year',
				$type: '',
				$where: {
					$type: 'qualification',
					$key: 'gereqs',
					$operator: '$eq',
					$value: 'BTS-T',
				},
			},
		}

		const courses = [
			{department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
			{department: ['ASIAN'], number: 275, year: 2016},
			{department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
			{department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
			{department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
		]

		expect(() => filterByQualification(courses, advancedQualificationBad))
			.to.throw(TypeError)
	})

	it('can require that the courses be distinct', () => {
		const clause = {
			$type: 'qualification',
			$key: 'gereqs',
			$operator: '$eq',
			$value: 'SPM',
		}

		const courses = [
			{department: ['ESTH'], number: 182, year: 2012, gereqs: ['SPM']},
			{department: ['ESTH'], number: 182, year: 2013, gereqs: ['SPM']},
		]

		const expected = [courses[0]]
		const actual = filterByQualification(courses, clause, {distinct: true})

		expect(actual).to.deep.equal(expected)
	})

	it('does not count things that don\'t count when matching "distinct"', () => {
		const clause = {
			$type: 'qualification',
			$key: 'gereqs',
			$operator: '$eq',
			$value: 'SPM',
		}

		const courses = [
			{department: ['ESTH'], number: 182, year: 2012, gereqs: ['FYW']},
			{department: ['ESTH'], number: 182, year: 2013, gereqs: ['SPM']},
		]

		const expected = [courses[1]]
		const actual = filterByQualification(courses, clause, {distinct: true})

		expect(actual).to.deep.equal(expected)
	})
})
