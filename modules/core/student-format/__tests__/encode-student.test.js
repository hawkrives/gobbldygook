import {expect} from 'chai'
import {encodeStudent} from '../encode-student'

let oldEncode = global.encodeURIComponent

describe('prepareStudentForSave', () => {
	before(() => {
		global.encodeURIComponent = require('querystring').stringify
	})
	after(() => {
		global.encodeURIComponent = oldEncode
	})

	it('encodes a student', () => {
		expect(encodeStudent({name: 's'})).to.equal('')
	})
})

