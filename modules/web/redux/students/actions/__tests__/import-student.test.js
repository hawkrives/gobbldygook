import { importStudent } from '../import-student'
import { IMPORT_STUDENT } from '../../constants'

describe('importStudent action', () => {
    it('returns an action to import a student', () => {
        let action = importStudent({ data: '{}', type: 'application/json' })

        expect(action).toHaveProperty('type', IMPORT_STUDENT)
        expect(action).toHaveProperty('payload')
    })

    it('defaults to processing an empty object if no arguments are given', () => {
        let action = importStudent()
        expect(action).toHaveProperty('error', true)
        expect(action).toHaveProperty('payload')
        expect(action.payload.message).toBe(
            'importStudent: undefined is an invalid data type'
        )
    })

    it('includes an "error" property if there is an error', () => {
        let action = importStudent({
            data: '^INVALID_JSON^',
            type: 'application/json',
        })
        expect(action).toHaveProperty('error', true)
        expect(action).toHaveProperty('payload')
        expect(action.payload.message.indexOf('Unexpected token ^')).toBe(0)
    })

    it('includes an "error" property if the student is not json', () => {
        let action = importStudent({ data: '', type: 'text/html' })
        expect(action).toHaveProperty('error', true)
        expect(action).toHaveProperty('payload')
        expect(action.payload.message).toBe(
            'importStudent: text/html is an invalid data type'
        )
    })

    it('includes an "error" property if there was no student in the json', () => {
        let action = importStudent({ data: 'null', type: 'application/json' })
        expect(action).toHaveProperty('error', true)
        expect(action).toHaveProperty('payload')
        expect(action.payload.message).toBe('Could not process data: null')
    })
})
