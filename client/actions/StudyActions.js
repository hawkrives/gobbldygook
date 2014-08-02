var Fluxy = require('fluxy')

var StudyActions = Fluxy.createActions({
	undo: function() {
		this.dispatchAction(StudyConstants.STUDY_UNDO, {});
	}
	messages: ['SCHEDULE_CHANGED'],
})

module.exports = StudyActions
