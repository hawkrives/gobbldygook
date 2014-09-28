'use strict';

var Promise = require('bluebird')

var StudentConstants = require('../constants/StudentConstants')
var ScheduleConstants = require('../constants/ScheduleConstants')
var StudyConstants = require('../constants/StudyConstants')

module.exports = {
	// Student actions
	createStudent: function(student) {
		return Promise.resolve(this.dispatch(StudentConstants.STUDENT_CREATE, student))
	},
	encodeStudent: function(student) {
		return Promise.resolve(this.dispatch(StudentConstants.STUDENT_ENCODE, student))
	},
	decodeStudent: function(student) {
		return Promise.resolve(this.dispatch(StudentConstants.STUDENT_DECODE, student))
	},
	undoStudent: function() {
		return Promise.resolve(this.dispatch(StudentConstants.STUDENT_UNDO, {}))
	},
	saveStudent: function() {
		return Promise.resolve(this.dispatch(StudentConstants.STUDENT_SAVE, {}))
	},
	studentChanged: function() {
		return Promise.resolve(this.dispatch(StudentConstants.STUDENT_CHANGED, {}))
	},

	// Schedule actions
	createSchedule: function(studentId, schedule) {
		return Promise.resolve(this.dispatch(ScheduleConstants.SCHEDULE_CREATE, {studentId: studentId, schedule: schedule}))
	},
	destroySchedule: function(studentId, scheduleId, emitChange) {
		return Promise.resolve(this.dispatch(ScheduleConstants.SCHEDULE_DESTROY, {studentId: studentId, scheduleId: scheduleId}))
	},
	destroyMultipleSchedules: function(studentId, scheduleIds) {
		return Promise.resolve(this.dispatch(ScheduleConstants.SCHEDULE_DESTROY_MULTIPLE, {studentId: studentId, scheduleIds: scheduleIds}))
	},
	undoSchedule: function() {
		return Promise.resolve(this.dispatch(ScheduleConstants.SCHEDULE_UNDO, {}))
	},
	scheduleChanged: function() {
		return Promise.resolve(this.dispatch(ScheduleConstants.SCHEDULE_CHANGED, {}))
	},

	// Area of Study actions
	undoAreaOfStudy: function() {
		Promise.resolve(this.dispatch(StudyConstants.STUDY_UNDO, {}))
	}
}
