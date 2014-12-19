import * as Reflux from 'reflux'
import * as Immutable from 'immutable'
import studentActions from 'flux/studentActions'

let studentStore = Reflux.createStore({
	init() {
		this.listenTo(studentActions)

		this.students = Immutable.List()
		this.history = Immutable.Stack()
		this.future = Immutable.Stack()

		this._loadData()

		this.trigger(this.students)
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
		let rawStudent;
		let studentId = localStorage.getItem('activeStudentId')
		let demoStudentId = '3AE9E7EE-DA8F-4014-B987-8D88814BB848'

		let localStudent = localStorage.getItem(studentId || demoStudentId) || localStorage.getItem(`student-${currentVersionString}`)

		try {
			rawStudent = JSON.parse(localStudent)
		}
		catch (e) {
			console.info('using demo student')
			rawStudent = demoStudent
			rawStudent.active = true
			rawStudent.id = null
		}

		if (opts.demo) {
			console.log('reverting to demo student')
			rawStudent = demoStudent
			rawStudent.active = true
			rawStudent.id = null
		}

		let student = new Student(rawStudent)
		window.student_data = student

		student.save()

		this._preChange()
		this.students = this.students.push(student)
	},

	_preChange() {
		this.history = this.history.unshift(this.students)
	},

	_postChange() {
		this.trigger(this.students)
	},

	changeName(studentId, newName) {
		this._preChange()
		this.students = this.students.get(studentId).rename(newName)
		this._postChange()
	},

	changeActive(studentId, isActive) {
		this._preChange()
		this.students = this.students.get(studentId).changeActive(isActive)
		this._postChange()
	},

	changeCreditsNeeded(studentId, newCreditsNeeded) {
		this._preChange()
		this.students = this.students.get(studentId).changeCreditsNeeded(newCreditsNeeded)
		this._postChange()
	},

	changeMatriculation(studentId, newMatriculation) {
		this._preChange()
		this.students = this.students.get(studentId).changeMatriculation(newMatriculation)
		this._postChange()
	},

	changeGraduation(studentId, newGraduation) {
		this._preChange()
		this.students = this.students.get(studentId).changeGraduation(newGraduation)
		this._postChange()
	},

	addArea(studentId, newArea) {
		this._preChange()
		this.students = this.students.get(studentId).addArea(newArea)
		this._postChange()
	},

	addSchedule(studentId, newSchedule) {
		this._preChange()
		this.students = this.students.get(studentId).addSchedule(newSchedule)
		this._postChange()
	},

	removeArea(studentId, areaId) {
		this._preChange()
		this.students = this.students.get(studentId).removeArea(areaId)
		this._postChange()
	},

	removeMultipleAreas(studentId, ids) {
		this._preChange()
		this.students = this.students.get(studentId).removeMultipleArea(ids)
		this._postChange()
	},

	destroySchedule(studentId, scheduleId) {
		this._preChange()
		this.students = this.students.get(studentId).destroySchedule(newSchedule)
		this._postChange()
	},

	destroyMultipleSchedules(studentId, ids) {
		this._preChange()
		this.students = this.students.get(studentId).destroyMultipleSchedules(newSchedule)
		this._postChange()
	},

	renameSchedule(studentId, scheduleId, newTitle) {
		this._preChange()
		this.students = this.students.getIn([studentId, 'schedules', scheduleId]).renameSchedule(newTitle)
		this._postChange()
	},

	reorderSchedule(studentId, scheduleId, newIndex) {
		this._preChange()
		this.students = this.students.getIn([studentId, 'schedules', scheduleId]).reorderSchedule(newIndex)
		this._postChange()
	},

	moveSchedule(studentId, scheduleId, to) {
		this._preChange()
		this.students = this.students.getIn([studentId, 'schedules', scheduleId]).moveSchedule(to)
		this._postChange()
	},

	addCourse(studentId, scheduleId, clbid) {
		this._preChange()
		this.students = this.students.getIn([studentId, 'schedules', scheduleId]).addCourse(clbid)
		this._postChange()
	},

	removeCourse(studentId, scheduleId, clbid) {
		this._preChange()
		this.students = this.students.getIn([studentId, 'schedules', scheduleId]).removeCourse(clbid)
		this._postChange()
	},

	reorderCourse(studentId, scheduleId, clbid, newIndex) {
		this._preChange()
		this.students = this.students.getIn([studentId, 'schedules', scheduleId]).reorderCourse(clbid, newIndex)
		this._postChange()
	},

	reorderArea(studentId, areaId, newIndex) {
		this._preChange()
		this.students = this.students.getIn([studentId, 'studies']).reorderArea(newIndex)
		this._postChange()
	},
})

export default studentStore
