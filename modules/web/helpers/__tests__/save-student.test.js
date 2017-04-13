import cloneDeep from 'lodash/cloneDeep'
import reject from 'lodash/reject'
import omit from 'lodash/omit'
import uuid from 'uuid/v4'

import {
    saveStudent,
    addStudentToCache,
    removeStudentFromCache,
    getIdCache,
    setIdCache,
} from '../save-student'
import demoStudent from '../../../object-student/demo-student.json'

const student = cloneDeep(demoStudent)
student.id = uuid()
Object.freeze(student)

describe('saveStudent', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('returns a promise', () => {
        expect(saveStudent({ id: student.id }).then).toBeDefined()
    })

    it('saves a student', async () => {
        await saveStudent(student)
        let expectedStudentIds = [student.id]
        let actualStudentIds = JSON.parse(localStorage.getItem('studentIds'))
        expect(actualStudentIds).toEqual(expectedStudentIds)
        let expectedStudent = student
        let actualStudent = JSON.parse(localStorage.getItem(student.id))
        expect(omit(actualStudent, 'dateLastModified')).toEqual(
            expectedStudent
        )
    })

    it("doesn't save if the student hasn't changed", async () => {
        await saveStudent(student)
        let s = JSON.parse(localStorage.getItem(student.id))
        let lastModified = s.dateLastModified
        await saveStudent(s)
        let newLastModified = JSON.parse(localStorage.getItem(student.id))
            .dateLastModified
        expect(newLastModified).toBe(lastModified)
    })
})

describe('addStudentToCache', () => {
    let ids
    beforeEach(() => {
        ids = ['1', '2', '3']
        localStorage.clear()
        localStorage.setItem('studentIds', JSON.stringify(ids))
    })

    it('adds an id to the list of student ids', () => {
        addStudentToCache('5')
        let expected = ids.concat(['5'])
        let actual = JSON.parse(localStorage.getItem('studentIds'))
        expect(actual).toEqual(expected)
    })

    it('does not add an id if one already exists', () => {
        addStudentToCache('3')
        let expected = ids
        let actual = JSON.parse(localStorage.getItem('studentIds'))
        expect(actual).toEqual(expected)
    })
})

describe('removeStudentFromCache', () => {
    let ids
    beforeEach(() => {
        ids = ['1', '2', '3']
        localStorage.clear()
        localStorage.setItem('studentIds', JSON.stringify(ids))
    })

    it('removes an id from the list of student ids', () => {
        removeStudentFromCache('1')
        let expected = reject(ids, id => id === '1')
        let actual = JSON.parse(localStorage.getItem('studentIds'))
        expect(actual).toEqual(expected)
    })

    it('does not throw if the id does not exist', () => {
        removeStudentFromCache('300')
        let expected = ids
        let actual = JSON.parse(localStorage.getItem('studentIds'))
        expect(actual).toEqual(expected)
    })
})

describe('getIdCache', () => {
    it('gets the list of student ids', () => {
        localStorage.clear()
        const ids = ['1', '2', '3']
        localStorage.setItem('studentIds', JSON.stringify(ids))
        expect(getIdCache()).toEqual(ids)
    })

    it('returns an empty array when there are no ids in the cache', () => {
        localStorage.clear()
        expect(getIdCache()).toEqual([])
    })
})

describe('setIdCache', () => {
    it('sets the list of student ids', () => {
        localStorage.clear()
        const ids = ['1', '2', '3']
        setIdCache(ids)
        let actual = JSON.parse(localStorage.getItem('studentIds'))
        let expected = ids
        expect(actual).toEqual(expected)
    })
})
