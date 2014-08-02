var Fluxy = require('fluxy')
var $ = Fluxy.$

var StudentConstants = require('../constants/StudentConstants')

var ScheduleStore = require('../stores/ScheduleStore')
var StudyStore = require('../stores/StudyStore')

function isActive(student) {
	return $.get(student, 'active')
}

var StudentStore = Fluxy.createStore({
	name: 'StudentStore',
	getInitialState: function() {
		return {
			students: $.hash_map()
		}
	},
	actions: [
		[StudentConstants.STUDENT_CREATE, function(student) {
			console.log('STUDENT_CREATE')
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
				var moriNewStudent = $.hash_map(
					'name', newStudent.name,
					'enrollment', newStudent.enrollment,
					'graduation', newStudent.graduation,
					'creditsNeeded', newStudent.creditsNeeded
				)
				return $.merge(oldStudent, moriNewStudent)
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
	getActiveStudent: function() {
		// console.log('called getActiveStudent')
		var activeStudents = $.filter(isActive, $.vals(this.get('students')))
		// console.log('getActiveStudent activeStudents', $.clj_to_js(activeStudents))
		var activeStudent = $.first(activeStudents)
		// console.log('getActiveStudent activeStudent', $.clj_to_js(activeStudent))
		return activeStudent
	},
})

module.exports = StudentStore
