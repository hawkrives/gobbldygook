import Reflux from 'reflux'
import Immutable from 'immutable'

import Student from '../models/student'
import demoStudent from '../models/demoStudent.json'

import studentActions from './studentActions'

let studentStore = Reflux.createStore({
	listenables: studentActions,

	init() {
		this.students = Immutable.Map()
		this.history = Immutable.Stack()
		this.future = Immutable.Stack()

		this._loadInitialData()
	},

	getInitialState() {
		return this.students
	},

	undo() {
		if (this.history.size) {
			console.log('undoing...')
			this.future = this.future.push(this.students)
			this.students = this.history.first()
			this.history = this.history.pop()
			this._postChange()
		}
	},

	redo() {
		if (this.future.size) {
			console.log('redoing...')
			this.history = this.history.push(this.students)
			this.students = this.future.first()
			this.future = this.future.pop()
			this._postChange()
		}
	},

	_preChange() {
		this.history = this.history.push(this.students)
	},

	_postChange() {
		console.groupCollapsed('studentStore._postChange')
		// console.group('studentStore._postChange')
		console.log('students', this.students)
		this.students.forEach(student => student.save())
		console.groupEnd('studentStore._postChange')
		this.trigger(this.students)
	},

	resetStudentToDemo(studentId) {
		console.info(`resetting student ${studentId} to the demo student`)
		let rawStudent = demoStudent
		rawStudent.active = true
		rawStudent.id = studentId

		let student = new Student(rawStudent)
		window.studentData = student

		this._preChange()
		this.students = this.students.set(studentId, student)
		this._postChange()
	},

	_loadInitialData() {
		console.log('studentStore._loadInitialData')

		let rawStudent = null
		let studentId = localStorage.getItem('activeStudentId')

		let localStudent = localStorage.getItem(studentId) || localStorage.getItem('student-v3.0a6')

		try {
			rawStudent = JSON.parse(localStudent)
		}
		catch (e) {
			console.info('using demo student')
			rawStudent = demoStudent
			rawStudent.active = true
			rawStudent.id = null
		}

		let student = new Student(rawStudent)
		window.studentData = student

		this.students = this.students.set(student.id, student)
		this._postChange()
	},

	_change(studentId, method, ...args) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId)[method](...args))
		this._postChange()
	},

	_alter(pathToData, method, ...args) {
		this._preChange()
		this.students = this.students.setIn(pathToData, this.students.getIn(pathToData)[method](...args))
		this._postChange()
	},

	changeName(studentId, ...args)               { this._change(studentId, 'changeName',               ...args) },
	changeActive(studentId, ...args)             { this._change(studentId, 'changeActive',             ...args) },
	changeCreditsNeeded(studentId, ...args)      { this._change(studentId, 'changeCreditsNeeded',      ...args) },
	changeMatriculation(studentId, ...args)      { this._change(studentId, 'changeMatriculation',      ...args) },
	changeGraduation(studentId, ...args)         { this._change(studentId, 'changeGraduation',         ...args) },
	changeSetting(studentId, key, value)         { this._change(studentId, 'changeSetting',         key, value) },
	addArea(studentId, ...args)                  { this._change(studentId, 'addArea',                  ...args) },
	addSchedule(studentId, ...args)              { this._change(studentId, 'addSchedule',              ...args) },
	addFabrication(studentId, ...args)           { this._change(studentId, 'addArea',                  ...args) },
	addOverride(studentId, ...args)              { this._change(studentId, 'addSchedule',              ...args) },
	removeArea(studentId, ...args)               { this._change(studentId, 'removeArea',               ...args) },
	removeMultipleAreas(studentId, ...args)      { this._change(studentId, 'removeMultipleArea',       ...args) },
	destroySchedule(studentId, ...args)          { this._change(studentId, 'destroySchedule',          ...args) },
	destroyMultipleSchedules(studentId, ...args) { this._change(studentId, 'destroyMultipleSchedules', ...args) },
	moveCourse(studentId, ...args)               { this._change(studentId, 'moveCourse',               ...args) },

	renameSchedule(studentId, scheduleId, ...args)  { this._alter([studentId, 'schedules', scheduleId], 'rename',        ...args) },
	reorderSchedule(studentId, scheduleId, ...args) { this._alter([studentId, 'schedules', scheduleId], 'reorder',       ...args) },
	moveSchedule(studentId, scheduleId, ...args)    { this._alter([studentId, 'schedules', scheduleId], 'move',          ...args) },
	addCourse(studentId, scheduleId, ...args)       { this._alter([studentId, 'schedules', scheduleId], 'addCourse',     ...args) },
	removeCourse(studentId, scheduleId, ...args)    { this._alter([studentId, 'schedules', scheduleId], 'removeCourse',  ...args) },
	reorderCourse(studentId, scheduleId, ...args)   { this._alter([studentId, 'schedules', scheduleId], 'reorderCourse', ...args) },
	reorderArea(studentId, areaId, ...args)         { this._alter([studentId, 'studies', areaId],       'reorder',       ...args) },
})

window.store = studentStore

export default studentStore
