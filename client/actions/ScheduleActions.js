'use strict';

var uuid = require('node-uuid')
var Immutable = require('immutable')
var Promise = require('bluebird')

var ScheduleConstants = require('../constants/ScheduleConstants')

function randomChar() {
	// modified from http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
	return Math.random().toString(36).slice(2, 3)
}

module.exports = {
	create: function(studentId, schedule) {
		return new Promise(function(resolve, reject) {
			var immutableSchedule = Immutable.Map({
				id: uuid.v4(),
				year: schedule.year,
				semester: schedule.semester,
				title: schedule.title || 'Schedule ' + randomChar(),
				index: schedule.index || 1,
				clbids: schedule.clbids || [],
				active: schedule.active || false,
			})
			resolve(this.dispatch(ScheduleConstants.SCHEDULE_CREATE, studentId, immutableSchedule))
		})
	},
	destroy: function(studentId, schedule) {
		return Promise.resolve(this.dispatch(ScheduleConstants.SCHEDULE_DESTROY, studentId, schedule))
	},
	destroyMultiple: function(studentId, scheduleIds) {
		return Promise.resolve(this.dispatch(ScheduleConstants.SCHEDULE_DESTROY_MULTIPLE, studentId, scheduleIds))
	},
	undo: function() {
		return Promise.resolve(this.dispatch(ScheduleConstants.SCHEDULE_UNDO, {}))
	},
	scheduleChanged: function() {
		return Promise.resolve(this.dispatch(ScheduleConstants.SCHEDULE_CHANGED, {}))
	},
}
