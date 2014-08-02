var Fluxy = require('fluxy')

var StudentConstants = require('../constants/StudentConstants')
var StudentService = require('../services/StudentService')

var StudentActions = Fluxy.createActions({
	serviceActions: {
		create: [StudentConstants.STUDENT_CREATE, function(student) {
			return StudentService.create(student)
		}],
		encode: [StudentConstants.STUDENT_ENCODE, function(student) {
			return StudentService.encode(student)
		}],
		decode: [StudentConstants.STUDENT_DECODE, function(student) {
			return StudentService.decode(student)
		}],
	},
	undo: function() {
		this.dispatchAction(StudentConstants.STUDENT_UNDO, {});
	},
	save: function() {
		this.dispatchAction(StudentConstants.STUDENT_SAVE, {});
	}
	messages: ['STUDENT_CHANGED'],
})

module.exports = StudentActions
