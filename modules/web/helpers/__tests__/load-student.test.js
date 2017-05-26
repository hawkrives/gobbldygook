import { loadStudent } from '../load-student'
import * as demoStudent from '../../../object-student/demo-student.json'

import { Student } from '../../../object-student'

describe('loadStudent', () => {
    let student
    beforeEach(() => {
        student = Student(demoStudent)
        localStorage.clear()
        localStorage.setItem(student.id, JSON.stringify(student))
    })

    it('loads a student', async () => {
        const actual = await loadStudent(student.id)
        expect(actual).toBeTruthy()
        expect(actual).toHaveProperty('id')
    })

    it(`removes the student if it is null`, async () => {
        localStorage.removeItem(student.id)
        const actual = await loadStudent(student.id)
        expect(actual).toBe(null)
    })

    it(`removes the student if it is the string [Object object]`, async () => {
        localStorage.setItem(student.id, String(student))
        const actual = await loadStudent(student.id)
        expect(actual).toBe(null)
    })

    it('returns a fresh student if JSON errors are encountered', async () => {
        localStorage.setItem(student.id, 'hello!')
        const actual = await loadStudent(student.id)
        expect(actual).toHaveProperty('id')
    })
})
