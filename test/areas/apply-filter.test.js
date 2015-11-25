import {expect} from 'chai'
import applyFilter from '../../src/area-tools/apply-filter'

describe('applyFilter', () => {
	it('filters a list of courses', () => {
		const query = {
			$type: 'filter',
			$where: {
				$type: 'qualification',
				$key: 'number',
				$value: 121,
				$operator: '$eq',
			},
		}

		const courses = [
			{department: ['ASIAN'], number: 100},
			{department: ['CSCI'], number: 121},
			{department: ['CHEM', 'BIO'], number: 111},
			{department: ['CHEM', 'BIO'], number: 112},
			{department: ['ART', 'ASIAN'], number: 121},
		]

		expect(applyFilter(query, courses))
			.to.deep.equal([
				{department: ['CSCI'], number: 121},
				{department: ['ART', 'ASIAN'], number: 121},
			])
	})

	it('filters by where-style queries', () => {
		const query = {
			$type: 'filter',
			$where: {
				$type: 'qualification',
				$key: 'number',
				$value: 121,
				$operator: '$eq',
			},
		}

		const courses = [
			{department: ['ASIAN'], number: 100},
			{department: ['CSCI'], number: 121},
			{department: ['CHEM', 'BIO'], number: 111},
			{department: ['CHEM', 'BIO'], number: 112},
			{department: ['ART', 'ASIAN'], number: 121},
		]

		expect(applyFilter(query, courses))
			.to.deep.equal([
				{department: ['CSCI'], number: 121},
				{department: ['ART', 'ASIAN'], number: 121},
			])
	})

	it('filters by list-of-valid-courses queries', () => {
		const query = {
			$type: 'filter',
			$of: [
				{$type: 'course', department: ['CSCI'], number: 121},
				{$type: 'course', department: ['CSCI'], number: 125},
			],
		}

		const courses = [
			{department: ['ASIAN'], number: 100},
			{department: ['CSCI'], number: 121},
			{department: ['CHEM', 'BIO'], number: 111},
			{department: ['CHEM', 'BIO'], number: 112},
			{department: ['ART', 'ASIAN'], number: 121},
		]

		expect(applyFilter(query, courses))
			.to.deep.equal([
				{$type: 'course', department: ['CSCI'], number: 121},
			])
	})

	it('returns the matches on the expression', () => {
		const query = {
			$type: 'filter',
			$where: {
				$type: 'qualification',
				$key: 'number',
				$value: 121,
				$operator: '$eq',
			},
		}

		const courses = [
			{department: ['ASIAN'], number: 100},
			{department: ['CSCI'], number: 121},
			{department: ['CHEM', 'BIO'], number: 111},
			{department: ['CHEM', 'BIO'], number: 112},
			{department: ['ART', 'ASIAN'], number: 121},
		]

		const expectedMatches = [
			{department: ['CSCI'], number: 121},
			{department: ['ART', 'ASIAN'], number: 121},
		]

		const result = applyFilter(query, courses)

		expect(result)
			.to.deep.equal(expectedMatches)

		expect(query)
			.to.have.property('_matches')
			.that.deep.equals(expectedMatches)
	})

	it('returns an empty list when not presented with a filter', () => {
		const query = {}

		const courses = [
			{department: ['ASIAN'], number: 100},
			{department: ['CSCI'], number: 121},
			{department: ['CHEM', 'BIO'], number: 111},
			{department: ['CHEM', 'BIO'], number: 112},
			{department: ['ART', 'ASIAN'], number: 121},
		]

		expect(applyFilter(query, courses))
			.to.deep.equal([])
	})
})
