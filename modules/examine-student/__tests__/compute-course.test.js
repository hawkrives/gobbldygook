import { computeCourse } from '../compute-chunk'

describe('computeCourse', () => {
    it('checks if a course exists in the list of courses', () => {
        const courses = [
            { department: ['ASIAN', 'ART'], number: 130 },
            { department: ['ASIAN', 'ART'], number: 170 },
            { department: ['ART'], number: 250 },
        ]

        const query = {
            $type: 'course',
            $course: { department: ['ART'], number: 250 },
        }

        const { computedResult, match } = computeCourse({
            expr: query,
            courses,
            dirty: new Set(),
            isNeeded: true,
        })

        expect(computedResult).toBe(true)
        expect(match).toMatchSnapshot()
    })

    it('adds the course to the dirty set if it matches', () => {
        const courses = [
            { department: ['ART'], number: 130, type: 'Research' },
        ]
        const query = {
            $type: 'course',
            $course: { department: ['ART'], number: 130, type: 'Research' },
        }

        const dirty = new Set()

        computeCourse({ expr: query, courses, dirty, isNeeded: true })

        expect(dirty).toMatchSnapshot()
    })

    it('does not add the course to the dirty set if it did not match', () => {
        const courses = [
            { department: ['ASIAN', 'ART'], number: 130, type: 'Research' },
        ]
        const query = {
            $type: 'course',
            $course: { department: ['ART'], number: 999, type: 'Lab' },
        }

        const dirty = new Set()

        computeCourse({ expr: query, courses, dirty, isNeeded: true })

        expect(dirty).toMatchSnapshot()
    })

    it('returns false if the course is in the dirty set', () => {
        const courses = [
            { department: ['ART'], number: 130, type: 'Research' },
        ]
        const query = {
            $type: 'course',
            $course: { department: ['ART'], number: 130, type: 'Research' },
        }

        const dirty = new Set(['ART 130 Research'])

        const { computedResult, match } = computeCourse({
            expr: query,
            courses,
            dirty,
            isNeeded: true,
        })

        expect(computedResult).toBe(false)
        expect(match).toMatchSnapshot()
    })

    it('merges a query and the found course', () => {
        const courses = [
            { department: ['ASIAN', 'ART'], number: 130 },
            { department: ['ASIAN', 'ART'], number: 170 },
            { department: ['ART'], number: 250 },
        ]

        const query = {
            $type: 'course',
            $course: { department: ['ART'], number: 250, crsid: 20951 },
        }

        const { computedResult, match } = computeCourse({
            expr: query,
            courses,
            dirty: new Set(),
            isNeeded: true,
        })

        expect(computedResult).toBe(true)
        expect(match).toMatchSnapshot()
    })
})
