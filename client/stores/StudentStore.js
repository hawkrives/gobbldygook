var Fluxy = require('fluxy')
var $ = Fluxy.$

var StudentConstants = require('../constants/StudentConstants');

var ScheduleStore = require('../stores/ScheduleStore');
var StudyStore = require('../stores/StudyStore');

function isActive(student) {
	return student.active
}

var StudentStore = Fluxy.createStore({
	getInitialState: function() {
		return {
			students: {},
			currentStudent: {}
		}
	},
	actions: [
		[StudentConstants.STUDENT_CREATE, function(student) {
			this.set(['students', student.id], $.js_to_clj(student))
		}],

		[StudentConstants.STUDENT_CREATE_FAILED, function(student) {
			console.error('Student Creation Failed!', student)
		}],

		[StudentConstants.STUDENT_DESTROY, function(id) {
			this.set(['students'], function(students) {
				return $.dissoc(students, id)
			})
		}],

		[StudentConstants.STUDENT_UPDATE, function(id, newStudent) {
			this.set(['students', id], function(oldStudent) {
				return $.assoc(
					'name', newStudent.name,
					'enrollment', newStudent.enrollment,
					'graduation', newStudent.graduation,
					'creditsNeeded', newStudent.creditsNeeded
				)
			})
		}],

		[StudentConstants.STUDENT_TOGGLE_ACTIVE, function(id) {
			this.set(['students', id, 'active'], function(active) {
				return !active
			})
		}],

		[StudentConstants.STUDENT_UNDO, function() {
			this.undo()
		}],

		[StudentConstants.STUDENT_SAVE, function() {
			// this.undo()
		}],
	],
	activeStudent: function() {
		return $.first($.filter(isActive, this.get('students')))
	},
})

module.exports = StudentStore
