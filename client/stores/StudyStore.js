var Fluxy = require('fluxy')
var $ = Fluxy.$

var StudyConstants = require('../constants/StudyConstants');

var StudyStore = Fluxy.createStore({
	getInitialState: function() {
		return {
			studies: {}
		}
	},
	actions: [
		[StudyConstants.STUDY_ADD, function(id) {
			findArea(id).then(function(areaOfStudy) {
				this.set(['studies', id], $.js_to_clj(areaOfStudy))
			})
		}],

		[StudyConstants.STUDY_ADD_FAILED, function(id) {
			console.error('Area of Study Addition Failed!', id)
		}],

		[StudyConstants.STUDY_REMOVE, function(id) {
			this.set(['studies'], function(areas) {
				return $.dissoc(areas, id)
			})
		}],

		[StudyConstants.STUDY_REORDER, function(id, newIndex) {
			this.set(['studies', id, 'index'], newIndex)
		}],

		[StudyConstants.STUDY_TOGGLE_OPEN, function(id) {
			this.set(['studies', id, 'open'], function(open) {
				return !open
			})
		}],

		[StudyConstants.STUDY_UNDO, function() {
			this.undo()
		}],
	]
})

module.exports = StudyStore
