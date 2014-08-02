var Fluxy = require('fluxy')

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
