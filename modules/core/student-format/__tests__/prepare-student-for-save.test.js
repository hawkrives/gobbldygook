import { prepareStudentForSave } from '../encode-student'

describe('prepareStudentForSave', () => {
	it('removes extraneous properties from a student object', () => {
		let s = { name: 'a', areas: [], canGraduate: false, fulfilled: {}, schedules: [] }
		const actual = prepareStudentForSave(s)
		expect(actual).toMatchSnapshot()
		expect(Object.keys(actual)).toEqual([ 'name', 'schedules' ])
	})

	it('removes extraneous properties from schedules', () => {
		let s = { name: 'a', schedules: { x: { id: 'x', courses: [], conflicts: [], hasConflict: false } } }
		const actual = prepareStudentForSave(s)
		expect(actual).toMatchSnapshot()
		expect(Object.keys(actual.schedules.x)).toEqual([ 'id' ])
	})
})
