var Fluxy = require('fluxy')
var $ = Fluxy.$

var ScheduleConstants = require('../constants/ScheduleConstants');

var ScheduleStore = Fluxy.createStore({
	getInitialState: function() {
		return {
			schedules: {}
		}
	},
	actions: [
		[ScheduleConstants.SCHEDULE_CREATE, function(schedule) {
			this.set(['schedules', schedule.id], $.js_to_clj(schedule))
		}],

		[ScheduleConstants.SCHEDULE_CREATE_FAILED, function(schedule) {
			console.error('Schedule Creation Failed!', schedule)
		}],

		[ScheduleConstants.SCHEDULE_DESTROY, function(schedule) {
			this.set(['schedules'], function(schedules) {
				return $.dissoc(schedules, schedule.id)
			})
		}],

		[ScheduleConstants.SCHEDULE_RENAME, function(id, title) {
			this.set(['schedules', id, 'title'], title)
		}],

		[ScheduleConstants.SCHEDULE_MOVE, function(id, newYear, newSemester) {
			this.set(['schedules', id, 'year'], newYear)
			this.set(['schedules', id, 'semester'], newSemester)
		}],

		[ScheduleConstants.SCHEDULE_REORDER, function(id, newIndex) {
			this.set(['schedules', id, 'index'], newIndex)
		}],

		[ScheduleConstants.SCHEDULE_TOGGLE_ACTIVATE, function(id) {
			this.set(['schedules', id, 'active'], function(active) {
				return !active
			})
		}],

		[ScheduleConstants.SCHEDULE_COURSE_ADD, function(id, clbid) {
			this.set(['schedules', id, 'clbids'], function(clbids) {
				return $.distinct($.conj(clbids, clbid))
			})
		}],

		[ScheduleConstants.SCHEDULE_COURSE_REMOVE, function(id, clbid) {
			this.set(['schedules', id, 'clbids'], function(clbids) {
				return $.disj(clbids, clbid)
			})
		}],

		[ScheduleConstants.SCHEDULE_COURSE_MOVE, function(currentId, newId, clbid) {
			this.dispatchAction(ScheduleConstants.COURSE_ADD, newId, clbid)
			this.dispatchAction(ScheduleConstants.COURSE_REMOVE, currentId, clbid)
		}],

		[ScheduleConstants.SCHEDULE_UNDO, function() {
			this.undo()
		}],
	]
})

module.exports = ScheduleStore
