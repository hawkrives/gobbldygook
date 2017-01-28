import { expect } from 'chai'
import { encodeStudent } from '../encode-student'

let oldEncode = global.encodeURIComponent

let before = global.before || global.beforeAll
let after = global.after || global.afterAll

describe('prepareStudentForSave', () => {
	beforeAll(() => {
		global.encodeURIComponent = require('querystring').stringify
	})
	afterAll(() => {
		global.encodeURIComponent = oldEncode
	})

	it('encodes a student', () => {
		expect(encodeStudent({ name: 's' })).to.equal('')
	})
})
