import * as Reflux from 'reflux'
import * as Immutable from 'immutable'
import studentActions from 'app/flux/studentActions'
import Student from 'app/models/student'

let studentStore = Reflux.createStore({
	listenables: studentActions,

	init() {
		this.students = Immutable.Map()
		this.history = Immutable.Stack()
		this.future = Immutable.Stack()

		this._loadData()
	},

	getInitialState() {
		return this.students
	},

	undo() {
		this.future = this.future.unshift(this.history.first())
		this.students = this.history.shift()
	},

	redo() {
		if (this.future.size) {
			this.history = this.future
			this.students = this.future.shift()
		}
	},

	_loadData(opts={}) {
		console.log('studentStore._loadData, with', opts)
		let rawStudent;
		let studentId = localStorage.getItem('activeStudentId')
		let demoStudentId = '3AE9E7EE-DA8F-4014-B987-8D88814BB848'

		let localStudent = localStorage.getItem(studentId || demoStudentId) || localStorage.getItem('student-v3.0a6')

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

		this._preChange()
		this.students = this.students.set(student.id, student)
		this._postChange()
	},

	_preChange() {
		this.history = this.history.unshift(this.students)
	},

	_postChange() {
		console.groupCollapsed('studentStore._postChange')
		console.log('studentStore._postChange', this.students)
		this.students.forEach(student => student.save())
		console.groupEnd('studentStore._postChange')
		this.trigger(this.students)
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

	changeName(studentId, ...args)               { this._change(studentId, 'rename',                   ...args) },
	changeActive(studentId, ...args)             { this._change(studentId, 'changeActive',             ...args) },
	changeCreditsNeeded(studentId, ...args)      { this._change(studentId, 'changeCreditsNeeded',      ...args) },
	changeMatriculation(studentId, ...args)      { this._change(studentId, 'changeMatriculation',      ...args) },
	changeGraduation(studentId, ...args)         { this._change(studentId, 'changeGraduation',         ...args) },
	changeSetting(studentId, key, value)         { this._change(studentId, 'changeSetting',            key, value) },
	addArea(studentId, ...args)                  { this._change(studentId, 'addArea',                  ...args) },
	addSchedule(studentId, ...args)              { this._change(studentId, 'addSchedule',              ...args) },
	addFabrication(studentId, ...args)           { this._change(studentId, 'addArea',                  ...args) },
	addOverride(studentId, ...args)              { this._change(studentId, 'addSchedule',              ...args) },
	removeArea(studentId, ...args)               { this._change(studentId, 'removeArea',               ...args) },
	removeMultipleAreas(studentId, ...args)      { this._change(studentId, 'removeMultipleArea',       ...args) },
	destroySchedule(studentId, ...args)          { this._change(studentId, 'destroySchedule',          ...args) },
	destroyMultipleSchedules(studentId, ...args) { this._change(studentId, 'destroyMultipleSchedules', ...args) },

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
