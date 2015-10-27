import uniq from 'lodash/array/uniq'
import stringify from 'json-stable-stringify'

import Reflux from 'reflux'
import Immutable from 'immutable'
import range from 'lodash/utility/range'
import forEach from 'lodash/collection/forEach'

import Student from '../models/student'
import demoStudent from '../models/demo-student.json'

import studentActions from './student-actions'
// import notificationActions from './notification-actions'

export const REFRESH_AREAS = 'gobbldygook/stores/student/refresh-areas'
export const REFRESH_COURSES = 'gobbldygook/stores/student/refresh-courses'

function cleanLocalStorage() {
	localStorage.removeItem('activeStudentId')
	localStorage.removeItem('student-v3.0a6')
}

const studentStore = Reflux.createStore({
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
		if (this.history.size) {
			// console.log('undoing...')
			this.future = this.future.push(this.students)
			this.students = this.history.first()
			this.history = this.history.pop()
			this._postChange()
		}
	},

	redo() {
		if (this.future.size) {
			// console.log('redoing...')
			this.history = this.history.push(this.students)
			this.students = this.future.first()
			this.future = this.future.pop()
			this._postChange()
		}
	},

	_preChange() {
		this.history = this.history.push(this.students)
		this.future = this.future.clear()
	},

	_postChange() {
		// console.log('students', this.students)
		this.students.forEach(student => student.save())
		this._saveStudentIds()
		this.trigger(this.students)
	},

	resetStudentToDemo(studentId) {
		// console.info(`resetting student ${studentId} to the demo student`)
		const rawStudent = demoStudent
		rawStudent.id = studentId

		const student = new Student(rawStudent)

		this._preChange()
		this.students = this.students.set(studentId, student)
		this._postChange()
	},

	reloadStudents() {
		const inMemory = this.students.map(s => s.id).toList()
		const onDisk = Immutable.List(JSON.parse(localStorage.getItem('studentIds')))

		if (!(inMemory.equals(onDisk))) {
			this._loadData()
		}
	},

	_saveStudentIds() {
		localStorage.setItem('studentIds', stringify(this.students.map(s => s.id).toArray()))
	},

	_loadData(studentId) {
		// console.log('studentStore._loadData')

		// studentIds is a list of IDs we know about.
		let studentIds =
			// Get the list of students we know about, or the string 'null',
			// if localStorage doesn't have the key 'studentIds'.
			JSON.parse(localStorage.getItem('studentIds')) ||
			// If that fails, grab the really old file 'student-v3.0a6'
			['student-v3.0a6']

		if (studentId) {
			studentIds.push(studentId)
		}

		studentIds = uniq(studentIds)

		// Fetch and load the students from their IDs
		const localStudents = Immutable.List(studentIds)
			// pull the students from localStorage
			.map(id => [id, localStorage.getItem(id)])
			// Remove any broken students from localStorage
			.map(([id, rawStudent]) => {
				if (rawStudent === '[object Object]') {
					localStorage.removeItem(id)
				}
				return rawStudent
			})
			// filter out any that don't exist
			.filterNot(rawStudent => rawStudent === null)
			// and any that are bad
			.filterNot(rawStudent => rawStudent === '[object Object]')
			// then process them
			.map(rawStudent => {
				// basicStudent defaults to an empty object so that the constructor
				// has something to build from.
				let basicStudent = {}

				try {
					basicStudent = JSON.parse(rawStudent)
				}
				catch (e) {
					// notificationActions.logError('error parsing student', basicStudent)
					console.error(e)
				}

				if (basicStudent.id === 'student-v3.0a6') {
					delete basicStudent.id
				}

				// Make the student…
				const fleshedStudent = new Student(basicStudent)

				// and save them, of course
				fleshedStudent.save()

				return fleshedStudent
			})
			.groupBy(student => student.id)
			.map(student => student.get(0))

		// Add them to students
		this.students = this.students.merge(localStudents)

		// Update the studentIds list from the current list of students
		this._saveStudentIds()

		// Clean up localStorage
		cleanLocalStorage()

		this._postChange()
	},

	initStudent() {
		const fleshedStudent = new Student().withMutations(student => {
			forEach(range(student.matriculation, student.graduation), year => {
				student = student.addSchedule({year, index: 1, active: true, semester: 1})
				student = student.addSchedule({year, index: 1, active: true, semester: 2})
				student = student.addSchedule({year, index: 1, active: true, semester: 3})
			})
		})
		fleshedStudent.save()
		this._preChange()
		this._loadData(fleshedStudent.id)
	},

	refreshData({areas=false, courses=false}) {
		if (areas) {
			this.emitter.emit(REFRESH_AREAS)
		}

		if (courses) {
			this.emitter.emit(REFRESH_AREAS)
		}

		if (areas || courses) {
			this.students = this.students.withMutations(students => {
				return students.map(s => s.checkGraduatability())
			})
		}
	},

	importStudent({data, type}) {
		let stu = undefined
		if (type === 'application/json') {
			try {
				stu = JSON.parse(data)
			}
			catch (err) {
				throw err
			}
		}

		if (stu) {
			this._preChange()
			const fleshedStudent = new Student(stu)
			fleshedStudent.save()
			this._loadData(fleshedStudent.id)
		}
	},

	destroyStudent(studentId) {
		this._preChange()
		this.students = this.students.delete(studentId)
		localStorage.removeItem(studentId)
		this._saveStudentIds()
		this._postChange()
	},

	_change(studentId, method, ...args) {
		this._preChange()
		this.students = this.students.set(studentId, this.students.get(studentId)[method](...args))
		this.students = this.students.set(studentId, this.students.get(studentId).checkGraduatability())
		this._postChange()
	},

	_alter(pathToData, method, ...args) {
		this._preChange()
		const studentId = pathToData[0]
		this.students = this.students.setIn(pathToData, this.students.getIn(pathToData)[method](...args))
		this.students = this.students.set(studentId, this.students.get(studentId).checkGraduatability())
		this._postChange()
	},

	/* eslint-disable no-multi-spaces, brace-style */
	changeName(studentId, ...args)               { this._change(studentId, 'changeName',               ...args) },
	changeAdvisor(studentId, ...args)            { this._change(studentId, 'changeAdvisor',            ...args) },
	changeCreditsNeeded(studentId, ...args)      { this._change(studentId, 'changeCreditsNeeded',      ...args) },
	changeMatriculation(studentId, ...args)      { this._change(studentId, 'changeMatriculation',      ...args) },
	changeGraduation(studentId, ...args)         { this._change(studentId, 'changeGraduation',         ...args) },
	changeSetting(studentId, key, value)         { this._change(studentId, 'changeSetting',         key, value) },
	addArea(studentId, ...args)                  { this._change(studentId, 'addArea',                  ...args) },
	addSchedule(studentId, ...args)              { this._change(studentId, 'addSchedule',              ...args) },
	addFabrication(studentId, ...args)           { this._change(studentId, 'addFabrication',           ...args) },
	setOverride(studentId, ...args)              { this._change(studentId, 'setOverride',              ...args) },
	removeOverride(studentId, ...args)           { this._change(studentId, 'removeOverride',           ...args) },
	removeArea(studentId, ...args)               { this._change(studentId, 'removeArea',               ...args) },
	removeMultipleAreas(studentId, ...args)      { this._change(studentId, 'removeMultipleAreas',      ...args) },
	destroySchedule(studentId, ...args)          { this._change(studentId, 'destroySchedule',          ...args) },
	destroyMultipleSchedules(studentId, ...args) { this._change(studentId, 'destroyMultipleSchedules', ...args) },
	moveCourse(studentId, ...args)               { this._change(studentId, 'moveCourse',               ...args) },
	editArea(studentId, areaId, ...args)         { this._change(studentId, 'editArea',         areaId, ...args) },

	renameSchedule(studentId, scheduleId, ...args)  { this._alter([studentId, 'schedules', scheduleId], 'rename',        ...args) },
	reorderSchedule(studentId, scheduleId, ...args) { this._alter([studentId, 'schedules', scheduleId], 'reorder',       ...args) },
	moveSchedule(studentId, scheduleId, ...args)    { this._alter([studentId, 'schedules', scheduleId], 'move',          ...args) },
	addCourse(studentId, scheduleId, ...args)       { this._alter([studentId, 'schedules', scheduleId], 'addCourse',     ...args) },
	removeCourse(studentId, scheduleId, ...args)    { this._alter([studentId, 'schedules', scheduleId], 'removeCourse',  ...args) },
	reorderCourse(studentId, scheduleId, ...args)   { this._alter([studentId, 'schedules', scheduleId], 'reorderCourse', ...args) },
	reorderArea(studentId, areaId, ...args)         { this._alter([studentId, 'studies', areaId],       'reorder',       ...args) },
	/* eslint-enable no-multi-spaces, brace-style */
})

window.store = studentStore

export default studentStore
