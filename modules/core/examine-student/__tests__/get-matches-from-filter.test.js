import { expect } from 'chai'
import getMatchesFromFilter from '../get-matches-from-filter'

describe('getMatchesFromFilter', () => {
  it('returns the matches from the requirement\s filter property', () => {
    const requirement = {
      $type: 'requirement',
      filter: {
        $type: 'filter',
        $where: {
          $type: 'qualification',
          $key: 'department',
          $value: {
            $eq: 'CSCI',
            $type: 'operator',
          },
        },
        _matches: [
					{ department: [ 'CSCI' ], number: 320 },
					{ department: [ 'CSCI' ], number: 160 },
        ],
      },
    }

    expect(getMatchesFromFilter(requirement)).to.equal(requirement.filter._matches)
  })
})
