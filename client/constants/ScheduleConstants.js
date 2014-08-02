var Fluxy = require('fluxy')

var ScheduleConstants = Fluxy.createConstants({
	serviceMessages: [
		'SCHEDULE_CREATE',
		'SCHEDULE_DESTROY',
		'SCHEDULE_DESTROY_MULTIPLE',
		'SCHEDULE_RENAME',
		'SCHEDULE_MOVE',
		'SCHEDULE_REORDER',
		'SCHEDULE_TOGGLE_ACTIVATE',
		'SCHEDULE_COURSE_ADD',
		'SCHEDULE_COURSE_REMOVE',
		'SCHEDULE_COURSE_MOVE',
		'SCHEDULE_UNDO',
	],
	messages: [
		'SCHEDULE_CHANGED',
		'SCHEDULE_SHOW_DETAIL',
	]
})

module.exports = ScheduleConstants
