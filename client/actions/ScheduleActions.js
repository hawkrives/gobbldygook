var Fluxy = require('fluxy')

var ScheduleConstants = require('../constants/ScheduleConstants')
var ScheduleService = require('../services/ScheduleService')

var ScheduleActions = Fluxy.createActions({
	serviceActions: {
		create: [ScheduleConstants.SCHEDULE_CREATE, function(schedule) {
			return ScheduleService.create(schedule)
		}]
	},
	undo: function() {
		this.dispatchAction(ScheduleConstants.SCHEDULE_UNDO, {});
	}
	messages: ['SCHEDULE_CHANGED'],
})

module.exports = ScheduleActions
