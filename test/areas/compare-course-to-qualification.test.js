import compareCourseToQualification from '../lib/compare-course-to-qualification'

describe('compareCourseToQualification', () => {
    it('compares a course property against an operator', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseToQualification(course, {$key: 'number', $operator: '$eq', $value: 310})).to.be.true
    })

    it('supports $eq', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseToQualification(course, {$key: 'number', $operator: '$eq', $value: 310})).to.be.true
    })

    it('supports $ne', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseToQualification(course, {$key: 'number', $operator: '$ne', $value: 210})).to.be.true
        expect(compareCourseToQualification(course, {$key: 'number', $operator: '$ne', $value: 310})).to.be.false
    })

    it('supports $lt', () => {
        const course = {department: ['ART'], number: 200}
        expect(compareCourseToQualification(course, {$key: 'number', $operator: '$lt', $value: 300})).to.be.true
        expect(compareCourseToQualification(course, {$key: 'number', $operator: '$lt', $value: 100})).to.be.false
    })

    it('supports $lte', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseToQualification(course, {$key: 'number', $operator: '$lte', $value: 310})).to.be.true
        expect(compareCourseToQualification(course, {$key: 'number', $operator: '$lte', $value: 200})).to.be.false
    })

    it('supports $gt', () => {
        const course = {department: ['ART'], number: 300}
        expect(compareCourseToQualification(course, {$key: 'number', $operator: '$gt', $value: 200})).to.be.true
        expect(compareCourseToQualification(course, {$key: 'number', $operator: '$gt', $value: 400})).to.be.false
    })

    it('supports $gte', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseToQualification(course, {$key: 'number', $operator: '$gte', $value: 310})).to.be.true
        expect(compareCourseToQualification(course, {$key: 'number', $operator: '$gte', $value: 400})).to.be.false
    })

    it('compares checks for items within arrays', () => {
        const course = {department: ['ART', 'ASIAN'], number: 310}
        expect(compareCourseToQualification(course, {$key: 'department', $operator: '$eq', $value: 'ART'})).to.be.true
        expect(compareCourseToQualification(course, {$key: 'department', $operator: '$eq', $value: 'ASIAN'})).to.be.true
    })

    it('$ne checks if an item does not exist within an array?', () => {
        const course = {department: ['ART', 'ASIAN'], number: 310}
        expect(compareCourseToQualification(course, {$key: 'department', $operator: '$ne', $value: 'CSCI'})).to.be.true
    })

    it('compares courses against a pre-determined query', () => {
        const course = {department: ['ART', 'ASIAN'], year: 2015}
        const qualification = {$key: 'year', $operator: '$lte', $value: {'$computed-value': 2016}}
        expect(compareCourseToQualification(course, qualification)).to.be.true
    })

    it('refuses to compare against an array', () => {
        const course = {department: ['ART', 'ASIAN'], year: 2015}
        const qualification = {$key: 'year', $operator: '$lte', $value: [2016]}
        expect(() => compareCourseToQualification(course, qualification)).to.throw(TypeError)
    })
})
