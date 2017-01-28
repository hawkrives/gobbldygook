import { expect } from 'chai'
import getMatchesFromChildren from '../get-matches-from-children'

describe('getMatchesFromChildren', () => {
  it('extracts matches from a requirement\'s children', () => {
    const requirement = {
      result: {
        $type: 'modifier',
        $count: { $operator: '$gte', $num: 2 },
        $what: 'course',
        $from: 'children',
        $children: '$all',
      },
      Child: {
        $type: 'requirement',
        result: {
          $type: 'of',
          $count: { $operator: '$gte', $num: 2 },
          $of: [
						{ $type: 'course', department: [ 'CSCI' ], number: 121, _result: true },
            {
              $type: 'of',
              $count: { $operator: '$gte', $num: 2 },
              $of: [
								{ $type: 'course', department: [ 'ASIAN' ], number: 130, _result: true },
								{ $type: 'course', department: [ 'ASIAN' ], number: 275, _result: true },
              ],
            },
            {
              $type: 'where',
              $count: { $operator: '$gte', $num: 1 },
              $where: {
                $type: 'qualification',
                $key: 'gereqs',
                $value: { $eq: 'EIN', $type: 'operator' },
              },
              _matches: [],
            },
            {
              $type: 'occurrence',
              $count: { $operator: '$gte', $num: 2 },
              course: { $type: 'course', department: [ 'THEAT' ], number: 222 },
              _matches: [
								{ $type: 'course', department: [ 'THEAT' ], number: 222, _result: true, year: 2014 },
								{ $type: 'course', department: [ 'THEAT' ], number: 222, _result: true, year: 2015 },
              ],
            },
          ],
          _matches: [
						{ $type: 'course', department: [ 'CSCI' ], number: 121, _result: true },
						{ $type: 'course', department: [ 'ASIAN' ], number: 130, _result: true },
						{ $type: 'course', department: [ 'ASIAN' ], number: 275, _result: true },
						{ $type: 'course', department: [ 'THEAT' ], number: 222, _result: true, year: 2014 },
						{ $type: 'course', department: [ 'THEAT' ], number: 222, _result: true, year: 2015 },
          ],
        },
      },
    }

    expect(getMatchesFromChildren(requirement.result, requirement)).to.deep.equal(requirement.Child.result._matches)
  })

  it('de-duplicates matched courses', () => {
    const requirement = {
      result: {
        $type: 'modifier',
        $count: { $operator: '$gte', $num: 2 },
        $what: 'course',
        $from: 'children',
        $children: '$all',
      },
      Child: {
        $type: 'requirement',
        result: {
          $type: 'of',
          $count: { $operator: '$gte', $num: 2 },
          $of: [
						{ $type: 'course', department: [ 'CSCI' ], gereqs: [ 'AQR' ], number: 121, _result: true },
            {
              $type: 'of',
              $count: { $operator: '$gte', $num: 2 },
              $of: [
								{ $type: 'course', department: [ 'ASIAN' ], number: 130, _result: true },
								{ $type: 'course', department: [ 'ASIAN' ], number: 275, _result: true },
              ],
            },
            {
              $type: 'where',
              $count: { $operator: '$gte', $num: 1 },
              $where: {
                $type: 'qualification',
                $key: 'gereqs',
                $value: { $eq: 'AQR', $type: 'operator' },
              },
              _matches: [
								{ $type: 'course', department: [ 'CSCI' ], gereqs: [ 'AQR' ], number: 121, _result: true },
              ],
            },
            {
              $type: 'occurrence',
              $count: { $operator: '$gte', $num: 2 },
              course: { $type: 'course', department: [ 'THEAT' ], number: 222 },
              _matches: [
								{ $type: 'course', department: [ 'THEAT' ], number: 222, _result: true, year: 2014 },
								{ $type: 'course', department: [ 'THEAT' ], number: 222, _result: true, year: 2015 },
              ],
            },
          ],
          _matches: [
						{ $type: 'course', department: [ 'CSCI' ], gereqs: [ 'AQR' ], number: 121, _result: true },
						{ $type: 'course', department: [ 'CSCI' ], gereqs: [ 'AQR' ], number: 121, _result: true },
						{ $type: 'course', department: [ 'ASIAN' ], number: 130, _result: true },
						{ $type: 'course', department: [ 'ASIAN' ], number: 275, _result: true },
						{ $type: 'course', department: [ 'THEAT' ], number: 222, _result: true, year: 2014 },
						{ $type: 'course', department: [ 'THEAT' ], number: 222, _result: true, year: 2015 },
          ],
        },
      },
    }

    expect(getMatchesFromChildren(requirement.result, requirement)).to.deep.equal([
			{ $type: 'course', department: [ 'CSCI' ], gereqs: [ 'AQR' ], number: 121, _result: true },
			{ $type: 'course', department: [ 'ASIAN' ], number: 130, _result: true },
			{ $type: 'course', department: [ 'ASIAN' ], number: 275, _result: true },
			{ $type: 'course', department: [ 'THEAT' ], number: 222, _result: true, year: 2014 },
			{ $type: 'course', department: [ 'THEAT' ], number: 222, _result: true, year: 2015 },
    ])
  })
})
