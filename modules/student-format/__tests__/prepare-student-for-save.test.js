import {expect} from 'chai'
import {prepareStudentForSave} from '../encode-student'

describe('prepareStudentForSave', () => {
	it('removes extraneous properties from a student object', () => {
		let s = {name: 'a', areas: [], canGraduate: false, fulfilled: {}, schedules: []}
		expect(Object.keys(prepareStudentForSave(s))).to.deep.equal(['name', 'schedules'])
	})

	it('removes extraneous properties from schedules', () => {
		let s = {name: 'a', schedules: {x: {id: 'x', courses: [], conflicts: [], hasConflict: false}}}
		expect(Object.keys(prepareStudentForSave(s).schedules.x)).to.deep.equal(['id'])
	})
})
