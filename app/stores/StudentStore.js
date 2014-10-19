'use strict';

import * as _ from 'lodash'
import * as Fluxxor from 'fluxxor'

import uuid from '../helpers/uuid'
import * as Immutable from 'immutable'

import StudentConstants from '../constants/StudentConstants'
import ScheduleConstants from '../constants/ScheduleConstants'
import StudyConstants from '../constants/StudyConstants'

function randomChar() {
	// modified from http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
	return Math.random().toString(36).slice(2, 3)
}

var StudentStore = Fluxxor.createStore({
	initialize: function(options) {
		console.log('StudentStore.initialize')
		this.students = Immutable.Map()
		this.active = {}

		if (options.students) {
			_.each(options.students, this.handleStudentCreation)
		}

		this.bindActions(
			// Student Constants
			StudentConstants.STUDENT_ENCODE,        this.handleStudentEncode,
			StudentConstants.STUDENT_DECODE,        this.handleStudentDecode,
			StudentConstants.STUDENT_UPDATE,        this.handleStudentUpdate,
			StudentConstants.STUDENT_CREATE,        this.handleStudentCreation,
			StudentConstants.STUDENT_DESTROY,       this.handleStudentDestroy,
			StudentConstants.STUDENT_UNDO,          this.handleStudentUndo,
			StudentConstants.STUDENT_TOGGLE_ACTIVE, this.handleStudentToggleActive,
			StudentConstants.STUDENT_SAVE,          this.handleStudentSave,

			// Schedule Constants
			ScheduleConstants.SCHEDULE_CREATE,           this.handleScheduleCreation,
			ScheduleConstants.SCHEDULE_DESTROY,          this.handleScheduleDestruction,
			ScheduleConstants.SCHEDULE_DESTROY_MULTIPLE, this.handleMultipleScheduleDestruction,
			ScheduleConstants.SCHEDULE_RENAME,           this.handleScheduleRename,
			ScheduleConstants.SCHEDULE_MOVE,             this.handleScheduleMove,
			ScheduleConstants.SCHEDULE_REORDER,          this.handleScheduleReorder,
			ScheduleConstants.SCHEDULE_TOGGLE_ACTIVATE,  this.handleScheduleToggleActivate,
			ScheduleConstants.SCHEDULE_COURSE_ADD,       this.handleScheduleCourseAdd,
			ScheduleConstants.SCHEDULE_COURSE_REMOVE,    this.handleScheduleCourseRemove,
			ScheduleConstants.SCHEDULE_COURSE_MOVE,      this.handleScheduleCourseMove,
			ScheduleConstants.SCHEDULE_UNDO,             this.handleScheduleUndo,
			ScheduleConstants.SCHEDULE_CHANGED,          this.handleScheduleChanged,
			ScheduleConstants.SCHEDULE_SHOW_DETAIL,      this.handleScheduleShowDetail,

			// Study Constants
			StudyConstants.STUDY_ADD,         this.handleStudyAdd,
			StudyConstants.STUDY_REMOVE,      this.handleStudyRemove,
			StudyConstants.STUDY_REORDER,     this.handleStudyReorder,
			StudyConstants.STUDY_UNDO,        this.handleStudyUndo,
			StudyConstants.STUDY_TOGGLE_OPEN, this.handleStudyToggleOpen

			// Fabrication Constants
			// Override Constants
		)

		this.emit('change')
	},
	getState: function() {
		console.log('StudentStore.getState')

		return {
			students: this.students,
			active: this.active
		}
	},

	// Student Actions
	handleStudentEncode: function() {},

	handleStudentDecode: function() {},

	handleStudentUpdate: function(student) {},

	handleStudentCreation: function(student) {
		console.log('StudentStore.createStudent')
		var genericStudent = {
			id: uuid(),
			name: 'Student ' + randomChar(),
			active: false,
			matriculation: 1874,
			graduation: 2016,
			creditsNeeded: 35,
			studies: {},
			schedules: {},
			overrides: {},
			fabrications: {},
		}

		var joinedStudent = _.merge(genericStudent, student)

		if (this.students.length > 0) {
			joinedStudent.active = false
		}

		joinedStudent.studies      = Immutable.OrderedMap(joinedStudent.studies)
		joinedStudent.schedules    = Immutable.OrderedMap(joinedStudent.schedules)
		joinedStudent.overrides    = Immutable.Map(joinedStudent.overrides)
		joinedStudent.fabrications = Immutable.Map(joinedStudent.fabrications)

		var immutableStudent = Immutable.fromJS(joinedStudent)

		this.students = this.students.set(joinedStudent.id, immutableStudent)

		this.findActiveStudent()

		this.emit('change')
	},

	handleStudentDestroy: function(student) {
		console.log('StudentStore.destroyStudent')
		this.students = this.students.delete(student.id)

		if (this.students.length > 0) {
			this.findActiveStudent()
		} else {
			this.handleStudentCreation()
		}

		this.emit('change')
	},

	handleStudentUndo: function() {
		this.findActiveStudent()
	},

	handleStudentToggleActive: function(student) {
		console.log('StudentStore.toggleStudentActive')
		// is there a possibility of a student being passed in that isn't an immutable object?
		var changedStudent = this.students.get(student.get('id'))
			.withMutations(function(student) {
				return student.set('active', !student.get('active'))
			})
		this.students = this.students.set(student.get('id'), changedStudent)

		this.findActiveStudent()

		this.emit('change')
	},

	handleStudentSave: function() {},

	// Schedule Actions
	handleScheduleCreation: function(args) {
		console.log('StudentStore.createSchedule')

		// args: {studentId, schedule}
		var studentId = args.studentId
		var schedule = args.schedule

		var genericSchedule = {
			id: uuid(),
			year: 0,
			semester: 0,
			title: 'Schedule ' + randomChar(),
			index: 1,
			clbids: [],
		}

		schedule.active = _.size(this.students.get(studentId).schedules) > 0 ? false : true

		var joinedSchedule = _.merge(genericSchedule, schedule)
		var immutableSchedule = Immutable.fromJS(joinedSchedule)
		this.students = this.students.updateIn([studentId, 'schedules'], function(schedules) {
			return schedules.set(joinedSchedule.id, immutableSchedule)
		})

		console.log(this.students.getIn([studentId, 'schedules', joinedSchedule.id]))
		this.emit('change')
	},

	handleScheduleDestruction: function(args, emitChange) {
		console.log('StudentStore.destroySchedule')
		emitChange = emitChange || false

		// args: {studentId, scheduleId}
		var studentId = args.studentId
		var scheduleId = args.scheduleId.toString()

		this.students = this.students.updateIn([studentId, 'schedules'], function(schedules) {
			return schedules.remove(scheduleId)
		})

		if (emitChange) {
			this.emit('change')
		}
	},

	handleMultipleScheduleDestruction: function(args) {
		console.log('StudentStore.destroyMultipleSchedules')

		// args: {studentId, schedule}
		var studentId = args.studentId
		var scheduleIds = args.scheduleIds

		_.each(scheduleIds, function(scheduleId) {
			this.handleScheduleDestruction({studentId: studentId, scheduleId: scheduleId}, false)
		}, this)
		this.emit('change')
	},

	handleScheduleRename: function() {},

	handleScheduleMove: function() {},

	handleScheduleReorder: function() {},

	handleScheduleToggleActivate: function() {},

	handleScheduleCourseAdd: function() {},

	handleScheduleCourseRemove: function() {},

	handleScheduleCourseMove: function() {},

	handleScheduleUndo: function() {},

	handleScheduleChanged: function() {},

	handleScheduleShowDetail: function() {},

	// Area of Study Actions
	handleStudyAdd: function() {},

	handleStudyRemove: function() {},

	handleStudyReorder: function() {},

	handleStudyUndo: function() {},

	handleStudyToggleOpen: function() {},

	findActiveStudent: function() {
		console.log('StudentStore.findActiveStudent')

		// try to find active student
		var activeStudentId = this.students.findKey(function(student) {
			return student.get('active')
		})

		// if there is an active student, put it in active
		if (activeStudentId) {
			this.active = this.students.get(activeStudentId).toJS()
		}

		// otherwise, make the next one active
		else if (this.students.length > 0) {
			this.handleStudentToggleActive(this.students.first())
		}

		// otherwise, make a student
		else {
			this.handleStudentCreation()
		}
	},
})

module.exports = StudentStore
