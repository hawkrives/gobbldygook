'use strict';

var Fluxxor = require('fluxxor')
var _ = require('lodash')
var uuid = require('node-uuid')
var Immutable = require('immutable')

var StudentConstants = require('../constants/StudentConstants')
var ScheduleConstants = require('../constants/ScheduleConstants')
var StudyConstants = require('../constants/StudyConstants')

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
			_.each(options.students, this.handleStudentCreate)
		}

		this.bindActions(
			// Student Constants
			StudentConstants.STUDENT_ENCODE,        this.handleStudentEncode,
			StudentConstants.STUDENT_DECODE,        this.handleStudentDecode,
			StudentConstants.STUDENT_UPDATE,        this.handleStudentUpdate,
			StudentConstants.STUDENT_CREATE,        this.handleStudentCreate,
			StudentConstants.STUDENT_DESTROY,       this.handleStudentDestroy,
			StudentConstants.STUDENT_UNDO,          this.handleStudentUndo,
			StudentConstants.STUDENT_TOGGLE_ACTIVE, this.handleStudentToggleActive,
			StudentConstants.STUDENT_SAVE,          this.handleStudentSave,

			// Schedule Constants
			ScheduleConstants.SCHEDULE_CREATE,           this.handleScheduleCreate,
			ScheduleConstants.SCHEDULE_DESTROY,          this.handleScheduleDestroy,
			ScheduleConstants.SCHEDULE_DESTROY_MULTIPLE, this.handleScheduleDestroyMultiple,
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

	handleStudentCreate: function(student) {
		console.log('StudentStore.createStudent')
		var genericStudent = {
			id: uuid.v4(),
			name: 'Student ' + randomChar(),
			enrollment: 1874,
			graduation: 2016,
			creditsNeeded: 35,
			studies: {},
			schedules: {},
			overrides: {},
			fabrications: {},
		}

		if (this.students.length > 0) {
			student.active = false
		}

		var joinedStudent = _.merge(genericStudent, student)
		this.students = this.students.set(joinedStudent.id, joinedStudent)

		this.findActiveStudent()

		this.emit('change')
	},

	handleStudentDestroy: function(student) {
		console.log('StudentStore.destroyStudent')
		this.students = this.students.delete(student.id)

		if (this.students.length > 0) {
			this.findActiveStudent()
		} else {
			this.handleStudentCreate()
		}

		this.emit('change')
	},

	handleStudentUndo: function() {
		this.findActiveStudent()
	},

	handleStudentToggleActive: function(student) {
		console.log('StudentStore.toggleStudentActive')
		var changedStudent = this.students.get(student.id).withMutations(function(student) {
			student.set('active', !student.get('active'))
		})
		this.students.set(student.id, changedStudent)

		this.findActiveStudent()

		this.emit('change')
	},

	handleStudentSave: function() {},

	// Schedule Actions
	handleScheduleCreate: function(student, schedule) {
		console.log('StudentStore.createSchedule')
		var genericSchedule = {
			id: uuid.v4(),
			year: schedule.year,
			semester: schedule.semester,
			title: 'Schedule ' + randomChar(),
			index: 1,
			clbids: [],
			active: false,
		}

		schedule.active = false

		var joinedSchedule = _.merge(genericSchedule, schedule)
		this.students = this.students.updateIn([student.id, 'schedules', schedule.id], joinedSchedule)
		this.emit('change')
	},

	handleScheduleDestroy: function(studentId, schedule, emitChange) {
		console.log('StudentStore.destroySchedule')
		this.students = this.students.updateIn([studentId, 'schedules'], function(schedules) {
			return schedules.delete(scheduleToDelete.id)
		})
		if (!_.isUndefined(emitChange) && emitChange) {
			this.emit('change')
		}
	},

	handleScheduleDestroyMultiple: function(studentId, scheduleIds) {
		console.log('StudentStore.destroyMultipleSchedules')
		_.each(scheduleIds, function(scheduleId) {
			this.handleScheduleDestroy(studentId, scheduleId, false)
		})
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
			return student.active
		})

		// if there is an active student, put it in active
		if (activeStudentId) {
			this.active = this.students.get(activeStudentId)
		}

		// otherwise, make the next one active
		else if (this.students.length > 0) {
			this.handleStudentToggleActive(this.students.first())
		}

		// otherwise, make a student
		else {
			this.handleStudentCreate()
		}
	},
})

module.exports = StudentStore
