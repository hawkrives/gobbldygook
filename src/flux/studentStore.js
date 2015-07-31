import forEach from 'lodash/collection/forEach'
import map from 'lodash/collection/map'
import uniq from 'lodash/array/uniq'
import stringify from 'json-stable-stringify'

import Reflux from 'reflux'
import Immutable from 'immutable'

import Student from '../models/student'
import demoStudent from '../models/demoStudent.json'

import studentActions from '../flux/studentActions'
import notificationActions from '../flux/notificationActions'

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
		let loadedIds = this.students.map(s => s.id).toList()
		let localIds = Immutable.List(localStorage.getItem('studentIds') || [])

		if (!loadedIds.equals(localIds)) {
			this._loadData()
		}
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
					notificationActions.logError('error parsing student', basicStudent)
				}

				if (basicStudent.id === 'student-v3.0a6') {
					delete basicStudent.id
				}

				// Make the student...
				const fleshedStudent = new Student(basicStudent)

				// and save them, of course
				fleshedStudent.save()

				return fleshedStudent
			})

		// Update the studentIds list from the current list of students
		localStorage.setItem('studentIds', stringify(localStudents.map(s => s.id).toArray()))

		// Add them to students
		this.students = this.students.withMutations(students => {
			localStudents.forEach(localStudent => {
				students = students.set(localStudent.id, localStudent)
			})
			return students
		})

		// Clean up localStorage
		cleanLocalStorage()

		this._postChange()
	},

	initStudent() {
		const fleshedStudent = new Student()
		fleshedStudent.save()
		this._preChange()
		this._loadData(fleshedStudent.id)
	},

	importStudent(rawStudent) {
		let stu = undefined
		try {
			stu = JSON.parse(rawStudent)
		}
		catch (err) {
			console.error('Error parsing as JSON', rawStudent, err)
		}

		if (stu) {
			this._preChange()
			const fleshedStudent = new Student(stu)
			fleshedStudent.save()
			this._loadData(fleshedStudent.id)
		}
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

	/*eslint-disable no-multi-spaces, brace-style */
	changeName(studentId, ...args)               { this._change(studentId, 'changeName',               ...args) },
	changeCreditsNeeded(studentId, ...args)      { this._change(studentId, 'changeCreditsNeeded',      ...args) },
	changeMatriculation(studentId, ...args)      { this._change(studentId, 'changeMatriculation',      ...args) },
	changeGraduation(studentId, ...args)         { this._change(studentId, 'changeGraduation',         ...args) },
	changeSetting(studentId, key, value)         { this._change(studentId, 'changeSetting',         key, value) },
	addArea(studentId, ...args)                  { this._change(studentId, 'addArea',                  ...args) },
	addSchedule(studentId, ...args)              { this._change(studentId, 'addSchedule',              ...args) },
	addFabrication(studentId, ...args)           { this._change(studentId, 'addArea',                  ...args) },
	addOverride(studentId, ...args)              { this._change(studentId, 'addSchedule',              ...args) },
	removeArea(studentId, ...args)               { this._change(studentId, 'removeArea',               ...args) },
	removeMultipleAreas(studentId, ...args)      { this._change(studentId, 'removeMultipleAreas',       ...args) },
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
	/*eslint-enable no-multi-spaces, brace-style */
})

window.store = studentStore

export default studentStore
