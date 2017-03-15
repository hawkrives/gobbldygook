import compareCourseToCourse from '../compare-course-to-course'

describe('compareCourseToCourse', () => {
    it('compares select keys of courses', () => {
        expect(compareCourseToCourse({ department: ['ART'], number: 310 }, { department: ['ART'], number: 310 }))
			.toBe(true)
    })

    it('compares empty objects to be equal', () => {
        expect(compareCourseToCourse({}, {})).toBe(true)
    })

    describe('compares the "department" prop', () => {
        it('the same department is equal to itself', () => {
            expect(compareCourseToCourse({ department: ['ART'] }, { department: ['ART'] }))
				.toBe(true)
        })

        it('multiple departments are not the same as a single department', () => {
            expect(compareCourseToCourse({ department: ['ART'] }, { department: ['ART', 'ASIAN'] }))
				.toBe(false)
        })

        it('different departments are not equal', () => {
            expect(compareCourseToCourse({ department: ['ASIAN'] }, { department: ['ART'] }))
				.toBe(false)
        })

        it('order is significant', () => {
            expect(compareCourseToCourse({ department: ['CHEM', 'BIO'] }, { department: ['BIO', 'CHEM'] }))
				.toBe(false)
        })
    })

    describe('compares the "semester" prop', () => {
        it('and the same semester is equal to itself', () => {
            expect(compareCourseToCourse({ semester: 1 }, { semester: 1 })).toBe(true)
        })

        it('and different semesters are not equal', () => {
            expect(compareCourseToCourse({ semester: 2 }, { semester: 1 })).toBe(false)
        })

        it('and supports the wildcard selector', () => {
            expect(compareCourseToCourse({ semester: '*' }, { semester: 1 })).toBe(true)
        })
    })

    describe('compares the "year" prop', () => {
        it('and the same year is equal to itself', () => {
            expect(compareCourseToCourse({ year: 2014 }, { year: 2014 })).toBe(true)
        })

        it('and different years are not equal', () => {
            expect(compareCourseToCourse({ year: 2014 }, { year: 2015 })).toBe(false)
        })

        it('and supports the wildcard selector', () => {
            expect(compareCourseToCourse({ year: '*' }, { year: 2015 })).toBe(true)
        })
    })

    describe('compares the "number" prop', () => {
        it('the same number is equal to itself', () => {
            expect(compareCourseToCourse({ number: 201 }, { number: 201 })).toBe(true)
        })
        it('zero is equal', () => {
            expect(compareCourseToCourse({ number: 0 }, { number: 0 })).toBe(true)
        })
        it('zero equals negative zero', () => {
            expect(compareCourseToCourse({ number: 0 }, { number: -0 })).toBe(true)
        })
        it('zero is not one', () => {
            expect(compareCourseToCourse({ number: 0 }, { number: 1 })).toBe(false)
        })
        it('infinity is not negative infinity', () => {
            expect(compareCourseToCourse({ number: Infinity }, { number: -Infinity })).toBe(false)
        })
        it('infinity equals infinity', () => {
            expect(compareCourseToCourse({ number: Infinity }, { number: Infinity })).toBe(true)
        })
    })

    describe('compares the "level" prop', () => {
        it('the same level is equal to itself', () => {
            expect(compareCourseToCourse({ level: 100 }, { level: 100 })).toBe(true)
        })
        it('different levels are different', () => {
            expect(compareCourseToCourse({ level: 100 }, { level: 200 })).toBe(false)
        })
    })

    describe('compares the "international" prop', () => {
        it('the same "international" value is equal', () => {
            expect(compareCourseToCourse({ international: true }, { international: true })).toBe(true)
        })
        it('different values are different', () => {
            expect(compareCourseToCourse({ international: true }, { international: false })).toBe(false)
        })
    })

    describe('compares the "type" prop', () => {
        it('the same "type" value is equal', () => {
            expect(compareCourseToCourse({ type: 'Lab' }, { type: 'Lab' })).toBe(true)
        })
        it('different "type" values are different', () => {
            expect(compareCourseToCourse({ type: 'Lab' }, { type: 'Research' })).toBe(false)
        })
    })

    describe('compares the "section" prop', () => {
        it('and the same section is equal', () => {
            expect(compareCourseToCourse({ section: 'A' }, { section: 'A' })).toBe(true)
        })

        it('and different sections are different', () => {
            expect(compareCourseToCourse({ section: 'A' }, { section: 'B' })).toBe(false)
        })

        it('and supports the wildcard selector', () => {
            expect(compareCourseToCourse({ section: '*' }, { section: 'D' })).toBe(true)
        })
    })

    it('returns false if the query is more specific than the possibility', () => {
        expect(compareCourseToCourse({ department: ['ASIAN'], number: 310, section: 'A' }, { department: ['ASIAN'], number: 310 })).toBe(false)
    })

    it('returns true if the query is less specific than the possibility', () => {
        expect(compareCourseToCourse({ department: ['ASIAN'], number: 310 }, { department: ['ASIAN'], number: 310, section: 'A' })).toBe(true)
    })
})
