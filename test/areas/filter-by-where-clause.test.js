import filterByWhereClause from '../lib/filter-by-where-clause'

describe('filterByWhereClause', () => {
    it('filters an array of courses by a where-clause', () => {
        const clause = {
            $type: 'qualification',
            $key: 'gereqs',
            $operator: '$eq',
            $value: 'EIN',
        }

        const courses = [
            {department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {department: ['ASIAN'], number: 155, gereqs: ['EIN'], year: 2016},
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2015},
            {department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
            {department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2015},
        ]

        expect(filterByWhereClause(courses, clause)).to.deep.equal([
            {department: ['ASIAN'], number: 155, gereqs: ['EIN'], year: 2016},
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2015},
        ])
    })

    it('throws if confronted with an unknown type', () => {
        const clause = {$type: 'bad'}

        expect(() => filterByWhereClause([], clause)).to.throw(TypeError)
    })

    it('filters an array of courses by an and-joined where-clause', () => {
        const clause = {
            $type: 'boolean',
            $and: [
                {
                    $type: 'qualification',
                    $key: 'gereqs',
                    $operator: '$eq',
                    $value: 'EIN',
                },
                {
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
                },
            ],
        }

        const courses = [
            {department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {department: ['ASIAN'], number: 155, gereqs: ['EIN'], year: 2016},
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2015},
            {department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
            {department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2015},
        ]

        expect(filterByWhereClause(courses, clause)).to.deep.equal([
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2015},
        ])
    })

    it('filters an array of courses by an or-joined where-clause', () => {
        const clause = {
            $type: 'boolean',
            $or: [
                { $type: 'qualification', $key: 'gereqs', $operator: '$eq', $value: 'EIN' },
                { $type: 'qualification', $key: 'year', $operator: '$eq', $value: 2012 },
            ],
        }

        const courses = [
            {department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {department: ['ASIAN'], number: 155, gereqs: ['EIN'], year: 2016},
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2015},
            {department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
            {department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2015},
        ]

        expect(filterByWhereClause(courses, clause)).to.deep.equal([
            {department: ['ASIAN'], number: 155, gereqs: ['EIN'], year: 2016},
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2015},
            {department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
        ])
    })

    it('must filter by either "and" or "or"', () => {
        const clause = {
            $type: 'boolean',
            $xor: [],
        }

        const courses = [
            {department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
        ]

        expect(() => filterByWhereClause(courses, clause)).to.throw(ReferenceError)
    })
})
