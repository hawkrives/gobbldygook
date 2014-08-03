'use strict';

var Fluxy = require('fluxy')
var uuid = require('node-uuid')
var mori = require('mori')
var Promise = require('bluebird')

var ScheduleConstants = require('../constants/ScheduleConstants')

function randomChar() {
	// modified from http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
	return Math.random().toString(36).slice(2, 3)
}

var ScheduleActions = Fluxy.createActions({
	serviceActions: {
		create: [ScheduleConstants.SCHEDULE_CREATE, function(schedule) {
			return new Promise(function(resolve, reject) {
				resolve(mori.js_to_clj({
					id: uuid.v4(),
					year: schedule.year,
					semester: schedule.semester,
					title: schedule.title || 'Schedule ' + randomChar(),
					index: schedule.index || 1,
					clbids: mori.set(),
					active: schedule.active || false,
				}))
			})
		}],
		destroy: [ScheduleConstants.SCHEDULE_DESTROY, function(studentId, schedule) {
			// console.log('ScheduleActions SCHEDULE_DESTROY', studentId, schedule)
			return Promise.resolve(
				this.dispatchAction(ScheduleConstants.SCHEDULE_DESTROY, studentId, schedule)
			)
		}],
		destroyMultiple: [ScheduleConstants.SCHEDULE_DESTROY_MULTIPLE, function(studentId, scheduleIds) {
			// console.log('ScheduleActions SCHEDULE_DESTROY_MULTIPLE', studentId, scheduleIds)
			return Promise.resolve(
				this.dispatchAction(ScheduleConstants.SCHEDULE_DESTROY_MULTIPLE, studentId, scheduleIds)
			)
		}]
	},
	undo: function() {
		this.dispatchAction(ScheduleConstants.SCHEDULE_UNDO, {});
	},
	messages: ['SCHEDULE_CHANGED'],
})

module.exports = ScheduleActions
