import { encodeStudent } from '../encode-student'

const newEncode = require('querystring').stringify
const oldEncode = global.encodeURIComponent

describe('prepareStudentForSave', () => {
    beforeAll(() => {
        global.encodeURIComponent = newEncode
    })
    afterAll(() => {
        global.encodeURIComponent = oldEncode
    })

    it('encodes a student', () => {
        expect(encodeStudent({ name: 's' })).toBe('')
    })
})
