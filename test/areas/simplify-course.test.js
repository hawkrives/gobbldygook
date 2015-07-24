import simplifyCourse from '../lib/simplify-course'

describe('simplifyCourse', () => {
    it('only uses department and number', () => {
        expect(simplifyCourse({department: ['CSCI'], number: 121, year: 2014}))
            .to.equal('CSCI 121')
    })

    it('joins multiple departments with a slash', () => {
        expect(simplifyCourse({department: ['AS', 'RE'], number: 121}))
            .to.equal('AS/RE 121')
    })

    it('re-sorts departments', () => {
        expect(simplifyCourse({department: ['CH', 'BI'], number: 121}))
            .to.equal('BI/CH 121')
    })
})
