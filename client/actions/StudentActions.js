'use strict';

var uuid = require('node-uuid')
var Immutable = require('immutable')
var Promise = require('bluebird')

var StudentConstants = require('../constants/StudentConstants')

module.exports = {
	create: function(student) {
		return new Promise(function(resolve, reject) {
			var immutableStudent = Immutable.map({
				id: student.id || uuid.v4(),
				name: student.name || '',
				active: student.active || false,
				enrollment: student.enrollment || 0,
				graduation: student.graduation || 0,
				creditsNeeded: student.creditsNeeded || 0,
				studies: student.studies.length > 0 ? Immutable.vector(student.studies) : Immutable.vector(),
				schedules: student.schedules.length > 0 ? Immutable.vector(student.schedules) : Immutable.vector(),
				// overrides: new OverrideStore(),
				// fabrications: new FabricationStore(),
			})
			this.dispatch(StudentConstants.STUDENT_CREATE, student)
		})
	},
	encode: function(student) {
		return new Promise(function(resolve, reject) {
			this.dispatch(StudentConstants.STUDENT_ENCODE, student)
		})
	},
	decode: function(student) {
		return new Promise(function(resolve, reject) {
			this.dispatch(StudentConstants.STUDENT_DECODE, student)
		})
	},
	undo: function() {
		return Promise.resolve(this.dispatch(StudentConstants.STUDENT_UNDO, {}))
	},
	save: function() {
		return Promise.resolve(this.dispatch(StudentConstants.STUDENT_SAVE, {}))
	},
	studentChanged: function() {
		return Promise.resolve(this.dispatch(StudentConstants.STUDENT_CHANGED, {}))
	},
}
