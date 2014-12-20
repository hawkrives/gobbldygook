import * as Reflux from 'reflux'
import * as Immutable from 'immutable'
import studentActions from 'flux/studentActions'
import Student from 'models/student'

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

		student.save()

		console.log(student.toJS())

		this._preChange()
		this.students = this.students.set(student.id, student)
		this._postChange()
	},

	_preChange() {
		this.history = this.history.unshift(this.students)
	},

	_postChange() {
		console.log('studentStore._postChange')
		this.trigger(this.students)
	},

	changeName(studentId, newName) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId).rename(newName))
		this._postChange()
	},

	changeActive(studentId, isActive) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId).changeActive(isActive))
		this._postChange()
	},

	changeCreditsNeeded(studentId, newCreditsNeeded) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId).changeCreditsNeeded(newCreditsNeeded))
		this._postChange()
	},

	changeMatriculation(studentId, newMatriculation) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId).changeMatriculation(newMatriculation))
		this._postChange()
	},

	changeGraduation(studentId, newGraduation) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId).changeGraduation(newGraduation))
		this._postChange()
	},

	addArea(studentId, newArea) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId).addArea(newArea))
		this._postChange()
	},

	addSchedule(studentId, newSchedule) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId).addSchedule(newSchedule))
		this._postChange()
	},

	removeArea(studentId, areaId) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId).removeArea(areaId))
		this._postChange()
	},

	removeMultipleAreas(studentId, ids) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId).removeMultipleArea(ids))
		this._postChange()
	},

	destroySchedule(studentId, scheduleId) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId).destroySchedule(scheduleId))
		this._postChange()
	},

	destroyMultipleSchedules(studentId, ids) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId).destroyMultipleSchedules(ids))
		this._postChange()
	},

	renameSchedule(studentId, scheduleId, newTitle) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.getIn([studentId, 'schedules', scheduleId]).renameSchedule(newTitle))
		this._postChange()
	},

	reorderSchedule(studentId, scheduleId, newIndex) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.getIn([studentId, 'schedules', scheduleId]).reorderSchedule(newIndex))
		this._postChange()
	},

	moveSchedule(studentId, scheduleId, to) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.getIn([studentId, 'schedules', scheduleId]).moveSchedule(to))
		this._postChange()
	},

	addCourse(studentId, scheduleId, clbid) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.getIn([studentId, 'schedules', scheduleId]).addCourse(clbid))
		this._postChange()
	},

	removeCourse(studentId, scheduleId, clbid) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.getIn([studentId, 'schedules', scheduleId]).removeCourse(clbid))
		this._postChange()
	},

	reorderCourse(studentId, scheduleId, clbid, newIndex) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.getIn([studentId, 'schedules', scheduleId]).reorderCourse(clbid, newIndex))
		this._postChange()
	},

	reorderArea(studentId, areaId, newIndex) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.getIn([studentId, 'studies']).reorderArea(newIndex))
		this._postChange()
	},
})

window.store = studentStore

export default studentStore
