var Fluxy = require('fluxy')

var StudyConstants = Fluxy.createConstants({
	serviceMessages: [
		'STUDY_ADD',
		'STUDY_REMOVE',
		'STUDY_REORDER',
		'STUDY_UNDO',
		'STUDY_TOGGLE_OPEN',
	]
})

module.exports = StudyConstants
