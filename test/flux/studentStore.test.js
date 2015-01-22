// test/flux/studentStore.test.js
jest.dontMock('../../app/flux/studentStore')
jest.dontMock('dom-storage')

import Storage from 'dom-storage'
let local = new Storage(null, {strict: true})
window.localStorage = local

describe('studentStore', () => {
	let studentStore = undefined
	beforeEach(() => {
		localStorage.clear()
		studentStore = require('../../app/flux/studentStore')
	})

	it('creates itself correctly', () => {
		expect(studentStore.students).toBeDefined()
		expect(studentStore.history).toBeDefined()
		expect(studentStore.future).toBeDefined()
	})

	it('supports undoing things', () => {
		let initial = studentStore.students

		studentStore.initStudent()
		let oneChange = studentStore.students

		studentStore.initStudent()
		let twoChange = studentStore.students

		studentStore.initStudent()
		let threeChange = studentStore.students

		expect(initial.size).toBe(0)
		expect(oneChange.size).toBe(1)
		expect(twoChange.size).toBe(2)
		expect(threeChange.size).toBe(3)

		expect(studentStore.students).toBe(threeChange)

		studentStore.undo()
		expect(studentStore.students).toBe(twoChange)

		studentStore.undo()
		expect(studentStore.students).toBe(oneChange)

		studentStore.undo()
		expect(studentStore.students).toBe(initial)
	})
	it('supports redoing things', () => {
		let initial = studentStore.students
		studentStore.initStudent()
		let oneChange = studentStore.students

		expect(initial.size).toBe(0)
		expect(oneChange.size).toBe(1)

		expect(studentStore.students).toBe(oneChange)
		studentStore.undo()
		expect(studentStore.students).toBe(initial)
		studentStore.redo()
		expect(studentStore.students).toBe(oneChange)
	})
	it('will not let you go back to a previous future', () => {
		let initial = studentStore.students
		studentStore.initStudent()
		let oneChange = studentStore.students
		studentStore.initStudent()
		let twoChange = studentStore.students

		expect(initial.size).toBe(0)
		expect(oneChange.size).toBe(1)
		expect(twoChange.size).toBe(2)

		expect(studentStore.students).toBe(twoChange)
		studentStore.undo()
		expect(studentStore.students).toBe(oneChange)

		studentStore.initStudent()
		let newFuture = studentStore.students

		studentStore.redo()
		expect(studentStore.students).toBe(newFuture)
		expect(studentStore.future.size).toBe(0)
	})

	it('can reset a student to a demo state', () => {
		studentStore.initStudent()
		let stu = studentStore.students.first()

		studentStore.resetStudentToDemo(stu.id)

		expect(studentStore.students.first()).not.toBe(stu)
	})
	it('reloads all currently known students from storage', () => {
		studentStore.initStudent()
		let stu = studentStore.students.first()

		let mutable = JSON.parse(localStorage.getItem(stu.id))
		mutable.name = 'name'
		localStorage.setItem(mutable.id, JSON.stringify(mutable))

		studentStore.reloadStudents()

		let other = studentStore.students.first()
		expect(other).not.toBe(stu)
		expect(other.name).toBe('name')
	})

	it('loads students from storage', () => {
		localStorage.setItem('student', JSON.stringify({id: 'student'}))
		localStorage.setItem('studentIds', JSON.stringify(['student']))
		studentStore._loadData()
		expect(studentStore.students.first().id).toBe('student')
	})
	it('handles loading zero students from storage', () => {
		studentStore._loadData()
		expect(studentStore.students.size).toBe(0)
	})
	it('loads the given id from storage', () => {
		localStorage.setItem('student', JSON.stringify({id: 'student'}))
		studentStore._loadData('student')
		expect(studentStore.students.first().id).toBe('student')
		expect(localStorage.getItem('studentIds')).toEqual('["student"]')
	})
	it('does not load the given id twice if it already exists in studentIds', () => {
		localStorage.setItem('student', JSON.stringify({id: 'student'}))
		localStorage.setItem('studentIds', JSON.stringify(['student']))
		studentStore._loadData('student')
		expect(studentStore.students.first().id).toBe('student')
		expect(localStorage.getItem('studentIds')).toEqual('["student"]')
	})
	it('removes broken students fom storage', () => {
		localStorage.setItem('student', JSON.stringify({id: 'student'}))
		localStorage.setItem('broken', {id: 'broken'})
		localStorage.setItem('studentIds', JSON.stringify(['student', 'broken']))
		studentStore._loadData('student')
		expect(studentStore.students.first().id).toBe('student')
		expect(localStorage.getItem('studentIds')).toEqual('["student"]')
	})

	it('creates new students', () => {
		studentStore.initStudent()
		expect(studentStore.students.size).toBe(1)
	})

	it('saves state before changing students', () => {
		studentStore.initStudent()
		let initial = studentStore.students
		let stu = initial.first()

		studentStore.changeName(stu.id, 'new name')

		expect(studentStore.students).not.toBe(initial)

		studentStore.undo()

		expect(studentStore.students).toBe(initial)
	})
	it('saves state before altering students', () => {
		studentStore.initStudent()
		let initial = studentStore.students
		let stu = initial.first()

		studentStore.addSchedule(stu.id)
		let second = studentStore.students
		let sched = studentStore.students.first().schedules.first()

		studentStore.renameSchedule(stu.id, sched.id, 'new name')

		expect(studentStore.students).not.toBe(second)

		studentStore.undo()

		expect(studentStore.students).toBe(second)

		studentStore.undo()

		expect(studentStore.students).toBe(initial)
	})

	it('calls methods that change students', () => {
		studentStore.initStudent()
		let initial = studentStore.students
		let stu = initial.first()

		studentStore.changeName(stu.id, 'new name')

		expect(studentStore.students.get(stu.id).name).toBe('new name')
	})
	it('calls methods that alter things inside of students', () => {
		studentStore.initStudent()
		let initial = studentStore.students
		let stu = initial.first()

		studentStore.addSchedule(stu.id)
		let second = studentStore.students
		let sched = studentStore.students.get(stu.id).schedules.first()

		studentStore.renameSchedule(stu.id, sched.id, 'new name')

		expect(studentStore.students.get(stu.id).schedules.get(sched.id).title).toBe('new name')
	})
})
